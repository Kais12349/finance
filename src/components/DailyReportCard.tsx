import Link from "next/link";
import type { ReportRecord } from "@/lib/types";

export function DailyReportCard({ report }: { report: ReportRecord }) {
  return (
    <Link href={`/reports/${report.date}`} className="block rounded-lg border border-white/10 bg-zinc-950 p-4 hover:border-emerald-400/50">
      <div className="font-mono text-xs text-zinc-500">{report.date}</div>
      <h2 className="mt-2 text-lg font-semibold text-zinc-50">{report.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">{report.content}</p>
    </Link>
  );
}
