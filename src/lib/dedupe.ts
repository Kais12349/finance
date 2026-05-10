export function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function similarity(a: string, b: string) {
  const left = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const right = new Set(normalizeTitle(b).split(" ").filter(Boolean));
  if (!left.size || !right.size) return 0;
  const overlap = [...left].filter((token) => right.has(token)).length;
  return overlap / Math.max(left.size, right.size);
}
