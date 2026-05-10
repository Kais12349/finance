export function TimeZoneBar(props: { beijingTime: string; newYorkTime: string; losAngelesTime: string; londonTime: string }) {
  const rows = [
    ["北京", props.beijingTime],
    ["美东", props.newYorkTime],
    ["美西", props.losAngelesTime],
    ["伦敦", props.londonTime],
  ];
  return (
    <div className="grid gap-2 text-xs text-zinc-400 sm:grid-cols-2 xl:grid-cols-4">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded border border-white/10 bg-black/20 px-2 py-1">
          <span className="text-zinc-500">{label}</span> <span className="font-mono text-zinc-300">{value}</span>
        </div>
      ))}
    </div>
  );
}
