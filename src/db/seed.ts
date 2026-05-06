import { db } from "./db";
import { buildClassificationItems } from "./seed-classification";
import type { DrillItem } from "./schema";

export async function seed(): Promise<void> {
  // TODO: replace this wipe-and-reseed with a proper migration before serious drilling.
  // It throws away SRS state and session history on every load. Acceptable during the
  // v0.1 post-pivot infrastructure work (slot-classification is deprecated and the new
  // drill kinds have no real seed yet) — unacceptable once production drills ship.
  await db.drillItems.clear();
  await db.srsState.clear();
  await db.sessions.clear();

  await insertClassificationItems();

  const existing = await db.appState.get("singleton");
  if (!existing) {
    await db.appState.add({
      id: "singleton",
      currentWeek: 1,
    });
  }
}

async function insertClassificationItems(): Promise<void> {
  const items: DrillItem[] = buildClassificationItems().map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));
  await db.drillItems.bulkAdd(items);
}
