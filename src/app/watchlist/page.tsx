import { revalidatePath } from "next/cache";
import { Shell } from "@/components/Shell";
import { getKeywords } from "@/lib/dataStore";
import { getDb } from "@/lib/db";

async function addKeyword(formData: FormData) {
  "use server";
  const keyword = String(formData.get("keyword") || "").trim();
  if (!keyword) return;
  try {
    await getDb().keywordWatch.upsert({
      where: { keyword },
      update: { category: String(formData.get("category") || ""), enabled: true },
      create: { keyword, category: String(formData.get("category") || ""), enabled: true },
    });
  } catch {
    return;
  }
  revalidatePath("/watchlist");
}

export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const keywords = await getKeywords();
  return (
    <Shell>
      <h1 className="mb-5 text-2xl font-semibold">关键词关注</h1>
      <form action={addKeyword} className="mb-6 grid gap-2 rounded-lg border border-white/10 bg-zinc-950 p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input required name="keyword" placeholder="OpenAI / NVIDIA / Fed / IPO" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <input name="category" placeholder="分类，可选" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <button className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-black">添加</button>
      </form>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{keywords.map((item) => <div key={item.id} className="rounded border border-white/10 bg-zinc-950 p-3"><div className="font-semibold">{item.keyword}</div><div className="mt-1 text-sm text-zinc-500">{item.category || "未指定分类"} · {item.enabled ? "启用" : "停用"}</div></div>)}</div>
    </Shell>
  );
}
