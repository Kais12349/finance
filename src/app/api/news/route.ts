import { NextResponse } from "next/server";
import { getArticles } from "@/lib/dataStore";

export async function GET() {
  const articles = await getArticles();
  return NextResponse.json({ articles });
}
