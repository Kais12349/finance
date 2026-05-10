import { ensureDefaultSources } from "@/lib/fetchers/ensureSources";
import { fetchEnabledSources } from "@/lib/fetchers/rss";
import { generateDailyReport } from "@/lib/reports/daily";

export async function runDailyUpdate() {
  await ensureDefaultSources();
  const fetchResult = await fetchEnabledSources(12);
  const reportResult = await generateDailyReport();
  return {
    fetch: fetchResult,
    report: {
      date: reportResult.report.date,
      title: reportResult.report.title,
      sourceArticleCount: reportResult.sourceArticleCount,
    },
  };
}
