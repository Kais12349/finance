import { getDb } from "../src/lib/db";
import { defaultSources } from "../src/lib/fetchers/sources";
import { buildTimeZones } from "../src/lib/timezone";

async function main() {
  const db = getDb();
  for (const source of defaultSources) {
    await db.source.upsert({
      where: { name: source.name },
      update: source,
      create: source,
    });
  }

  const now = new Date();
  const samples = [
    {
      title: "[SAMPLE] NVIDIA announces quarterly results - sample item, not live news",
      source: "NVIDIA Investor Relations",
      sourceUrl: "https://investor.nvidia.com/news/default.aspx#sample-not-live",
      category: "财报",
      importance: "高",
      credibility: "A",
      affectedAreas: "AI, 美股, 芯片, 财报",
      originalSummary: "Sample placeholder using a real-style official source URL format. This is not a live fetched news item.",
      summaryZh: "【SAMPLE 示例数据，非实时新闻】这是一条用于验证页面和数据库流程的样例，不代表真实抓取结果。\n\n为什么重要：用于测试高重要性、A级可信度和多时区展示。",
      verificationStatus: "SAMPLE：示例数据，未作为真实新闻发布。",
    },
    {
      title: "[SAMPLE] Federal Reserve policy update - sample item, not live news",
      source: "Federal Reserve",
      sourceUrl: "https://www.federalreserve.gov/newsevents/pressreleases.htm#sample-not-live",
      category: "利率 / 美联储",
      importance: "高",
      credibility: "A",
      affectedAreas: "宏观, 美股, 监管",
      originalSummary: "Sample placeholder for macro policy flow testing.",
      summaryZh: "【SAMPLE 示例数据，非实时新闻】这是一条用于测试美联储/宏观分类的样例。\n\n为什么重要：用于测试宏观金融日报和分类页。",
      verificationStatus: "SAMPLE：示例数据，未作为真实新闻发布。",
    },
    {
      title: "[SAMPLE] Startup raises AI infrastructure round - sample item, not live news",
      source: "TechCrunch",
      sourceUrl: "https://techcrunch.com/#sample-not-live-ai-infra",
      category: "风投融资",
      importance: "中",
      credibility: "B",
      affectedAreas: "AI, 创业",
      originalSummary: "Sample placeholder for venture funding flow testing.",
      summaryZh: "【SAMPLE 示例数据，非实时新闻】这是一条用于测试风投融资和 AI 分类的样例。\n\n为什么重要：用于验证关键词关注和搜索功能。",
      verificationStatus: "SAMPLE：示例数据，未作为真实新闻发布。",
    },
  ];

  for (const item of samples) {
    await db.newsArticle.upsert({
      where: { sourceUrl: item.sourceUrl },
      update: {},
      create: {
        ...item,
        publishedAt: now,
        fetchedAt: now,
        rawContent: item.originalSummary,
        ...buildTimeZones(now),
      },
    });
  }

  for (const keyword of ["OpenAI", "NVIDIA", "Microsoft", "Fed", "interest rate", "AI chip", "IPO", "M&A", "crypto"]) {
    await db.keywordWatch.upsert({
      where: { keyword },
      update: {},
      create: { keyword, category: null, enabled: true },
    });
  }

  console.log(`Seed complete: ${defaultSources.length} sources, ${samples.length} sample articles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getDb().$disconnect();
  });
