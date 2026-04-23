import { db } from "./db";
import { buildClassificationItems } from "./seed-classification";
import type { DrillItem } from "./schema";

export async function seed(): Promise<void> {
  const drillCount = await db.drillItems.count();
  if (drillCount === 0) {
    const items: DrillItem[] = buildClassificationItems().map((item) => ({
      ...item,
      id: crypto.randomUUID(),
    }));
    await db.drillItems.bulkAdd(items);
  }

  const existing = await db.appState.get("singleton");
  if (!existing) {
    await db.appState.add({
      id: "singleton",
      currentWeek: 1,
    });
  }
}
