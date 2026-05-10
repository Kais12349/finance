import { getDb } from "@/lib/db";
import { defaultSources } from "@/lib/fetchers/sources";

export async function ensureDefaultSources() {
  const db = getDb();
  for (const source of defaultSources) {
    await db.source.upsert({
      where: { name: source.name },
      update: {},
      create: source,
    });
  }
}
