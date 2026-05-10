import { NextResponse } from "next/server";
import { runDailyUpdate } from "@/lib/dailyUpdate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && !secret) {
    return new Response("CRON_SECRET is required in production", { status: 500 });
  }
  if (secret && authHeader !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const startedAt = new Date().toISOString();
  try {
    const result = await runDailyUpdate();
    return NextResponse.json({ ok: true, startedAt, finishedAt: new Date().toISOString(), result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, startedAt, finishedAt: new Date().toISOString(), error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
