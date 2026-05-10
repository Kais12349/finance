import Link from "next/link";
import { Shell } from "@/components/Shell";
import { getCategoryCounts } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();
  return (
    <Shell>
      <h1 className="mb-5 text-2xl font-semibold">分类总览</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((item) => (
          <Link key={item.category} href={`/categories/${encodeURIComponent(item.category)}`} className="rounded-lg border border-white/10 bg-zinc-950 p-4 hover:border-emerald-400/50">
            <div className="text-lg font-semibold">{item.category}</div>
            <div className="mt-2 font-mono text-sm text-zinc-500">{item.count} articles</div>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
