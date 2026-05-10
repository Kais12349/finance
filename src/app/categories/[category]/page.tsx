import { NewsCard } from "@/components/NewsCard";
import { Shell } from "@/components/Shell";
import { getArticlesByCategory } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const articles = await getArticlesByCategory(decoded);
  return (
    <Shell>
      <h1 className="mb-5 text-2xl font-semibold">{decoded}</h1>
      <div className="grid gap-4">{articles.map((article) => <NewsCard key={article.id} article={article} />)}</div>
    </Shell>
  );
}
