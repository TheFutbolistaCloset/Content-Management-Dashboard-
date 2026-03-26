// Metricool data layer
// Simulates data from the Metricool API (https://app.metricool.com/api)
// Replace with real Metricool API calls when connecting your account.

export type Platform = "instagram" | "tiktok" | "twitter" | "facebook";

export interface DailyMetric {
  date: string;
  impressions: number;
  reach: number;
  engagement: number;
  followers: number;
  followerGrowth: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
}

export interface TopPost {
  id: string;
  platform: Platform;
  caption: string;
  postType: "image" | "carousel" | "reel" | "story" | "video";
  publishedAt: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: number;
  thumbnailPlaceholder: string;
}

export interface PlatformSummary {
  platform: Platform;
  followers: number;
  followerGrowth: number;
  followerGrowthPct: number;
  totalImpressions: number;
  impressionChange: number;
  avgEngagementRate: number;
  engagementChange: number;
  totalPosts: number;
}

export interface EngagementBreakdown {
  type: string;
  value: number;
  percentage: number;
}

export interface DateRange {
  from: string;
  to: string;
}

// --- Seed generation helpers ---

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDailyMetrics(range: DateRange): DailyMetric[] {
  const start = new Date(range.from);
  const end = new Date(range.to);
  const days: DailyMetric[] = [];
  let followers = 12847;
  let dayIndex = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const seed = d.getTime() / 86400000;
    const r = (offset: number) => seededRandom(seed + offset);
    const dayOfWeek = d.getDay();
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.25 : 1;
    const trendMultiplier = 1 + dayIndex * 0.003;

    const impressions = Math.round(
      (3500 + r(1) * 4500) * weekendBoost * trendMultiplier
    );
    const reach = Math.round(impressions * (0.6 + r(2) * 0.25));
    const likes = Math.round(impressions * (0.04 + r(3) * 0.04));
    const comments = Math.round(likes * (0.06 + r(4) * 0.08));
    const shares = Math.round(likes * (0.02 + r(5) * 0.05));
    const saves = Math.round(likes * (0.03 + r(6) * 0.06));
    const clicks = Math.round(impressions * (0.015 + r(7) * 0.015));
    const engagement = likes + comments + shares + saves;
    const growth = Math.round(-8 + r(8) * 45);
    followers += growth;

    days.push({
      date: d.toISOString().split("T")[0],
      impressions,
      reach,
      engagement,
      followers,
      followerGrowth: growth,
      likes,
      comments,
      shares,
      saves,
      clicks,
    });
    dayIndex++;
  }

  return days;
}

function generateTopPosts(range: DateRange): TopPost[] {
  const posts: TopPost[] = [
    {
      id: "mc-1",
      platform: "instagram",
      caption:
        "Throwback jerseys ranked: Top 10 World Cup kits of all time ⚽🏆",
      postType: "carousel",
      publishedAt: "2026-03-18T12:00:00Z",
      impressions: 48720,
      reach: 31200,
      likes: 5892,
      comments: 312,
      shares: 487,
      saves: 1203,
      engagementRate: 16.2,
      thumbnailPlaceholder: "🏆",
    },
    {
      id: "mc-2",
      platform: "instagram",
      caption:
        "From pitch to street — our Spring 2026 lookbook is here 🔥",
      postType: "reel",
      publishedAt: "2026-03-20T15:00:00Z",
      impressions: 35400,
      reach: 24800,
      likes: 3421,
      comments: 156,
      shares: 298,
      saves: 892,
      engagementRate: 13.5,
      thumbnailPlaceholder: "🎬",
    },
    {
      id: "mc-3",
      platform: "instagram",
      caption:
        "Match day fit check 🏟️ Which kit are you wearing this weekend?",
      postType: "image",
      publishedAt: "2026-03-22T10:00:00Z",
      impressions: 22150,
      reach: 15890,
      likes: 1247,
      comments: 89,
      shares: 112,
      saves: 345,
      engagementRate: 8.1,
      thumbnailPlaceholder: "📸",
    },
    {
      id: "mc-4",
      platform: "tiktok",
      caption: "POV: You find a vintage 1998 France jersey at a thrift store",
      postType: "video",
      publishedAt: "2026-03-15T18:00:00Z",
      impressions: 128900,
      reach: 89200,
      likes: 14320,
      comments: 892,
      shares: 2340,
      saves: 4120,
      engagementRate: 24.3,
      thumbnailPlaceholder: "🎥",
    },
    {
      id: "mc-5",
      platform: "twitter",
      caption:
        "Hot take: The 2002 Nigeria kit is the greatest jersey ever made. Agree or disagree? 👇",
      postType: "image",
      publishedAt: "2026-03-19T09:00:00Z",
      impressions: 67400,
      reach: 45100,
      likes: 4280,
      comments: 1567,
      shares: 1890,
      saves: 0,
      engagementRate: 11.5,
      thumbnailPlaceholder: "🐦",
    },
    {
      id: "mc-6",
      platform: "instagram",
      caption:
        "How to style a retro football shirt for date night 👔➡️⚽",
      postType: "reel",
      publishedAt: "2026-03-16T14:00:00Z",
      impressions: 29800,
      reach: 19500,
      likes: 2890,
      comments: 201,
      shares: 345,
      saves: 1567,
      engagementRate: 16.8,
      thumbnailPlaceholder: "🎬",
    },
    {
      id: "mc-7",
      platform: "facebook",
      caption:
        "New arrivals just dropped! 12 vintage kits from the 90s & 2000s now in stock 🛒",
      postType: "carousel",
      publishedAt: "2026-03-21T11:00:00Z",
      impressions: 18200,
      reach: 12400,
      likes: 890,
      comments: 67,
      shares: 234,
      saves: 178,
      engagementRate: 7.5,
      thumbnailPlaceholder: "📘",
    },
    {
      id: "mc-8",
      platform: "tiktok",
      caption:
        "Jersey collection tour — 200+ shirts from every World Cup since 1990",
      postType: "video",
      publishedAt: "2026-03-23T16:00:00Z",
      impressions: 94500,
      reach: 67200,
      likes: 11200,
      comments: 678,
      shares: 1890,
      saves: 3450,
      engagementRate: 18.2,
      thumbnailPlaceholder: "🎥",
    },
  ];

  const from = new Date(range.from);
  const to = new Date(range.to);
  return posts
    .filter((p) => {
      const d = new Date(p.publishedAt);
      return d >= from && d <= to;
    })
    .sort((a, b) => b.impressions - a.impressions);
}

