import OpenAI from "openai";

let client: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export async function summarizeArticle(input: { title: string; source: string; originalSummary?: string | null }) {
  const openai = getOpenAI();
  const basis = input.originalSummary || input.title;
  if (!openai) {
    return {
      summaryZh: `基于公开标题/摘要：${basis}`,
      whyImportant: "未配置 OpenAI API Key，系统仅保留来源信息并进行规则化摘要，不新增未经来源支持的事实。",
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        { role: "system", content: "你只基于用户提供的标题和摘要生成中文摘要，不得添加外部事实。输出 JSON。" },
        {
          role: "user",
          content: JSON.stringify({
            title: input.title,
            source: input.source,
            originalSummary: input.originalSummary,
            schema: { summaryZh: "一句到两句中文摘要", whyImportant: "一句话说明重要性" },
          }),
        },
      ],
      response_format: { type: "json_object" },
    });
    const parsed = JSON.parse(response.choices[0]?.message.content || "{}");
    return {
      summaryZh: String(parsed.summaryZh || `基于公开标题/摘要：${basis}`),
      whyImportant: String(parsed.whyImportant || "需要结合更多来源持续观察。"),
    };
  } catch {
    return {
      summaryZh: `基于公开标题/摘要：${basis}`,
      whyImportant: "AI 摘要失败，已降级为规则摘要；请以原文链接为准。",
    };
  }
}
