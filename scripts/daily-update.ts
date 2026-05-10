import { getDb } from "../src/lib/db";
import { runDailyUpdate } from "../src/lib/dailyUpdate";

async function main() {
  const result = await runDailyUpdate();
  console.log(JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
