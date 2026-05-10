import { NewsCard } from "@/components/NewsCard";
import { SearchBar } from "@/components/SearchBar";
import { Shell } from "@/components/Shell";
import { categories } from "@/lib/constants";
import { getHomeData } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { articles, total, high, latestReport } = await getHomeData();

  return (
    <Shell>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_24rem]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">Realtime intelligence terminal</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-zinc-50 md:text-5xl">全球科技金融实时情报</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400">聚合公开 RSS、官方公告和一线媒体来源；所有信息保留原始链接，AI 只做摘要、分类和重要性判断。</p>
          <div className="mt-5 max-w-2xl"><SearchBar /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="历史新闻" value={total} />
          <Metric label="高重要性" value={high} />
          <Metric label="分类数" value={categories.length} />
          <Metric label="最新日报" value={latestReport?.date || "未生成"} />
        </div>
      </section>
      <section className="grid gap-4">
        {articles.length ? articles.map((article) => <NewsCard key={article.id} article={article} />) : <EmptyState />}
      </section>
    </Shell>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/80 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 font-mono text-2xl font-semibold text-zinc-50">{value}</div>
    </div>
  );
}

function EmptyState() {
  return <div className="rounded-lg border border-white/10 bg-zinc-950 p-8 text-zinc-400">暂无新闻。系统会在下一次更新后自动填充。</div>;
}
