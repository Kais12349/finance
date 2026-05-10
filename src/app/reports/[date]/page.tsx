import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { getReportByDate } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const report = await getReportByDate(date);
  if (!report) notFound();
  return (
    <Shell>
      <article className="rounded-lg border border-white/10 bg-zinc-950 p-6">
        <div className="font-mono text-sm text-emerald-300">{report.date}</div>
        <h1 className="mt-2 text-3xl font-semibold">{report.title}</h1>
        <pre className="mt-6 whitespace-pre-wrap font-sans text-sm leading-7 text-zinc-300">{report.content}</pre>
      </article>
    </Shell>
  );
}
