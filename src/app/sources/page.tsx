import { revalidatePath } from "next/cache";
import { Shell } from "@/components/Shell";
import { getSources } from "@/lib/dataStore";
import { getDb } from "@/lib/db";

async function addSource(formData: FormData) {
  "use server";
  try {
    await getDb().source.upsert({
      where: { name: String(formData.get("name") || "") },
      update: {
        url: String(formData.get("url") || ""),
        type: String(formData.get("type") || "rss"),
        credibilityBase: String(formData.get("credibilityBase") || "B"),
        enabled: true,
      },
      create: {
        name: String(formData.get("name") || ""),
        url: String(formData.get("url") || ""),
        type: String(formData.get("type") || "rss"),
        credibilityBase: String(formData.get("credibilityBase") || "B"),
        enabled: true,
      },
    });
  } catch {
    return;
  }
  revalidatePath("/sources");
}

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await getSources();
  return (
    <Shell>
      <h1 className="mb-5 text-2xl font-semibold">信息源管理</h1>
      <form action={addSource} className="mb-6 grid gap-2 rounded-lg border border-white/10 bg-zinc-950 p-4 md:grid-cols-[1fr_1.5fr_0.7fr_0.5fr_auto]">
        <input required name="name" placeholder="来源名称" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <input required name="url" placeholder="RSS 或官方公开链接" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <input name="type" placeholder="rss / official_rss" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <select name="credibilityBase" className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm"><option>A</option><option>B</option><option>C</option></select>
        <button className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-black">添加</button>
      </form>
      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-400"><tr><th className="p-3">名称</th><th className="p-3">类型</th><th className="p-3">基础可信度</th><th className="p-3">状态</th><th className="p-3">URL</th></tr></thead>
          <tbody>{sources.map((source) => <tr key={source.id} className="border-t border-white/10"><td className="p-3">{source.name}</td><td className="p-3">{source.type}</td><td className="p-3">{source.credibilityBase}</td><td className="p-3">{source.enabled ? "启用" : "停用"}</td><td className="p-3"><a className="text-emerald-300 hover:underline" href={source.url} target="_blank" rel="noreferrer">打开</a></td></tr>)}</tbody>
        </table>
      </div>
    </Shell>
  );
}
