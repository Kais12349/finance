import { getDb } from "../src/lib/db";
import { generateDailyReport } from "../src/lib/reports/daily";

async function main() {
  const result = await generateDailyReport();
  console.log(`Daily report generated for ${result.report.date} with ${result.sourceArticleCount} source articles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
