import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentWeek, advanceWeek } from "../plan/state";
import { buildSession, getPoolCounts, type PoolCounts } from "../srs/scheduler";
import { useSessionStore } from "../state/session";
import { MAX_WEEK } from "../plan/weeklyFocus";

export function Home() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [counts, setCounts] = useState<PoolCounts | null>(null);
  const [starting, setStarting] = useState(false);

  const refresh = async () => {
    const week = await getCurrentWeek();
    const c = await getPoolCounts(week);
    setCurrentWeek(week);
    setCounts(c);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const handleStart = async (size: number) => {
    if (starting || currentWeek === null) return;
    setStarting(true);
    try {
      const items = await buildSession({ sessionSize: size, currentWeek });
      if (items.length === 0) return;
      useSessionStore.getState().startSession(items);
      navigate("/drill");
    } finally {
      setStarting(false);
    }
  };

  const handleAdvance = async () => {
    if (currentWeek === null || currentWeek >= MAX_WEEK) return;
    if (!window.confirm(`Advance to week ${currentWeek + 1}?`)) return;
    await advanceWeek();
    await refresh();
  };

  if (currentWeek === null || counts === null) {
    return <div className="p-8 text-text/60">Loading…</div>;
  }

  const total = counts.due + counts.unseen + counts.weak;
  const canStart = total > 0;

  const floorCount = counts.due > 0
    ? Math.min(counts.due, 3)
    : Math.min(counts.unseen, 3);
  const floorCopy = counts.due > 0
    ? `${floorCount} item${floorCount === 1 ? "" : "s"} due`
    : counts.unseen > 0
      ? `${floorCount} new from this week`
      : "Nothing available";

  return (
    <div className="min-h-screen flex flex-col max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-12">
        Projekt Deutsch
      </h1>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-widest text-text/50 mb-3">
          Today's floor
        </div>
        <div className="text-lg mb-5">{floorCopy}</div>
        <button
          onClick={() => handleStart(3)}
          disabled={!canStart || starting}
          className="bg-accent text-bg font-medium px-6 py-3 rounded hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start
        </button>
      </section>

      <section className="mb-auto">
        <div className="text-xs uppercase tracking-widest text-text/50 mb-3">
          Full session
        </div>
        <div className="text-sm text-text/70 mb-5">
          15 items · ~5–7 min
          <div className="mt-1">
            {counts.due} due · {counts.unseen} new · {counts.weak} review
          </div>
        </div>
        <button
          onClick={() => handleStart(15)}
          disabled={!canStart || starting}
          className="border border-text/30 text-text px-5 py-2 rounded hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start 15-item session
        </button>
      </section>

      <footer className="pt-10 mt-10 flex items-center justify-between text-sm text-text/60 border-t border-text/10">
        <span>Week {currentWeek} of {MAX_WEEK}</span>
        {currentWeek < MAX_WEEK && (
          <button onClick={handleAdvance} className="hover:text-accent">
            Advance to week {currentWeek + 1} →
          </button>
        )}
      </footer>
    </div>
  );
}
