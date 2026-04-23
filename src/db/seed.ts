import { db } from "./db";
import {
  buildClassificationItems,
  SEED_VERSION,
} from "./seed-classification";
import type { DrillItem } from "./schema";

export async function seed(): Promise<void> {
  const existing = await db.appState.get("singleton");

  if (!existing) {
    await insertClassificationItems();
    await db.appState.add({
      id: "singleton",
      currentWeek: 1,
      seedVersion: SEED_VERSION,
    });
    return;
  }

  if (existing.seedVersion !== SEED_VERSION) {
    // Payload version changed — item UUIDs are regenerated, so SRS/session
    // rows referencing old IDs would orphan. Wipe them before reseeding.
    await db.drillItems.where("kind").equals("slot-classification").delete();
    await db.srsState.clear();
    await db.sessions.clear();
    await insertClassificationItems();
    await db.appState.update("singleton", { seedVersion: SEED_VERSION });
  }
}

async function insertClassificationItems(): Promise<void> {
  const items: DrillItem[] = buildClassificationItems().map((item) => ({
    ...item,
    id: crypto.randomUUID(),
  }));
  await db.drillItems.bulkAdd(items);
}
