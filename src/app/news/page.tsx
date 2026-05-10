import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { Shell } from "@/components/Shell";
import { getArticles } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function NewsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const range = Number(params.range || 0);
  const articles = await getArticles(range || undefined);
  return (
    <Shell>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-semibold">全部新闻</h1><p className="mt-1 text-sm text-zinc-500">支持查看全部历史，以及过去 7 / 30 / 90 天。</p></div>
        <div className="flex gap-2 text-sm">
          <Link className="rounded bg-zinc-900 px-3 py-2" href="/news?range=7">7 天</Link>
          <Link className="rounded bg-zinc-900 px-3 py-2" href="/news?range=30">30 天</Link>
          <Link className="rounded bg-zinc-900 px-3 py-2" href="/news?range=90">90 天</Link>
          <Link className="rounded bg-zinc-900 px-3 py-2" href="/news">全部</Link>
        </div>
      </div>
      <div className="grid gap-4">{articles.map((article) => <NewsCard key={article.id} article={article} />)}</div>
    </Shell>
  );
}
