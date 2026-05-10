import { formatInTimeZone } from "date-fns-tz";
import { getDb } from "@/lib/db";

function section(title: string, lines: string[]) {
  return [`## ${title}`, ...(lines.length ? lines : ["暂无足够已入库新闻。"]), ""].join("\n");
}

export async function generateDailyReport(targetDate = new Date()) {
  const db = getDb();
  const date = formatInTimeZone(targetDate, "Asia/Shanghai", "yyyy-MM-dd");
  const start = new Date(`${date}T00:00:00+08:00`);
  const end = new Date(`${date}T23:59:59+08:00`);
  const articles = await db.newsArticle.findMany({
    where: { publishedAt: { gte: start, lte: end } },
    orderBy: [{ importance: "asc" }, { publishedAt: "desc" }],
    take: 80,
  });

  const top = articles
    .slice(0, 10)
    .map((item, index) => `${index + 1}. [${item.importance}/${item.credibility}] ${item.title} - ${item.source}`);
  const by = (keyword: string) =>
    articles
      .filter((item) => item.category.includes(keyword) || item.affectedAreas.includes(keyword))
      .slice(0, 8)
      .map((item) => `- ${item.title} (${item.source}, ${item.credibility})`);
  const risks = articles
    .filter((item) => item.credibility === "C" || item.importance === "高")
    .slice(0, 8)
    .map((item) => `- ${item.title}：${item.verificationStatus}`);

  const content = [
    `今日科技金融早报 - ${date}`,
    "",
    "说明：本报告只基于数据库中已抓取并保留原始链接的新闻生成；不构成投资建议。",
    "",
    section("今日重点新闻 Top 10", top),
    section("今日 AI 领域重点变化", by("AI")),
    section("今日美股可能受影响方向", by("美股")),
    section("今日芯片行业重点变化", by("芯片")),
    section("今日宏观金融重点变化", [...by("宏观"), ...by("利率")]),
    section("今日风险提示", risks),
  ].join("\n");

  const report = await db.dailyReport.upsert({
    where: { date },
    update: { title: `今日科技金融早报 ${date}`, content },
    create: { date, title: `今日科技金融早报 ${date}`, content },
  });

  return { report, sourceArticleCount: articles.length };
}
