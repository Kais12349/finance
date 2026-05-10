import clsx from "clsx";

export function CredibilityBadge({ value }: { value: string }) {
  return (
    <span className={clsx("rounded px-2 py-1 text-xs font-semibold", value === "A" && "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30", value === "B" && "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30", value === "C" && "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30")}>
      可信度 {value}
    </span>
  );
}

export function ImportanceBadge({ value }: { value: string }) {
  return (
    <span className={clsx("rounded px-2 py-1 text-xs font-semibold", value === "高" && "bg-red-500/15 text-red-300 ring-1 ring-red-400/30", value === "中" && "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/30", value === "低" && "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-400/30")}>
      重要性 {value}
    </span>
  );
}

export function CategoryBadge({ value }: { value: string }) {
  return <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200 ring-1 ring-white/10">{value}</span>;
}
