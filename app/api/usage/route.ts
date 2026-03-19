import { NextRequest, NextResponse } from "next/server";
import { getUsage } from "@/lib/usage";

export async function GET(req: NextRequest) {
  const deviceId = req.headers.get("x-device-id");

  if (!deviceId || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({ used: 0, limit: 1.0 });
  }

  const used = await getUsage(deviceId);
  return NextResponse.json({ used, limit: 1.0 });
}
