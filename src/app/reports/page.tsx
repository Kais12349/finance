import { DailyReportCard } from "@/components/DailyReportCard";
import { Shell } from "@/components/Shell";
import { getReports } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await getReports();
  return (
    <Shell>
      <div className="mb-5"><h1 className="text-2xl font-semibold">每日情报报告</h1><p className="mt-1 text-sm text-zinc-500">每日自动抓取公开来源并生成报告。</p></div>
      <div className="grid gap-3">{reports.map((report) => <DailyReportCard key={report.id} report={report} />)}</div>
    </Shell>
  );
}
