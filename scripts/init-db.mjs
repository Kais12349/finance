import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const dbPath = resolve("prisma/dev.db");
mkdirSync(dirname(dbPath), { recursive: true });
const db = new DatabaseSync(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS "NewsArticle" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL UNIQUE,
  "publishedAt" DATETIME NOT NULL,
  "fetchedAt" DATETIME NOT NULL,
  "summaryZh" TEXT NOT NULL,
  "originalSummary" TEXT,
  "category" TEXT NOT NULL,
  "importance" TEXT NOT NULL,
  "credibility" TEXT NOT NULL,
  "affectedAreas" TEXT NOT NULL,
  "beijingTime" TEXT NOT NULL,
  "newYorkTime" TEXT NOT NULL,
  "losAngelesTime" TEXT NOT NULL,
  "londonTime" TEXT NOT NULL,
  "verificationStatus" TEXT NOT NULL,
  "rawContent" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Source" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "url" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "credibilityBase" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS "DailyReport" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "date" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "KeywordWatch" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "keyword" TEXT NOT NULL UNIQUE,
  "category" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt");
CREATE INDEX IF NOT EXISTS "NewsArticle_category_idx" ON "NewsArticle"("category");
CREATE INDEX IF NOT EXISTS "NewsArticle_source_idx" ON "NewsArticle"("source");
`);

db.close();
console.log(`SQLite database initialized at ${dbPath}`);
