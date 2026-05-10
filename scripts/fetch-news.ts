import { getDb } from "../src/lib/db";
import { ensureDefaultSources } from "../src/lib/fetchers/ensureSources";
import { fetchEnabledSources } from "../src/lib/fetchers/rss";

async function main() {
  await ensureDefaultSources();
  const result = await fetchEnabledSources(12);
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) {
    console.warn("Some sources failed. The app keeps running and records successful sources.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
