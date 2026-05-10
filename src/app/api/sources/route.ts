import { NextResponse } from "next/server";
import { getSources } from "@/lib/dataStore";

export async function GET() {
  const sources = await getSources();
  return NextResponse.json({ sources });
}
