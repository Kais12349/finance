const officialSignals = ["sec.gov", "federalreserve.gov", "bls.gov", "bea.gov", "investor.", "ir.", "newsroom.", "openai.com", "nvidia.com", "microsoft.com"];
const tierOneSignals = ["reuters.com", "cnbc.com", "theverge.com", "techcrunch.com", "marketwatch.com", "coindesk.com", "wired.com", "arstechnica.com", "finance.yahoo.com"];

export function assessCredibility(url: string, sourceName: string, base?: string) {
  const value = `${url} ${sourceName}`.toLowerCase();
  if (base === "A" || officialSignals.some((signal) => value.includes(signal))) {
    return { credibility: "A", verificationStatus: "已验证：官方来源或高可信来源" };
  }
  if (base === "B" || tierOneSignals.some((signal) => value.includes(signal))) {
    return { credibility: "B", verificationStatus: "已验证：单家一线媒体公开报道" };
  }
  return { credibility: "C", verificationStatus: "未验证：该消息尚未完全验证，请谨慎参考。" };
}
