import Link from "next/link";
import { financialDisclaimer } from "@/lib/constants";

const nav = [
  ["/", "实时"],
  ["/news", "全部新闻"],
  ["/categories", "分类"],
  ["/reports", "日报"],
  ["/search", "搜索"],
  ["/sources", "来源"],
  ["/watchlist", "关注"],
];

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#164e6344,transparent_32rem),#07090d] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Global Tech Finance Intel</Link>
          <nav className="flex flex-wrap gap-2 text-sm text-zinc-300">
            {nav.map(([href, label]) => (
              <Link key={href} href={href} className="rounded px-3 py-1.5 hover:bg-white/10 hover:text-white">{label}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 py-8 text-xs text-zinc-500">{financialDisclaimer} AI 仅用于摘要、分类、翻译和重要性判断，不替代原始来源。</footer>
    </div>
  );
}
