import Parser from "rss-parser";
import { getDb } from "@/lib/db";
import { classifyArticle, inferAffectedAreas, inferImportance } from "@/lib/classifiers/rules";
import { buildTimeZones } from "@/lib/timezone";
import { assessCredibility } from "@/lib/verifier";
import { summarizeArticle } from "@/lib/summarizer";
import { similarity } from "@/lib/dedupe";

const parser = new Parser();

function clean(text?: string) {
  return (text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function fetchEnabledSources(limitPerSource = 12) {
  const db = getDb();
  const sources = await db.source.findMany({ where: { enabled: true } });
  const results = { inserted: 0, skipped: 0, errors: [] as string[] };

  for (const source of sources) {
    try {
      const feed = await fetchFeed(source.url);
      const items = feed.items.slice(0, limitPerSource);
      for (const item of items) {
        const title = clean(item.title);
        const link = item.link || item.guid || "";
        if (!title || !link) {
          results.skipped += 1;
          continue;
        }
        const existingUrl = await db.newsArticle.findUnique({ where: { sourceUrl: link } });
        if (existingUrl) {
          results.skipped += 1;
          continue;
        }
        const recent = await db.newsArticle.findMany({
          where: { publishedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
          select: { title: true },
          orderBy: { publishedAt: "desc" },
          take: 200,
        });
        if (recent.some((article) => similarity(article.title, title) > 0.86)) {
          results.skipped += 1;
          continue;
        }

        const publishedAt = item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : new Date();
        const fetchedAt = new Date();
        const originalSummary = clean(item.contentSnippet || item.content || item.summary);
        const category = classifyArticle(title, originalSummary);
        const credibility = assessCredibility(link, source.name, source.credibilityBase);
        const summary = await summarizeArticle({ title, source: source.name, originalSummary });

        await db.newsArticle.create({
          data: {
            title,
            source: source.name,
            sourceUrl: link,
            publishedAt,
            fetchedAt,
            summaryZh: `${summary.summaryZh}\n\n为什么重要：${summary.whyImportant}`,
            originalSummary,
            category,
            importance: inferImportance(title, originalSummary),
            credibility: credibility.credibility,
            affectedAreas: inferAffectedAreas(title, originalSummary),
            ...buildTimeZones(publishedAt),
            verificationStatus: credibility.verificationStatus,
            rawContent: clean(item.content),
          },
        });
        results.inserted += 1;
      }
    } catch (error) {
      results.errors.push(`${source.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return results;
}

async function fetchFeed(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "GlobalTechFinanceIntel/0.1 contact: local-dev",
        accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    return parser.parseString(xml);
  } finally {
    clearTimeout(timer);
  }
}
