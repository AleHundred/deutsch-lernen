import { db } from "../db/db";
import { MAX_WEEK } from "./weeklyFocus";

export async function getCurrentWeek(): Promise<number> {
  const state = await db.appState.get("singleton");
  return state?.currentWeek ?? 1;
}

export async function advanceWeek(): Promise<number> {
  const state = await db.appState.get("singleton");
  const current = state?.currentWeek ?? 1;
  const next = Math.min(current + 1, MAX_WEEK);
  if (state) {
    await db.appState.update("singleton", { currentWeek: next });
  } else {
    await db.appState.add({ id: "singleton", currentWeek: next });
  }
  return next;
}
