import Link from "next/link";
import { CategoryBadge, CredibilityBadge, ImportanceBadge } from "@/components/Badges";
import { TimeZoneBar } from "@/components/TimeZoneBar";
import { displayDate } from "@/lib/timezone";
import type { ArticleRecord } from "@/lib/types";

export function NewsCard({ article }: { article: ArticleRecord }) {
  return (
    <article className="rounded-lg border border-white/10 bg-zinc-950/80 p-4 shadow-2xl shadow-black/20">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge value={article.category} />
        <ImportanceBadge value={article.importance} />
        <CredibilityBadge value={article.credibility} />
        <span className="font-mono text-xs text-zinc-500">抓取 {displayDate(article.fetchedAt)}</span>
      </div>
      <Link href={`/news/${article.id}`} className="block text-lg font-semibold leading-7 text-zinc-50 hover:text-emerald-300">
        {article.title}
      </Link>
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-400">
        <span>{article.source}</span>
        <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="text-emerald-300 hover:underline">
          原文链接
        </a>
        <span className="font-mono">发布 {displayDate(article.publishedAt)}</span>
      </div>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-300">{article.summaryZh}</p>
      {article.credibility === "C" ? <p className="mt-3 rounded border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">该消息尚未完全验证，请谨慎参考。</p> : null}
      <div className="mt-3 text-sm text-zinc-400">可能影响方向：{article.affectedAreas}</div>
      <div className="mt-3">
        <TimeZoneBar beijingTime={article.beijingTime} newYorkTime={article.newYorkTime} losAngelesTime={article.losAngelesTime} londonTime={article.londonTime} />
      </div>
    </article>
  );
}
