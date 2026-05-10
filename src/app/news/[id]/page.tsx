import { notFound } from "next/navigation";
import { CategoryBadge, CredibilityBadge, ImportanceBadge } from "@/components/Badges";
import { Shell } from "@/components/Shell";
import { TimeZoneBar } from "@/components/TimeZoneBar";
import { getArticle } from "@/lib/dataStore";
import { financialDisclaimer } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();
  return (
    <Shell>
      <article className="rounded-lg border border-white/10 bg-zinc-950 p-6">
        <div className="flex flex-wrap gap-2"><CategoryBadge value={article.category} /><ImportanceBadge value={article.importance} /><CredibilityBadge value={article.credibility} /></div>
        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight">{article.title}</h1>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400"><span>{article.source}</span><a className="text-emerald-300 hover:underline" href={article.sourceUrl} target="_blank" rel="noreferrer">打开原文</a><span>发布：{article.publishedAt.toISOString()}</span><span>抓取：{article.fetchedAt.toISOString()}</span></div>
        <div className="mt-5"><TimeZoneBar beijingTime={article.beijingTime} newYorkTime={article.newYorkTime} losAngelesTime={article.losAngelesTime} londonTime={article.londonTime} /></div>
        <section className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
          <p className="whitespace-pre-line">{article.summaryZh}</p>
          <p>可能影响方向：{article.affectedAreas}</p>
          <p>真实性状态：{article.verificationStatus}</p>
          {article.originalSummary ? <p>原始摘要：{article.originalSummary}</p> : null}
          {article.credibility === "C" ? <p className="rounded border border-amber-400/30 bg-amber-500/10 p-3 text-amber-200">该消息尚未完全验证，请谨慎参考。</p> : null}
          <p className="rounded border border-white/10 bg-black/30 p-3 text-zinc-400">{financialDisclaimer}</p>
        </section>
      </article>
    </Shell>
  );
}
