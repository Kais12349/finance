import { NextResponse } from "next/server";
import { getKeywords } from "@/lib/dataStore";

export async function GET() {
  const keywords = await getKeywords();
  return NextResponse.json({ keywords });
}
