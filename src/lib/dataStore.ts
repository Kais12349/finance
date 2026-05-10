import snapshotData from "../../data/public-snapshot.json";
import { categories } from "@/lib/constants";
import { getDb } from "@/lib/db";
import type { ArticleRecord, KeywordRecord, ReportRecord, SourceRecord } from "@/lib/types";

type SnapshotArticle = Omit<ArticleRecord, "publishedAt" | "fetchedAt" | "createdAt" | "updatedAt"> & {
  publishedAt: string;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
};

type SnapshotReport = Omit<ReportRecord, "createdAt"> & { createdAt: string };

type Snapshot = {
  exportedAt: string;
  articles: SnapshotArticle[];
  sources: SourceRecord[];
  reports: SnapshotReport[];
  keywords: KeywordRecord[];
};

function snapshot() {
  const raw = snapshotData as Snapshot;
  return {
    exportedAt: raw.exportedAt,
    articles: raw.articles.map((item) => ({
      ...item,
      publishedAt: new Date(item.publishedAt),
      fetchedAt: new Date(item.fetchedAt),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
    sources: raw.sources,
    reports: raw.reports.map((item) => ({ ...item, createdAt: new Date(item.createdAt) })),
    keywords: raw.keywords,
  };
}

async function fromDb<T>(query: () => Promise<T>, fallback: () => T | Promise<T>) {
  try {
    return await query();
  } catch {
    return fallback();
  }
}

function sortArticles(items: ArticleRecord[]) {
  return [...items].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getHomeData() {
  return fromDb(
    async () => {
      const db = getDb();
      const [articles, total, high, latestReport] = await Promise.all([
        db.newsArticle.findMany({ orderBy: { publishedAt: "desc" }, take: 20 }),
        db.newsArticle.count(),
        db.newsArticle.count({ where: { importance: "高" } }),
        db.dailyReport.findFirst({ orderBy: { createdAt: "desc" } }),
      ]);
      return { articles, total, high, latestReport };
    },
    () => {
      const data = snapshot();
      return {
        articles: sortArticles(data.articles).slice(0, 20),
        total: data.articles.length,
        high: data.articles.filter((item) => item.importance === "高").length,
        latestReport: data.reports.sort((a, b) => b.date.localeCompare(a.date))[0] || null,
      };
    },
  );
}

export async function getArticles(rangeDays?: number) {
  const since = rangeDays ? new Date() : undefined;
  if (since && rangeDays) since.setDate(since.getDate() - rangeDays);
  return fromDb(
    () =>
      getDb().newsArticle.findMany({
        where: since ? { publishedAt: { gte: since } } : undefined,
        orderBy: { publishedAt: "desc" },
        take: 100,
      }),
    () => {
      const articles = sortArticles(snapshot().articles);
      return since ? articles.filter((item) => item.publishedAt >= since).slice(0, 100) : articles.slice(0, 100);
    },
  );
}

export async function getArticle(id: string) {
  return fromDb(
    () => getDb().newsArticle.findUnique({ where: { id } }),
    () => snapshot().articles.find((item) => item.id === id) || null,
  );
}

export async function getCategoryCounts() {
  return fromDb(
    async () => {
      const db = getDb();
      return Promise.all(categories.map(async (category) => ({ category, count: await db.newsArticle.count({ where: { category } }) })));
    },
    () => {
      const articles = snapshot().articles;
      return categories.map((category) => ({ category, count: articles.filter((item) => item.category === category).length }));
    },
  );
}

export async function getArticlesByCategory(category: string) {
  return fromDb(
    () => getDb().newsArticle.findMany({ where: { category }, orderBy: { publishedAt: "desc" }, take: 100 }),
    () => sortArticles(snapshot().articles.filter((item) => item.category === category)).slice(0, 100),
  );
}

export async function searchArticles(filters: { q?: string; source?: string; category?: string; date?: string }) {
  const query = (filters.q || "").trim();
  return fromDb(
    () =>
      query || filters.source || filters.category || filters.date
        ? getDb().newsArticle.findMany({
            where: {
              AND: [
                query ? { OR: [{ title: { contains: query } }, { summaryZh: { contains: query } }, { originalSummary: { contains: query } }] } : {},
                filters.source ? { source: { contains: filters.source } } : {},
                filters.category ? { category: filters.category } : {},
                filters.date ? { publishedAt: { gte: new Date(`${filters.date}T00:00:00Z`), lt: new Date(`${filters.date}T23:59:59Z`) } } : {},
              ],
            },
            orderBy: { publishedAt: "desc" },
            take: 100,
          })
        : Promise.resolve([]),
    () => {
      if (!query && !filters.source && !filters.category && !filters.date) return [];
      const needle = query.toLowerCase();
      return sortArticles(snapshot().articles)
        .filter((item) => {
          const text = `${item.title} ${item.summaryZh} ${item.originalSummary || ""}`.toLowerCase();
          const sameQuery = !needle || text.includes(needle);
          const sameSource = !filters.source || item.source.toLowerCase().includes(filters.source.toLowerCase());
          const sameCategory = !filters.category || item.category === filters.category;
          const sameDate = !filters.date || item.publishedAt.toISOString().startsWith(filters.date);
          return sameQuery && sameSource && sameCategory && sameDate;
        })
        .slice(0, 100);
    },
  );
}

export async function getReports() {
  return fromDb(
    () => getDb().dailyReport.findMany({ orderBy: { date: "desc" }, take: 90 }),
    () => snapshot().reports.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90),
  );
}

export async function getReportByDate(date: string) {
  return fromDb(
    () => getDb().dailyReport.findUnique({ where: { date } }),
    () => snapshot().reports.find((item) => item.date === date) || null,
  );
}

export async function getSources() {
  return fromDb(
    () => getDb().source.findMany({ orderBy: { name: "asc" } }),
    () => snapshot().sources.sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export async function getKeywords() {
  return fromDb(
    () => getDb().keywordWatch.findMany({ orderBy: { keyword: "asc" } }),
    () => snapshot().keywords.sort((a, b) => a.keyword.localeCompare(b.keyword)),
  );
}

export async function getPublicApiData() {
  const data = snapshot();
  return data;
}
