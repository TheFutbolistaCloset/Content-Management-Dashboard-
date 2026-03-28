// Instagram Graph API helpers
// Docs: https://developers.facebook.com/docs/instagram-api

const BASE = "https://graph.instagram.com/v19.0";
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.INSTAGRAM_USER_ID;

export const isInstagramConfigured = Boolean(TOKEN && USER_ID);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IGMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export interface IGInsightValue {
  value: number;
  end_time: string; // ISO 8601
}

export interface IGInsightMetric {
  name: string;
  period: string;
  values: IGInsightValue[];
}

export interface IGDailyMetrics {
  date: string;         // YYYY-MM-DD
  impressions: number;
  reach: number;
  profileViews: number;
  followers: number;
  followerGrowth: number;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export async function fetchInstagramMedia(): Promise<IGMedia[]> {
  if (!isInstagramConfigured) return [];
  try {
    const fields =
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";
    const res = await fetch(
      `${BASE}/${USER_ID}/media?fields=${fields}&limit=50&access_token=${TOKEN}`,
      { next: { revalidate: 300 } } // cache 5 min
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data as IGMedia[]) ?? [];
  } catch {
    return [];
  }
}

// ─── Account Insights ─────────────────────────────────────────────────────────

export async function fetchDailyInsights(
  since: string, // YYYY-MM-DD
  until: string  // YYYY-MM-DD
): Promise<IGDailyMetrics[]> {
  if (!isInstagramConfigured) return [];

  try {
    const sinceTs = Math.floor(new Date(since).getTime() / 1000);
    const untilTs = Math.floor(new Date(until + "T23:59:59Z").getTime() / 1000);
    const metrics = "impressions,reach,profile_views,follower_count";

    const res = await fetch(
      `${BASE}/${USER_ID}/insights?metric=${metrics}&period=day&since=${sinceTs}&until=${untilTs}&access_token=${TOKEN}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];

    const json = await res.json();
    const metricMap: Record<string, IGInsightValue[]> = {};

    for (const metric of (json.data ?? []) as IGInsightMetric[]) {
      metricMap[metric.name] = metric.values;
    }

    // Align all metrics by date
    const impressionValues = metricMap["impressions"] ?? [];
    return impressionValues.map((v, i) => {
      const date = v.end_time.split("T")[0];
      const followers = metricMap["follower_count"]?.[i]?.value ?? 0;
      const prevFollowers = metricMap["follower_count"]?.[i - 1]?.value ?? followers;
      return {
        date,
        impressions: v.value,
        reach: metricMap["reach"]?.[i]?.value ?? 0,
        profileViews: metricMap["profile_views"]?.[i]?.value ?? 0,
        followers,
        followerGrowth: i === 0 ? 0 : followers - prevFollowers,
      };
    });
  } catch {
    return [];
  }
}

// ─── Follower count (current) ─────────────────────────────────────────────────

export async function fetchFollowerCount(): Promise<number | null> {
  if (!isInstagramConfigured) return null;
  try {
    const res = await fetch(
      `${BASE}/${USER_ID}?fields=followers_count&access_token=${TOKEN}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.followers_count ?? null;
  } catch {
    return null;
  }
}
