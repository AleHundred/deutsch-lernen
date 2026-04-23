import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore, type Attempt } from "../state/session";
import { db } from "../db/db";
import type { DrillItem } from "../db/schema";

export function SessionSummary() {
  const navigate = useNavigate();
  const storeItems = useSessionStore((s) => s.items);
  const storeAttempts = useSessionStore((s) => s.attempts);
  const reset = useSessionStore((s) => s.reset);

  const [items, setItems] = useState<DrillItem[]>(storeItems);
  const [attempts, setAttempts] = useState<Attempt[]>(storeAttempts);
  const [loading, setLoading] = useState(storeAttempts.length === 0);

  useEffect(() => {
    if (storeAttempts.length > 0) return;
    (async () => {
      const sessions = await db.sessions
        .orderBy("startedAt")
        .reverse()
        .limit(1)
        .toArray();
      const last = sessions[0];
      if (!last) {
        setLoading(false);
        return;
      }
      const itemIds = Array.from(new Set(last.attempts.map((a) => a.itemId)));
      const fetched = await db.drillItems.bulkGet(itemIds);
      setItems(fetched.filter((i): i is DrillItem => !!i));
      setAttempts(last.attempts);
      setLoading(false);
    })();
  }, [storeAttempts.length]);

  const handleBack = () => {
    reset();
    navigate("/");
  };

  if (loading) {
    return <div className="p-8 text-text/60">Loading…</div>;
  }

  if (attempts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col max-w-xl mx-auto px-6 py-10">
        <div className="text-text/70 mb-6">No session data.</div>
        <button
          onClick={handleBack}
          className="self-start bg-accent text-bg font-medium px-6 py-3 rounded hover:opacity-90"
        >
          Back to home
        </button>
      </div>
    );
  }

  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const medianMs = median(attempts.map((a) => a.responseTimeMs));

  const itemById = new Map(items.map((i) => [i.id, i]));
  const byRule = new Map<string, Attempt[]>();
  for (const a of attempts) {
    const rule = itemById.get(a.itemId)?.rule ?? "unknown";
    const list = byRule.get(rule) ?? [];
    list.push(a);
    byRule.set(rule, list);
  }

  const ruleStats = Array.from(byRule.entries())
    .map(([rule, as]) => {
      const c = as.filter((a) => a.correct).length;
      const n = as.length;
      const correctRts = as.filter((a) => a.correct).map((a) => a.responseTimeMs);
      const medianCorrectMs = correctRts.length > 0 ? median(correctRts) : 0;
      return {
        rule,
        correct: c,
        total: n,
        accuracy: c / n,
        declarative: c > 0 && medianCorrectMs > 4000,
        medianCorrectMs,
      };
    })
    .sort((a, b) =>
      a.accuracy !== b.accuracy
        ? a.accuracy - b.accuracy
        : a.rule.localeCompare(b.rule),
    );

  const declarativeRules = ruleStats.filter((r) => r.declarative);

  return (
    <div className="min-h-screen flex flex-col max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-10">
        Session summary
      </h1>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <div className="text-xs uppercase tracking-widest text-text/50 mb-1">
            Correct
          </div>
          <div className="text-3xl font-mono">
            {correct} / {total}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-text/50 mb-1">
            Median time
          </div>
          <div className="text-3xl font-mono">
            {(medianMs / 1000).toFixed(1)}s
          </div>
        </div>
      </div>

      {declarativeRules.length > 0 && (
        <div className="mb-10 border border-accent/40 bg-accent/5 rounded p-4">
          <div className="text-sm text-accent mb-3">
            Declarative, not yet automatic — worth more drilling
          </div>
          <ul className="space-y-1.5 text-sm font-mono">
            {declarativeRules.map((r) => (
              <li key={r.rule} className="flex justify-between">
                <span>{r.rule}</span>
                <span className="text-text/60">
                  {r.correct}/{r.total} · {(r.medianCorrectMs / 1000).toFixed(1)}s
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="mb-auto">
        <div className="text-xs uppercase tracking-widest text-text/50 mb-3">
          Per rule
        </div>
        <ul className="space-y-1.5">
          {ruleStats.map((r) => (
            <li
              key={r.rule}
              className="flex justify-between text-sm font-mono"
            >
              <span>{r.rule}</span>
              <span className="text-text/70">
                {r.correct}/{r.total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <button
        onClick={handleBack}
        className="mt-12 self-start bg-accent text-bg font-medium px-6 py-3 rounded hover:opacity-90"
      >
        Back to home
      </button>
    </div>
  );
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = nums.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}
