export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" className="flex flex-col gap-2 sm:flex-row">
      <input name="q" defaultValue={defaultValue} placeholder="OpenAI, NVIDIA, Fed, IPO, crypto..." className="min-h-11 flex-1 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-zinc-100 outline-none focus:border-emerald-400" />
      <button className="min-h-11 rounded-md bg-emerald-500 px-5 text-sm font-semibold text-black hover:bg-emerald-400">搜索</button>
    </form>
  );
}