function generatePlatformSummaries(): PlatformSummary[] {
  return [
    {
      platform: "instagram",
      followers: 14230,
      followerGrowth: 1383,
      followerGrowthPct: 10.8,
      totalImpressions: 187400,
      impressionChange: 14.2,
      avgEngagementRate: 5.8,
      engagementChange: 0.7,
      totalPosts: 24,
    },
    {
      platform: "tiktok",
      followers: 8920,
      followerGrowth: 2140,
      followerGrowthPct: 31.6,
      totalImpressions: 423500,
      impressionChange: 28.4,
      avgEngagementRate: 8.2,
      engagementChange: 1.4,
      totalPosts: 16,
    },
    {
      platform: "twitter",
      followers: 6340,
      followerGrowth: 412,
      followerGrowthPct: 6.9,
      totalImpressions: 134800,
      impressionChange: -2.1,
      avgEngagementRate: 3.4,
      engagementChange: -0.3,
      totalPosts: 45,
    },
    {
      platform: "facebook",
      followers: 3210,
      followerGrowth: 87,
      followerGrowthPct: 2.8,
      totalImpressions: 42300,
      impressionChange: -5.4,
      avgEngagementRate: 2.1,
      engagementChange: -0.2,
      totalPosts: 18,
    },
  ];
}

function generateEngagementBreakdown(): EngagementBreakdown[] {
  return [
    { type: "Likes", value: 38540, percentage: 52.4 },
    { type: "Saves", value: 14230, percentage: 19.3 },
    { type: "Shares", value: 9870, percentage: 13.4 },
    { type: "Comments", value: 6420, percentage: 8.7 },
    { type: "Clicks", value: 4560, percentage: 6.2 },
  ];
}

// --- Public API (simulates Metricool API responses) ---

export function fetchMetricoolDailyMetrics(range: DateRange): DailyMetric[] {
  return generateDailyMetrics(range);
}

export function fetchMetricoolTopPosts(range: DateRange): TopPost[] {
  return generateTopPosts(range);
}

export function fetchMetricoolPlatformSummaries(): PlatformSummary[] {
  return generatePlatformSummaries();
}

export function fetchMetricoolEngagementBreakdown(): EngagementBreakdown[] {
  return generateEngagementBreakdown();
}

// Aggregate helpers

export function aggregateMetrics(metrics: DailyMetric[]) {
  if (metrics.length === 0) {
    return {
      totalImpressions: 0,
      totalReach: 0,
      totalEngagement: 0,
      avgEngagementRate: 0,
      totalFollowerGrowth: 0,
      currentFollowers: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalSaves: 0,
      totalClicks: 0,
    };
  }

  const totals = metrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      reach: acc.reach + m.reach,
      engagement: acc.engagement + m.engagement,
      followerGrowth: acc.followerGrowth + m.followerGrowth,
      likes: acc.likes + m.likes,
      comments: acc.comments + m.comments,
      shares: acc.shares + m.shares,
      saves: acc.saves + m.saves,
      clicks: acc.clicks + m.clicks,
    }),
    {
      impressions: 0,
      reach: 0,
      engagement: 0,
      followerGrowth: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      clicks: 0,
    }
  );

  const avgEngagementRate =
    totals.impressions > 0
      ? (totals.engagement / totals.impressions) * 100
      : 0;

  return {
    totalImpressions: totals.impressions,
    totalReach: totals.reach,
    totalEngagement: totals.engagement,
    avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
    totalFollowerGrowth: totals.followerGrowth,
    currentFollowers: metrics[metrics.length - 1].followers,
    totalLikes: totals.likes,
    totalComments: totals.comments,
    totalShares: totals.shares,
    totalSaves: totals.saves,
    totalClicks: totals.clicks,
  };
}

// Weekly bucketing for bar charts
export function bucketByWeek(
  metrics: DailyMetric[]
): { week: string; impressions: number; engagement: number; reach: number }[] {
  const buckets: Map<
    string,
    { impressions: number; engagement: number; reach: number }
  > = new Map();

  for (const m of metrics) {
    const d = new Date(m.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split("T")[0];

    const existing = buckets.get(key) || {
      impressions: 0,
      engagement: 0,
      reach: 0,
    };
    buckets.set(key, {
      impressions: existing.impressions + m.impressions,
      engagement: existing.engagement + m.engagement,
      reach: existing.reach + m.reach,
    });
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      ...data,
    }));
}
