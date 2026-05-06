import { describe, it, expect } from "vitest";
import { selectItems } from "./scheduler";
import type { DrillItem, SRSState } from "../db/schema";

function mkItem(partial: Partial<DrillItem> & { id: string }): DrillItem {
  return {
    kind: "slot-classification",
    params: { phrase: "x", correctSlot: "Te", subtype: "test" },
    rule: `rule-${partial.id}`,
    grammarTopic: "v2-word-order",
    difficulty: 1,
    ...partial,
  } as DrillItem;
}

function mkSrs(partial: Partial<SRSState> & { itemId: string }): SRSState {
  return {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date(0).toISOString(),
    totalAttempts: 0,
    totalCorrect: 0,
    recentAttempts: [],
    ...partial,
  };
}

const baseOpts = {
  sessionSize: 15,
  currentWeek: 1,
  now: new Date("2026-05-01T12:00:00Z"),
  rng: () => 0.5,
};

describe("scheduler.selectItems", () => {
  it("empty DB returns empty", () => {
    expect(selectItems({ ...baseOpts, items: [], srsRows: [] })).toEqual([]);
  });

  it("all-new returns unseen items only", () => {
    const items = [
      mkItem({ id: "a" }),
      mkItem({ id: "b" }),
      mkItem({ id: "c" }),
    ];
    const result = selectItems({ ...baseOpts, items, srsRows: [] });
    expect(result).toHaveLength(3);
    const ids = new Set(result.map((r) => r.id));
    expect(ids).toEqual(new Set(["a", "b", "c"]));
  });

  it("due items prioritized over new when both exist", () => {
    const due = Array.from({ length: 15 }, (_, i) => mkItem({ id: `d${i}` }));
    const unseen = Array.from({ length: 15 }, (_, i) => mkItem({ id: `u${i}` }));
    const srsRows = due.map((d) =>
      mkSrs({
        itemId: d.id,
        nextReview: new Date("2026-04-01T00:00:00Z").toISOString(),
        totalAttempts: 1,
        totalCorrect: 1,
      }),
    );
    const result = selectItems({
      ...baseOpts,
      items: [...due, ...unseen],
      srsRows,
    });
    const dueTaken = result.filter((i) => i.id.startsWith("d")).length;
    const newTaken = result.filter((i) => i.id.startsWith("u")).length;
    expect(result).toHaveLength(15);
    expect(dueTaken).toBeGreaterThan(newTaken);
  });

  it("weak-rule bucket activates only after >5 attempts with <70% accuracy", () => {
    const items = [
      mkItem({ id: "a", rule: "weak-rule" }),
      mkItem({ id: "b", rule: "weak-rule" }),
    ];
    const future = new Date("2030-01-01T00:00:00Z").toISOString();

    // 6 attempts, 2 correct → 33% accuracy, >5 attempts → rule is weak.
    const srsWeak = [
      mkSrs({ itemId: "a", totalAttempts: 3, totalCorrect: 1, nextReview: future }),
      mkSrs({ itemId: "b", totalAttempts: 3, totalCorrect: 1, nextReview: future }),
    ];
    const weakResult = selectItems({ ...baseOpts, items, srsRows: srsWeak });
    expect(weakResult.length).toBeGreaterThan(0);

    // 4 attempts total → not weak. Not due (future), not unseen (has SRS) → empty.
    const srsNotWeak = [
      mkSrs({ itemId: "a", totalAttempts: 2, totalCorrect: 0, nextReview: future }),
      mkSrs({ itemId: "b", totalAttempts: 2, totalCorrect: 0, nextReview: future }),
    ];
    const notWeakResult = selectItems({ ...baseOpts, items, srsRows: srsNotWeak });
    expect(notWeakResult).toEqual([]);

    // 8 attempts, 7 correct → 87.5% accuracy, >5 attempts but accuracy OK → not weak.
    const srsAccurate = [
      mkSrs({ itemId: "a", totalAttempts: 4, totalCorrect: 4, nextReview: future }),
      mkSrs({ itemId: "b", totalAttempts: 4, totalCorrect: 3, nextReview: future }),
    ];
    const accurateResult = selectItems({ ...baseOpts, items, srsRows: srsAccurate });
    expect(accurateResult).toEqual([]);
  });

  it("currentWeek filter excludes off-topic items", () => {
    const items = [
      mkItem({ id: "inweek", grammarTopic: "v2-word-order" }),
      mkItem({ id: "outweek", grammarTopic: "konjunktiv2" }),
    ];
    const result = selectItems({
      ...baseOpts,
      items,
      srsRows: [],
      currentWeek: 1,
    });
    expect(result.map((r) => r.id)).toEqual(["inweek"]);
  });

  it("includes all topics when currentWeek's review is 'all' (week 12)", () => {
    const items = [
      mkItem({ id: "x", grammarTopic: "konjunktiv2" }),
      mkItem({ id: "y", grammarTopic: "tekamolo" }),
    ];
    const result = selectItems({
      ...baseOpts,
      items,
      srsRows: [],
      currentWeek: 12,
    });
    expect(result).toHaveLength(2);
  });
});
