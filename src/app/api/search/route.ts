import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/dataStore";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const articles = await searchArticles({ q });
  return NextResponse.json({ articles });
}
