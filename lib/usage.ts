import { Redis } from "@upstash/redis";

const DEVICE_LIMIT = 1.0; // $1 per device

// Approximate cost per request type (USD)
const COST_MAP = {
  translate: 0.001,
  "translate-detect": 0.001,
  "translate-photo": 0.003,
  transcribe: 0.003,
  process: 0.004,
  tts: 0.005,
} as const;

export type RouteType = keyof typeof COST_MAP;

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function checkAndTrackUsage(
  deviceId: string,
  route: RouteType
): Promise<{ allowed: boolean; used: number }> {
  const redis = getRedis();
  const key = `usage:${deviceId}`;
  const used = (await redis.get<number>(key)) ?? 0;

  if (used >= DEVICE_LIMIT) {
    return { allowed: false, used };
  }

  const cost = COST_MAP[route];
  const newUsed = Math.round((used + cost) * 10000) / 10000;
  await redis.set(key, newUsed);

  return { allowed: true, used: newUsed };
}

export async function getUsage(deviceId: string): Promise<number> {
  const redis = getRedis();
  return (await redis.get<number>(`usage:${deviceId}`)) ?? 0;
}
