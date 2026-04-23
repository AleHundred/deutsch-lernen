import { db } from "../db/db";
import { weeklyFocus } from "../plan/weeklyFocus";
import type { DrillItem, GrammarTopic, SRSState } from "../db/schema";

export interface BuildSessionOptions {
  sessionSize: number;
  dueWeight?: number;
  newWeight?: number;
  weakRuleWeight?: number;
  currentWeek: number;
}

export async function buildSession(
  opts: BuildSessionOptions,
): Promise<DrillItem[]> {
  const items = await db.drillItems.toArray();
  const srsRows = await db.srsState.toArray();
  return selectItems({ ...opts, items, srsRows, now: new Date() });
}

export interface SelectItemsInput extends BuildSessionOptions {
  items: DrillItem[];
  srsRows: SRSState[];
  now: Date;
  rng?: () => number;
}

export function selectItems(input: SelectItemsInput): DrillItem[] {
  const {
    items,
    srsRows,
    now,
    sessionSize,
    dueWeight = 0.6,
    newWeight = 0.3,
    weakRuleWeight = 0.1,
    currentWeek,
    rng = Math.random,
  } = input;

  const week = weeklyFocus[currentWeek];
  if (!week) return [];
  const primary = new Set<GrammarTopic>(week.primary);
  const reviewAll = week.review === "all";
  const review = new Set<GrammarTopic>(reviewAll ? [] : week.review);
  const inAllowed = (t: GrammarTopic) =>
    reviewAll || primary.has(t) || review.has(t);

  const allowed = items.filter((i) => inAllowed(i.grammarTopic));
  if (allowed.length === 0) return [];

  const srsByItemId = new Map<string, SRSState>();
  for (const r of srsRows) srsByItemId.set(r.itemId, r);
  const nowIso = now.toISOString();

  const duePool: DrillItem[] = [];
  const unseenPool: DrillItem[] = [];
  for (const item of allowed) {
    const srs = srsByItemId.get(item.id);
    if (!srs) unseenPool.push(item);
    else if (srs.nextReview <= nowIso) duePool.push(item);
  }

  // Rule-level weak aggregation: a rule is "weak" if attempts across its items
  // total >5 with accuracy <0.7. All items of a weak rule go in the weak pool.
  const ruleStats = new Map<string, { attempts: number; correct: number }>();
  for (const item of allowed) {
    const srs = srsByItemId.get(item.id);
    if (!srs || srs.totalAttempts === 0) continue;
    const s = ruleStats.get(item.rule) ?? { attempts: 0, correct: 0 };
    s.attempts += srs.totalAttempts;
    s.correct += srs.totalCorrect;
    ruleStats.set(item.rule, s);
  }
  const weakRules = new Set<string>();
  for (const [rule, s] of ruleStats) {
    if (s.attempts > 5 && s.correct / s.attempts < 0.7) weakRules.add(rule);
  }
  const weakPool = allowed.filter((i) => weakRules.has(i.rule));

  let dueCount: number;
  let newCount: number;
  let weakCount: number;
  if (duePool.length === 0) {
    dueCount = 0;
    newCount = Math.floor(sessionSize * 0.7);
    weakCount = sessionSize - newCount;
  } else {
    dueCount = Math.floor(sessionSize * dueWeight);
    newCount = Math.floor(sessionSize * newWeight);
    weakCount = Math.floor(sessionSize * weakRuleWeight);
    dueCount += sessionSize - (dueCount + newCount + weakCount);
  }

  const picked = new Set<string>();
  const result: DrillItem[] = [];

  const take = (pool: DrillItem[], n: number): number => {
    if (n <= 0) return 0;
    const available = shuffle(
      pool.filter((i) => !picked.has(i.id)),
      rng,
    );
    const taken = available.slice(0, n);
    for (const item of taken) {
      picked.add(item.id);
      result.push(item);
    }
    return taken.length;
  };

  // Due bucket: 70% primary / 30% review, with spill either direction.
  if (dueCount > 0) {
    const duePrimary = duePool.filter((i) => primary.has(i.grammarTopic));
    const dueReview = duePool.filter((i) => !primary.has(i.grammarTopic));
    const primaryTarget = Math.floor(dueCount * 0.7);
    const reviewTarget = dueCount - primaryTarget;
    const pTaken = take(duePrimary, primaryTarget);
    const rTaken = take(dueReview, reviewTarget + (primaryTarget - pTaken));
    take(duePrimary, dueCount - pTaken - rTaken);
  }

  take(weakPool, weakCount);
  take(unseenPool, newCount);

  // Shortfall fill: if buckets under-filled the session but content remains,
  // top up in priority order due → weak → new. Does not pad when total available
  // across all pools is less than sessionSize.
  if (result.length < sessionSize) {
    take(duePool, sessionSize - result.length);
  }
  if (result.length < sessionSize) {
    take(weakPool, sessionSize - result.length);
  }
  if (result.length < sessionSize) {
    take(unseenPool, sessionSize - result.length);
  }

  return shuffle(result, rng);
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
