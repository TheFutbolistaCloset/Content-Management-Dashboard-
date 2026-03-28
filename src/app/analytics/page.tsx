"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MousePointerClick,
  CalendarDays,
  ChevronDown,
  Camera,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  fetchMetricoolDailyMetrics,
  fetchMetricoolTopPosts,
  fetchMetricoolPlatformSummaries,
  fetchMetricoolEngagementBreakdown,
  aggregateMetrics,
  bucketByWeek,
  type DateRange,
  type Platform,
} from "@/lib/metricool";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// --- Date range presets ---

type PresetKey = "7d" | "14d" | "30d" | "90d" | "custom";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "14d", label: "Last 14 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "custom", label: "Custom" },
];

function getPresetRange(key: PresetKey): DateRange {
  const to = new Date("2026-03-26");
  const from = new Date(to);
  const days = key === "7d" ? 7 : key === "14d" ? 14 : key === "90d" ? 90 : 30;
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E1306C",
  tiktok: "#00f2ea",
  twitter: "#1DA1F2",
  facebook: "#1877F2",
};

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter / X",
  facebook: "Facebook",
};

// --- Custom tooltip for dark theme ---

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [presetKey, setPresetKey] = useState<PresetKey>("30d");
  const [customFrom, setCustomFrom] = useState("2026-02-24");
  const [customTo, setCustomTo] = useState("2026-03-26");
  const [showPresets, setShowPresets] = useState(false);
  const [dataSource, setDataSource] = useState<"instagram" | "demo">("demo");
  const [igMetrics, setIgMetrics] = useState<null | { date: string; impressions: number; reach: number; profileViews: number; followers: number; followerGrowth: number; }[]>(null);
  const [igFollowers, setIgFollowers] = useState<number | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const dateRange: DateRange = useMemo(() => {
    if (presetKey === "custom") return { from: customFrom, to: customTo };
    return getPresetRange(presetKey);
  }, [presetKey, customFrom, customTo]);

  // Try fetching real Instagram Insights; fall back to Metricool mock silently
  const fetchInsights = useCallback(async () => {
    setInsightsLoading(true);
    try {
      const res = await fetch(
        `/api/analytics/insights?since=${dateRange.from}&until=${dateRange.to}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.configured && json.metrics?.length) {
          setIgMetrics(json.metrics);
          setIgFollowers(json.followerCount ?? null);
          setDataSource("instagram");
          setInsightsLoading(false);
          return;
        }
      }
    } catch {
      // fall through to mock
    }
    setIgMetrics(null);
    setDataSource("demo");
    setInsightsLoading(false);
  }, [dateRange]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // Metricool mock data (always available as fallback)
  const mockDailyMetrics = useMemo(
    () => fetchMetricoolDailyMetrics(dateRange),
    [dateRange]
  );

  // Use Instagram Insights when available, otherwise Metricool mock
  const dailyMetrics = useMemo(() => {
    if (dataSource === "instagram" && igMetrics) {
      return igMetrics.map((m) => ({
        date: m.date,
        impressions: m.impressions,
        reach: m.reach,
        engagement: Math.round(m.impressions * 0.04),
        followers: m.followers,
        followerGrowth: m.followerGrowth,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: m.profileViews,
      }));
    }
    return mockDailyMetrics;
  }, [dataSource, igMetrics, mockDailyMetrics]);

  const topPosts = useMemo(
    () => fetchMetricoolTopPosts(dateRange),
    [dateRange]
  );
  const platformSummaries = useMemo(
    () => fetchMetricoolPlatformSummaries(),
    []
  );
  const engagementBreakdown = useMemo(
    () => fetchMetricoolEngagementBreakdown(),
    []
  );
  const agg = useMemo(() => {
    const base = aggregateMetrics(dailyMetrics);
    if (dataSource === "instagram" && igFollowers !== null) {
      return { ...base, currentFollowers: igFollowers };
    }
    return base;
  }, [dailyMetrics, dataSource, igFollowers]);
  const weeklyData = useMemo(() => bucketByWeek(dailyMetrics), [dailyMetrics]);

  // Chart data for daily line chart
  const chartData = dailyMetrics.map((m) => ({
    date: formatDate(m.date),
    Impressions: m.impressions,
    Reach: m.reach,
    Engagement: m.engagement,
  }));

  // Follower growth line chart
  const followerData = dailyMetrics.map((m) => ({
    date: formatDate(m.date),
    Followers: m.followers,
    Growth: m.followerGrowth,
  }));

  // KPI cards
  const kpis = [
    {
      label: "Total Impressions",
      value: formatCompact(agg.totalImpressions),
      rawValue: agg.totalImpressions,
      change: "+14.2%",
      up: true,
      icon: Eye,
    },
    {
      label: "Engagement Rate",
      value: agg.avgEngagementRate.toFixed(1) + "%",
      rawValue: agg.avgEngagementRate,
      change: "+0.7%",
      up: true,
      icon: Heart,
    },
    {
      label: "Follower Growth",
      value: (agg.totalFollowerGrowth >= 0 ? "+" : "") +
        formatCompact(agg.totalFollowerGrowth),
      rawValue: agg.totalFollowerGrowth,
      change: "+10.8%",
      up: true,
      icon: Users,
    },
    {
      label: "Total Reach",
      value: formatCompact(agg.totalReach),
      rawValue: agg.totalReach,
      change: "+8.3%",
      up: true,
      icon: MousePointerClick,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-muted-foreground">
              {dataSource === "instagram"
                ? "Live data from Instagram Insights."
                : "Demo data — connect Instagram to see real metrics."}
            </p>
            {insightsLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  dataSource === "instagram"
                    ? "bg-green-400/10 text-green-400"
                    : "bg-yellow-400/10 text-yellow-400"
                )}
              >
                {dataSource === "instagram" ? (
                  <Wifi className="h-2.5 w-2.5" />
                ) : (
                  <WifiOff className="h-2.5 w-2.5" />
                )}
                {dataSource === "instagram" ? "Live" : "Demo"}
              </span>
            )}
          </div>
        </div>

        {/* Date Picker */}
        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/80"
          >
            <CalendarDays className="h-4 w-4 text-primary" />
            {presetKey === "custom"
              ? `${formatDate(customFrom)} – ${formatDate(customTo)}`
              : PRESETS.find((p) => p.key === presetKey)?.label}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showPresets && (
            <div className="absolute right-0 top-12 z-20 w-72 rounded-lg border border-border bg-popover p-2 shadow-xl">
              {PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => {
                    setPresetKey(preset.key);
                    if (preset.key !== "custom") setShowPresets(false);
                  }}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                    presetKey === preset.key
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {preset.label}
                </button>
              ))}

              {presetKey === "custom" && (
                <div className="mt-2 space-y-2 border-t border-border pt-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      From
                    </label>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">
                      To
                    </label>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring [color-scheme:dark]"
                    />
                  </div>
                  <button
                    onClick={() => setShowPresets(false)}
                    className="w-full rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      kpi.up ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {kpi.up ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {kpi.change}
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold">{kpi.value}</p>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Impressions & Engagement Line Chart */}
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Impressions & Engagement</CardTitle>
            <CardDescription>
              Daily performance over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={{ stroke: "#27272a" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatCompact(v)}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px" }}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="Impressions"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#7c3aed" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Reach"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#38bdf8" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Engagement"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#4ade80" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>Interactions by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementBreakdown.map((item) => {
                const iconMap: Record<string, typeof Heart> = {
                  Likes: Heart,
                  Saves: Bookmark,
                  Shares: Share2,
                  Comments: MessageCircle,
                  Clicks: MousePointerClick,
                };
                const colorMap: Record<string, string> = {
                  Likes: "#f43f5e",
                  Saves: "#f59e0b",
                  Shares: "#38bdf8",
                  Comments: "#4ade80",
                  Clicks: "#7c3aed",
                };
                const Icon = iconMap[item.type] || Heart;
                const color = colorMap[item.type] || "#7c3aed";

                return (
                  <div key={item.type}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="h-3.5 w-3.5"
                          style={{ color }}
                        />
                        <span className="text-sm">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatCompact(item.value)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-md bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Interactions</p>
              <p className="text-xl font-bold">
                {formatCompact(agg.totalEngagement)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Bar Chart + Follower Growth */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
            <CardDescription>
              Impressions and engagement by week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={{ stroke: "#27272a" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => formatCompact(v)}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "12px" }}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-muted-foreground">
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="impressions"
                    name="Impressions"
                    fill="#7c3aed"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="engagement"
                    name="Engagement"
                    fill="#4ade80"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>
              Total followers over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {agg.currentFollowers.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-sm text-green-400">
                <TrendingUp className="h-3.5 w-3.5" />+
                {agg.totalFollowerGrowth.toLocaleString()} this period
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={followerData}>
                  <defs>
                    <linearGradient
                      id="followerGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop
                        offset="100%"
                        stopColor="#7c3aed"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={{ stroke: "#27272a" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    domain={["dataMin - 100", "dataMax + 100"]}
                    tickFormatter={(v: number) => formatCompact(v)}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="Followers"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#followerGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Summaries */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>
              Cross-platform metrics from Metricool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {platformSummaries.map((p) => (
                <div
                  key={p.platform}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: PLATFORM_COLORS[p.platform] }}
                    />
                    <span className="text-sm font-medium">
                      {PLATFORM_LABELS[p.platform]}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Followers
                      </span>
                      <span className="text-sm font-medium">
                        {formatCompact(p.followers)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Growth
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-sm font-medium",
                          p.followerGrowthPct >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {p.followerGrowthPct >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {p.followerGrowthPct >= 0 ? "+" : ""}
                        {p.followerGrowthPct}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Impressions
                      </span>
                      <span className="text-sm font-medium">
                        {formatCompact(p.totalImpressions)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Engagement
                      </span>
                      <span className="text-sm font-medium">
                        {p.avgEngagementRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Posts
                      </span>
                      <span className="text-sm font-medium">
                        {p.totalPosts}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>
            Ranked by impressions within the selected date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Camera className="mb-3 h-10 w-10" />
              <p>No posts found in this date range.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/30"
                >
                  {/* Rank */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </div>

                  {/* Thumbnail */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-muted text-2xl">
                    {post.thumbnailPlaceholder}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: PLATFORM_COLORS[post.platform],
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {PLATFORM_LABELS[post.platform]}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {post.postType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </div>
                    <p className="mb-2 truncate text-sm">{post.caption}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatCompact(post.impressions)} impressions
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatCompact(post.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {formatCompact(post.comments)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {formatCompact(post.shares)}
                      </span>
                      {post.saves > 0 && (
                        <span className="flex items-center gap-1">
                          <Bookmark className="h-3 w-3" />
                          {formatCompact(post.saves)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Engagement Rate Badge */}
                  <div className="flex-shrink-0 text-right">
                    <div className="rounded-md bg-primary/10 px-2.5 py-1">
                      <p className="text-lg font-bold text-primary">
                        {post.engagementRate}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        engagement
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
