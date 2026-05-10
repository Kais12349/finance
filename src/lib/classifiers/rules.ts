import { affectedAreas } from "@/lib/constants";

const rules: Array<{ category: string; words: string[] }> = [
  { category: "AI", words: ["openai", "anthropic", "ai", "artificial intelligence", "llm", "model", "chatgpt", "gemini"] },
  { category: "芯片", words: ["nvidia", "amd", "intel", "tsmc", "asml", "chip", "semiconductor", "gpu", "qualcomm", "broadcom"] },
  { category: "美股", words: ["nasdaq", "s&p", "stock", "shares", "wall street", "marketwatch", "earnings"] },
  { category: "宏观经济", words: ["inflation", "jobs", "gdp", "cpi", "ppi", "treasury", "macro", "economy"] },
  { category: "加密货币", words: ["bitcoin", "ethereum", "crypto", "coinbase", "binance", "stablecoin", "etf"] },
  { category: "风投融资", words: ["funding", "venture", "vc", "startup", "raises", "seed round", "series a"] },
  { category: "IPO", words: ["ipo", "listing", "public offering", "files to go public"] },
  { category: "M&A 并购", words: ["acquire", "acquisition", "merger", "takeover", "deal", "m&a"] },
  { category: "政策监管", words: ["sec", "ftc", "doj", "regulator", "regulation", "antitrust", "policy", "ban"] },
  { category: "财报", words: ["earnings", "revenue", "quarter", "guidance", "profit", "loss"] },
  { category: "利率 / 美联储", words: ["fed", "federal reserve", "interest rate", "fomc", "powell", "rate cut", "rate hike"] },
];

export function classifyArticle(title: string, summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  const matched = rules.find((rule) => rule.words.some((word) => text.includes(word)));
  return matched?.category ?? "科技公司";
}

export function inferAffectedAreas(title: string, summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  const areas = affectedAreas.filter((area) => {
    if (area === "AI") return /\b(ai|openai|model|llm|anthropic|gemini)\b/.test(text);
    if (area === "美股") return /stock|shares|nasdaq|s&p|earnings|market/.test(text);
    if (area === "芯片") return /chip|nvidia|amd|intel|tsmc|asml|gpu|semiconductor/.test(text);
    if (area === "宏观") return /fed|inflation|gdp|jobs|rate|cpi|ppi|treasury/.test(text);
    if (area === "加密货币") return /crypto|bitcoin|ethereum|coinbase|binance|stablecoin/.test(text);
    if (area === "创业") return /startup|venture|funding|raises|seed|series/.test(text);
    if (area === "监管") return /sec|ftc|doj|regulation|antitrust|policy|lawsuit/.test(text);
    if (area === "财报") return /earnings|revenue|quarter|guidance|profit/.test(text);
    if (area === "并购") return /acquire|acquisition|merger|takeover|m&a/.test(text);
    return false;
  });
  return areas.length ? areas.join(", ") : classifyArticle(title, summary);
}

export function inferImportance(title: string, summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  if (/sec filing|federal reserve|fomc|acquire|merger|ipo|earnings|layoffs|antitrust|lawsuit|nvidia|openai|fed/.test(text)) return "高";
  if (/funding|launch|partnership|guidance|regulation|chip|crypto|rates/.test(text)) return "中";
  return "低";
}
