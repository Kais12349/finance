import { NewsCard } from "@/components/NewsCard";
import { SearchBar } from "@/components/SearchBar";
import { Shell } from "@/components/Shell";
import { searchArticles } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { q = "", source = "", category = "", date = "" } = await searchParams;
  const query = q.trim();
  const articles = await searchArticles({ q: query, source, category, date });
  return (
    <Shell>
      <h1 className="mb-4 text-2xl font-semibold">搜索历史新闻</h1>
      <SearchBar defaultValue={query} />
      <form action="/search" className="mt-3 grid gap-2 sm:grid-cols-4">
        <input type="hidden" name="q" value={query} />
        <input name="source" defaultValue={source} placeholder="来源" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <input name="category" defaultValue={category} placeholder="分类" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <input name="date" defaultValue={date} type="date" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <button className="rounded bg-zinc-800 px-3 py-2 text-sm">筛选</button>
      </form>
      <div className="mt-5 grid gap-4">{articles.map((article) => <NewsCard key={article.id} article={article} />)}</div>
    </Shell>
  );
}
