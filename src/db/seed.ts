import { db } from "./db";
import { buildClassificationItems } from "./seed-classification";
import type { DrillItem } from "./schema";

export async function seed(): Promise<void> {
  // TODO: before real drilling, replace wipe-and-reseed with a proper migration.
  // This throws away SRS state on every load.
  await db.drillItems.where("kind").equals("slot-classification").delete();
  await db.srsState.clear();
  await db.sessions.clear();

  const items: DrillItem[] = buildClassificationItems().map((item) => ({
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
