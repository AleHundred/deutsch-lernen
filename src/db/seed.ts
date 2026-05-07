import { db } from "./db";
import { buildClassificationItems } from "./seed-classification";
import { buildCaseSelectionItems } from "./seed-case-selection";
import type { DrillItem } from "./schema";

export async function seed(): Promise<void> {
  // TODO: replace this wipe-and-reseed with a proper migration before serious drilling.
  // It throws away SRS state and session history on every load. Acceptable during the
  // v0.1 post-pivot infrastructure work — unacceptable once production drills ship.
  await db.drillItems.clear();
  await db.srsState.clear();
  await db.sessions.clear();

  const items: DrillItem[] = [
    ...buildClassificationItems(),
    ...buildCaseSelectionItems(),
  ].map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));
  await db.drillItems.bulkAdd(items);

  const existing = await db.appState.get("singleton");
  if (!existing) {
    await db.appState.add({
      id: "singleton",
      currentWeek: 1,
    });
  }
}
