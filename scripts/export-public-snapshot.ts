import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getDb } from "../src/lib/db";

async function main() {
  const db = getDb();
  const [articles, sources, reports, keywords] = await Promise.all([
    db.newsArticle.findMany({ orderBy: { publishedAt: "desc" }, take: 500 }),
    db.source.findMany({ orderBy: { name: "asc" } }),
    db.dailyReport.findMany({ orderBy: { date: "desc" }, take: 120 }),
    db.keywordWatch.findMany({ orderBy: { keyword: "asc" } }),
  ]);

  const snapshot = {
    exportedAt: new Date().toISOString(),
    articles,
    sources,
    reports,
    keywords,
  };

  const target = resolve("data/public-snapshot.json");
  await writeFile(target, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(`Exported public snapshot: ${articles.length} articles, ${sources.length} sources, ${reports.length} reports, ${keywords.length} keywords.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
