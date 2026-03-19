import OpenAI from "openai";
import { checkAndTrackUsage, type RouteType } from "./usage";

type ResolveSuccess = { openai: OpenAI; mode: "byok" | "free" };
type ResolveError = { error: string; status: number };

export async function resolveOpenAI(
  req: Request,
  route: RouteType
): Promise<ResolveSuccess | ResolveError> {
  const userKey = req.headers.get("x-api-key");

  // BYOK mode — user's own key, no tracking
  if (userKey) {
    return { openai: new OpenAI({ apiKey: userKey }), mode: "byok" };
  }

  // Free tier — check device quota
  const deviceId = req.headers.get("x-device-id");
  if (!deviceId) {
    return { error: "Missing device ID. Please refresh the page.", status: 400 };
  }

  const serverKey = process.env.OPENAI_API_KEY;
  if (!serverKey) {
    return { error: "Free tier unavailable. Add your own OpenAI API key in Settings.", status: 503 };
  }

  // Check KV only if configured, otherwise allow passthrough with server key
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const { allowed } = await checkAndTrackUsage(deviceId, route);
    if (!allowed) {
      return {
        error: "Free quota used up. Add your own OpenAI API key in Settings to continue.",
        status: 403,
      };
    }
  }

  return { openai: new OpenAI({ apiKey: serverKey }), mode: "free" };
}
