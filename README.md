# Global Tech Finance Intel

全球科技金融实时情报网页平台。技术栈：Next.js App Router、TypeScript、Tailwind CSS、Prisma、SQLite，可迁移到 PostgreSQL / Supabase。

## 本地运行

```powershell
npm install
Copy-Item .env.example .env
npm run db:generate
npm run db:init
npm run db:seed
npm run fetch
npm run report
npm run dev
```

打开 http://localhost:3000。

## 常用命令

```powershell
npm run fetch      # 抓取已启用 RSS/官方公开来源
npm run report     # 生成当天日报
npm run update:daily # 抓取新闻并生成当天日报
npm run dev:lan    # 局域网访问，绑定 0.0.0.0:3000
npm run db:init    # 初始化本地 SQLite 表结构
npm run db:seed    # 初始化默认来源、关键词和 SAMPLE 示例数据
npm run build      # 生产构建检查
```

## 每日自动更新

本地开发环境可以用 Windows 任务计划程序每天执行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\register-daily-update.ps1
```

这个任务每天本机时间 07:30 运行 `npm run update:daily`，会先抓取公开来源，再生成当天日报。

Vercel 生产环境已配置 `vercel.json`：

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-update",
      "schedule": "30 23 * * *"
    }
  ]
}
```

Vercel Cron 使用 UTC 时间，`30 23 * * *` 等于北京时间每天 07:30。部署前必须设置 `CRON_SECRET`，接口会校验 `Authorization: Bearer <CRON_SECRET>`。

## 局域网访问

在项目目录运行：

```powershell
npm run dev:lan
```

然后在同一局域网设备访问：

```text
http://你的电脑局域网IP:3000
```

查看本机局域网 IP：

```powershell
ipconfig
```

## 页面

- `/` 实时新闻首页
- `/news` 全部历史新闻，支持 7/30/90 天范围
- `/news/[id]` 新闻详情和原始来源
- `/categories` 分类总览
- `/categories/[category]` 单分类新闻
- `/reports` 每日情报报告
- `/reports/[date]` 指定日期报告
- `/search` 按关键词、日期、来源、分类搜索
- `/sources` 信息源管理
- `/watchlist` 关键词关注

## 添加信息源

在 `/sources` 页面添加 RSS 或官方公开 feed。也可以直接改 `src/lib/fetchers/sources.ts`，再运行：

```powershell
npm run db:seed
npm run fetch
```

## 添加关键词

在 `/watchlist` 页面添加，或在 `scripts/seed.ts` 中维护默认关键词。

## 真实性机制

1. 每条新闻必须保存 `sourceUrl` 和 `source`。
2. 抓取器只读取公开 RSS/官方 feed，不绕过登录、付费墙或反爬限制。
3. `sourceUrl` 唯一约束加标题相似度去重，减少重复新闻。
4. `verifier.ts` 按来源分级：A 为官方/SEC/公司官网或高可信官方来源，B 为单家一线媒体，C 为社区/博客/未完全确认来源。
5. C 级消息在网页中强制显示“该消息尚未完全验证，请谨慎参考。”
6. AI 摘要只基于标题、摘要和公开内容。没有 `OPENAI_API_KEY` 时自动降级为规则摘要。
7. 金融、股票、加密货币相关页面统一显示“本网站内容仅供信息参考，不构成投资建议。”

## 部署到 Vercel

1. 推送代码到 GitHub。
2. 在 Vercel 导入项目，设置 `DATABASE_URL` 和可选 `OPENAI_API_KEY`。
3. 生产环境建议把 SQLite 换成 PostgreSQL/Supabase。
4. 配置 Vercel Cron 调用一个受保护的 API route，或用 GitHub Actions 定时运行 `npm run fetch && npm run report`。

## 迁移到 PostgreSQL / Supabase

1. 创建 Supabase 或 PostgreSQL 数据库，复制连接字符串。
2. 修改 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
}
```

3. 设置：

```powershell
$env:DATABASE_URL="postgresql://..."
npm run db:migrate -- --name postgres_init
```

4. 重新运行 `npm run fetch` 和 `npm run report`。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
