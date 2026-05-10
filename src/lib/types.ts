export type ArticleRecord = {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: Date;
  fetchedAt: Date;
  summaryZh: string;
  originalSummary: string | null;
  category: string;
  importance: string;
  credibility: string;
  affectedAreas: string;
  beijingTime: string;
  newYorkTime: string;
  losAngelesTime: string;
  londonTime: string;
  verificationStatus: string;
  rawContent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SourceRecord = {
  id: string;
  name: string;
  url: string;
  type: string;
  credibilityBase: string;
  enabled: boolean;
};

export type ReportRecord = {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: Date;
};

export type KeywordRecord = {
  id: string;
  keyword: string;
  category: string | null;
  enabled: boolean;
};
