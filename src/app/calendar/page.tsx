"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Camera,
  Video,
  LayoutGrid,
  ImageIcon,
  FileText,
  X,
  Eye,
  Heart,
  MessageCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- Types ---

type Platform = "instagram" | "youtube" | "tiktok" | "twitter" | "facebook" | "blog";
type ContentStatus = "scheduled" | "published" | "draft";
type ContentType = "image" | "video" | "reel" | "carousel" | "story" | "article" | "short";

interface CalendarItem {
  id: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  contentType: ContentType;
  date: string;          // YYYY-MM-DD
  time?: string;         // HH:MM
  caption?: string;
  hashtags?: string[];
  impressions?: number;
  likes?: number;
  comments?: number;
}

// --- Config ---

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bg: string; dot: string }> = {
  instagram:  { label: "Instagram",  color: "text-pink-400",   bg: "bg-pink-400/15",   dot: "bg-pink-400" },
  youtube:    { label: "YouTube",    color: "text-red-400",    bg: "bg-red-400/15",    dot: "bg-red-400" },
  tiktok:     { label: "TikTok",     color: "text-cyan-400",   bg: "bg-cyan-400/15",   dot: "bg-cyan-400" },
  twitter:    { label: "Twitter / X",color: "text-sky-400",    bg: "bg-sky-400/15",    dot: "bg-sky-400" },
  facebook:   { label: "Facebook",   color: "text-blue-400",   bg: "bg-blue-400/15",   dot: "bg-blue-400" },
  blog:       { label: "Blog",       color: "text-amber-400",  bg: "bg-amber-400/15",  dot: "bg-amber-400" },
};

const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  scheduled: { label: "Scheduled", color: "text-blue-400",   bg: "bg-blue-400/15",  icon: Clock },
  published: { label: "Published", color: "text-green-400",  bg: "bg-green-400/15", icon: CheckCircle2 },
  draft:     { label: "Draft",     color: "text-yellow-400", bg: "bg-yellow-400/15", icon: FileText },
};

const CONTENT_TYPE_ICONS: Record<ContentType, typeof ImageIcon> = {
  image: ImageIcon,
  video: Video,
  reel: Video,
  carousel: LayoutGrid,
  story: Clock,
  article: FileText,
  short: Video,
};

// --- Sample data ---

const CALENDAR_ITEMS: CalendarItem[] = [
  // February 2026 (tail end)
  { id: "f1", title: "Valentine's Day collection recap", platform: "instagram", status: "published", contentType: "carousel", date: "2026-02-14", time: "10:00", caption: "Love was in the air — and on the pitch 💕⚽ Our Valentine's capsule sold out in 48 hours.", hashtags: ["#valentines", "#football", "#soldout"], impressions: 18400, likes: 2100, comments: 134 },
  { id: "f2", title: "February analytics breakdown", platform: "blog", status: "published", contentType: "article", date: "2026-02-28", time: "09:00", caption: "Monthly deep-dive into our content performance.", impressions: 3200, likes: 89, comments: 12 },

  // March 2026
  { id: "1", title: "Spring collection teaser", platform: "instagram", status: "published", contentType: "reel", date: "2026-03-01", time: "10:00", caption: "Something fresh is coming... 🌱⚽", hashtags: ["#spring2026", "#teaser"], impressions: 12400, likes: 1890, comments: 92 },
  { id: "2", title: "Match day styling tips", platform: "youtube", status: "published", contentType: "video", date: "2026-03-02", time: "14:00", caption: "5 ways to style your match day jersey — from stadium to street.", hashtags: ["#matchday", "#styling"], impressions: 28900, likes: 3200, comments: 245 },
  { id: "3", title: "Kit unboxing: Serie A classics", platform: "tiktok", status: "published", contentType: "short", date: "2026-03-03", time: "18:00", caption: "Unboxing 5 vintage Serie A jerseys from the 90s 🇮🇹", hashtags: ["#unboxing", "#serieA", "#vintage"], impressions: 45200, likes: 6700, comments: 412 },
  { id: "4", title: "Weekend poll: Best kit?", platform: "twitter", status: "published", contentType: "image", date: "2026-03-05", time: "09:00", caption: "Brazil 2002 vs France 1998 — which kit wins? 🇧🇷🇫🇷", hashtags: ["#poll", "#worldcup"], impressions: 34100, likes: 4500, comments: 1890 },
  { id: "5", title: "Behind the scenes warehouse", platform: "instagram", status: "published", contentType: "story", date: "2026-03-05", time: "12:00", caption: "A peek inside where the magic happens 📦", impressions: 8900, likes: 1200, comments: 67 },
  { id: "6", title: "New arrivals blog post", platform: "blog", status: "published", contentType: "article", date: "2026-03-07", time: "08:00", caption: "12 new vintage kits just landed — full write-up with history and details.", impressions: 4200, likes: 156, comments: 23 },
  { id: "7", title: "Jersey restoration process", platform: "youtube", status: "published", contentType: "video", date: "2026-03-08", time: "15:00", caption: "Watch us bring a 1994 Nigeria kit back to life 🧵", hashtags: ["#restoration", "#vintage"], impressions: 67800, likes: 8900, comments: 567 },
  { id: "8", title: "Customer spotlight: @retro_fc", platform: "instagram", status: "published", contentType: "carousel", date: "2026-03-10", time: "11:00", caption: "Our community is everything. Featuring @retro_fc and their incredible collection.", hashtags: ["#community", "#spotlight"], impressions: 15600, likes: 2340, comments: 189 },
  { id: "9", title: "Midweek meme drop", platform: "twitter", status: "published", contentType: "image", date: "2026-03-12", time: "12:00", caption: "When you find a vintage jersey at a thrift store for $5 😱", impressions: 89200, likes: 12400, comments: 2340 },
  { id: "10", title: "St. Patrick's Day kits", platform: "instagram", status: "published", contentType: "carousel", date: "2026-03-17", time: "09:00", caption: "The best green kits in football history 🍀☘️", hashtags: ["#stpatricksday", "#green", "#football"], impressions: 22100, likes: 3450, comments: 201 },
  { id: "11", title: "St. Paddy's TikTok", platform: "tiktok", status: "published", contentType: "short", date: "2026-03-17", time: "16:00", caption: "POV: You're Irish and your team actually has a great jersey", hashtags: ["#stpatricks", "#irish"], impressions: 134500, likes: 18900, comments: 1230 },
  { id: "12", title: "Throwback jerseys ranked", platform: "instagram", status: "published", contentType: "carousel", date: "2026-03-18", time: "12:00", caption: "Top 10 World Cup kits of all time 🏆", hashtags: ["#worldcup", "#throwback", "#top10"], impressions: 48720, likes: 5892, comments: 312 },
  { id: "13", title: "Hot take poll", platform: "twitter", status: "published", contentType: "image", date: "2026-03-19", time: "09:00", caption: "The 2002 Nigeria kit is the greatest jersey ever made. Agree?", impressions: 67400, likes: 4280, comments: 1567 },
  { id: "14", title: "Spring lookbook reel", platform: "instagram", status: "published", contentType: "reel", date: "2026-03-20", time: "15:00", caption: "From pitch to street — Spring 2026 lookbook 🔥", hashtags: ["#lookbook", "#spring2026"], impressions: 35400, likes: 3421, comments: 156 },
  { id: "15", title: "Facebook shop update", platform: "facebook", status: "published", contentType: "image", date: "2026-03-21", time: "11:00", caption: "New arrivals now live on our Facebook Shop 🛒", impressions: 18200, likes: 890, comments: 67 },
  { id: "16", title: "Match day fit check", platform: "instagram", status: "published", contentType: "image", date: "2026-03-22", time: "10:00", caption: "Which kit are you wearing this weekend? 🏟️", hashtags: ["#matchday", "#fitcheck"], impressions: 22150, likes: 1247, comments: 89 },
  { id: "17", title: "Jersey collection tour", platform: "tiktok", status: "published", contentType: "short", date: "2026-03-23", time: "16:00", caption: "200+ shirts from every World Cup since 1990", impressions: 94500, likes: 11200, comments: 678 },
  { id: "18", title: "Week in review thread", platform: "twitter", status: "published", contentType: "image", date: "2026-03-24", time: "18:00", caption: "This week in football fashion — a thread 🧵", impressions: 23400, likes: 1890, comments: 234 },

  // Scheduled
  { id: "19", title: "New collection drop", platform: "instagram", status: "scheduled", contentType: "carousel", date: "2026-03-28", time: "09:00", caption: "Explore our latest streetwear essentials 🔥", hashtags: ["#streetwear", "#newdrop"] },
  { id: "20", title: "Sourcing vintage jerseys", platform: "youtube", status: "scheduled", contentType: "video", date: "2026-03-28", time: "14:00", caption: "How we source vintage football jerseys from around the world." },
  { id: "21", title: "Customer spotlight reel", platform: "instagram", status: "scheduled", contentType: "reel", date: "2026-03-29", time: "11:00", caption: "@sneakerhead_mike rocking our retro kit", hashtags: ["#customerspotlight"] },
  { id: "22", title: "April Fools teaser", platform: "tiktok", status: "scheduled", contentType: "short", date: "2026-03-31", time: "10:00", caption: "Something unexpected dropping tomorrow... 👀" },
  { id: "23", title: "April Fools campaign", platform: "instagram", status: "scheduled", contentType: "carousel", date: "2026-03-31", time: "12:00", caption: "Our biggest collection yet... or is it? 🃏" },
  { id: "24", title: "March recap blog", platform: "blog", status: "draft", contentType: "article", date: "2026-03-30", caption: "Monthly content performance and lessons learned." },
  { id: "25", title: "Q1 highlights video", platform: "youtube", status: "draft", contentType: "video", date: "2026-03-31", caption: "Best moments from Q1 2026 — community, drops, and milestones." },

  // April 2026 (upcoming)
  { id: "a1", title: "April Fools reveal", platform: "instagram", status: "scheduled", contentType: "reel", date: "2026-04-01", time: "09:00", caption: "Got you! But seriously... something big IS coming 👀🔥" },
  { id: "a2", title: "April Fools TikTok", platform: "tiktok", status: "scheduled", contentType: "short", date: "2026-04-01", time: "12:00", caption: "The prank that went too far... or did it?" },
  { id: "a3", title: "Champions League kit history", platform: "youtube", status: "scheduled", contentType: "video", date: "2026-04-04", time: "15:00", caption: "The most iconic Champions League jerseys ever worn." },
  { id: "a4", title: "Spring sale announcement", platform: "facebook", status: "scheduled", contentType: "image", date: "2026-04-07", time: "10:00", caption: "Spring sale starts this Friday — up to 40% off vintage kits!" },
  { id: "a5", title: "Earth Day sustainable fashion", platform: "blog", status: "draft", contentType: "article", date: "2026-04-22", caption: "Why buying vintage jerseys is the most sustainable fashion choice." },
];

// --- Helpers ---

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2); // March = 2
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(
    new Set(Object.keys(PLATFORM_CONFIG) as Platform[])
  );
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  // Previous month tail
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  // Total cells needed (always 6 rows = 42 cells for consistency)
  const totalCells = 42;

  // Filter items by platform
  const filteredItems = useMemo(
    () => CALENDAR_ITEMS.filter((item) => selectedPlatforms.has(item.platform)),
    [selectedPlatforms]
  );

  // Index items by date
  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of filteredItems) {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    }
    return map;
  }, [filteredItems]);

  function navigateMonth(delta: number) {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedItem(null);
    setSelectedDate(null);
  }

  function goToToday() {
    setCurrentMonth(2); // March 2026
    setCurrentYear(2026);
  }

  function togglePlatform(platform: Platform) {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        if (next.size > 1) next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedPlatforms(new Set(Object.keys(PLATFORM_CONFIG) as Platform[]));
  }

  const todayStr = "2026-03-26";

  // Items for selected date sidebar
  const selectedDateItems = selectedDate ? (itemsByDate.get(selectedDate) || []) : [];

  // Stats
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const monthItems = filteredItems.filter((item) => item.date.startsWith(monthPrefix));
  const scheduledCount = monthItems.filter((i) => i.status === "scheduled").length;
  const publishedCount = monthItems.filter((i) => i.status === "published").length;
  const draftCount = monthItems.filter((i) => i.status === "draft").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            Visualize your content pipeline across all platforms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Today
          </button>
        </div>
      </div>

      {/* Platform Filters */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-muted-foreground">
            Platforms:
          </span>
          {(Object.entries(PLATFORM_CONFIG) as [Platform, typeof PLATFORM_CONFIG[Platform]][]).map(
            ([key, config]) => {
              const active = selectedPlatforms.has(key);
              return (
                <button
                  key={key}
                  onClick={() => togglePlatform(key)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    active
                      ? cn(config.bg, config.color, "border-current")
                      : "border-border text-muted-foreground/50 hover:text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition-opacity",
                      config.dot,
                      !active && "opacity-30"
                    )}
                  />
                  {config.label}
                </button>
              );
            }
          )}
          {selectedPlatforms.size < Object.keys(PLATFORM_CONFIG).length && (
            <button
              onClick={selectAll}
              className="ml-1 text-xs text-primary hover:underline"
            >
              Select all
            </button>
          )}
        </CardContent>
      </Card>

      {/* Month Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { count: scheduledCount, ...STATUS_CONFIG.scheduled },
          { count: publishedCount, ...STATUS_CONFIG.published },
          { count: draftCount, ...STATUS_CONFIG.draft, label: "Drafts" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3">
                <div className={cn("rounded-md p-2", s.bg)}>
                  <Icon className={cn("h-4 w-4", s.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="rounded-md p-1.5 transition-colors hover:bg-muted"
                  >
                    <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="rounded-md p-1.5 transition-colors hover:bg-muted"
                  >
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-px rounded-t-md border border-b-0 border-border bg-border">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="bg-muted px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-md border border-t-0 border-border bg-border">
                {Array.from({ length: totalCells }, (_, i) => {
                  let dayNum: number;
                  let isCurrentMonth = true;
                  let cellYear = currentYear;
                  let cellMonth = currentMonth;

                  if (i < firstDay) {
                    // Previous month
                    isCurrentMonth = false;
                    dayNum = prevMonthDays - firstDay + i + 1;
                    cellMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    cellYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                  } else if (i - firstDay >= daysInMonth) {
                    // Next month
                    isCurrentMonth = false;
                    dayNum = i - firstDay - daysInMonth + 1;
                    cellMonth = currentMonth === 11 ? 0 : currentMonth + 1;
                    cellYear = currentMonth === 11 ? currentYear + 1 : currentYear;
                  } else {
                    dayNum = i - firstDay + 1;
                  }

                  const dateStr = `${cellYear}-${String(cellMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const dayItems = itemsByDate.get(dateStr) || [];
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedDate(dateStr === selectedDate ? null : dateStr);
                        setSelectedItem(null);
                      }}
                      className={cn(
                        "min-h-[100px] cursor-pointer bg-card p-1.5 transition-colors hover:bg-muted/50",
                        !isCurrentMonth && "opacity-40",
                        isSelected && "ring-1 ring-inset ring-primary"
                      )}
                    >
                      {/* Day number */}
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                            isToday
                              ? "bg-primary font-bold text-primary-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {dayNum}
                        </span>
                        {dayItems.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {dayItems.length}
                          </span>
                        )}
                      </div>

                      {/* Content chips */}
                      <div className="flex flex-col gap-0.5">
                        {dayItems.slice(0, 3).map((item) => {
                          const pConfig = PLATFORM_CONFIG[item.platform];
                          const sConfig = STATUS_CONFIG[item.status];
                          return (
                            <button
                              key={item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                                setSelectedDate(dateStr);
                              }}
                              className={cn(
                                "group flex w-full items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] font-medium leading-tight transition-all",
                                pConfig.bg,
                                pConfig.color,
                                "hover:brightness-125",
                                selectedItem?.id === item.id && "ring-1 ring-current"
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 flex-shrink-0 rounded-full",
                                  item.status === "published"
                                    ? "bg-green-400"
                                    : item.status === "draft"
                                    ? "bg-yellow-400"
                                    : "bg-blue-400"
                                )}
                              />
                              <span className="truncate">{item.title}</span>
                            </button>
                          );
                        })}
                        {dayItems.length > 3 && (
                          <span className="px-1.5 text-[10px] text-muted-foreground">
                            +{dayItems.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
            <span className="text-xs font-medium text-muted-foreground">
              Status:
            </span>
            {(Object.entries(STATUS_CONFIG) as [ContentStatus, typeof STATUS_CONFIG[ContentStatus]][]).map(
              ([key, config]) => (
                <span key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("h-2 w-2 rounded-full", config.color === "text-blue-400" ? "bg-blue-400" : config.color === "text-green-400" ? "bg-green-400" : "bg-yellow-400")} />
                  {config.label}
                </span>
              )
            )}
          </div>
        </div>

        {/* Detail Sidebar */}
        {selectedDate && (
          <div className="w-80 flex-shrink-0">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      setSelectedItem(null);
                    }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <CardDescription>
                  {selectedDateItems.length === 0
                    ? "No content on this day"
                    : `${selectedDateItems.length} content item${selectedDateItems.length > 1 ? "s" : ""}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateItems.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
                    <CalendarIcon className="mb-2 h-8 w-8" />
                    <p className="text-sm">No content scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateItems.map((item) => {
                      const pConfig = PLATFORM_CONFIG[item.platform];
                      const sConfig = STATUS_CONFIG[item.status];
                      const StatusIcon = sConfig.icon;
                      const TypeIcon = CONTENT_TYPE_ICONS[item.contentType];
                      const isExpanded = selectedItem?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() =>
                            setSelectedItem(isExpanded ? null : item)
                          }
                          className={cn(
                            "cursor-pointer rounded-lg border p-3 transition-all",
                            isExpanded
                              ? "border-primary/50 bg-primary/5"
                              : "border-border hover:border-border/80 hover:bg-muted/30"
                          )}
                        >
                          {/* Header */}
                          <div className="mb-2 flex items-center gap-2">
                            <span
                              className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                pConfig.bg,
                                pConfig.color
                              )}
                            >
                              <span className={cn("h-1.5 w-1.5 rounded-full", pConfig.dot)} />
                              {pConfig.label}
                            </span>
                            <span
                              className={cn(
                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                sConfig.bg,
                                sConfig.color
                              )}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {sConfig.label}
                            </span>
                          </div>

                          <p className="text-sm font-medium">{item.title}</p>

                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <TypeIcon className="h-3 w-3" />
                            <span className="capitalize">{item.contentType}</span>
                            {item.time && (
                              <>
                                <span>·</span>
                                <span>{item.time}</span>
                              </>
                            )}
                          </div>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="mt-3 border-t border-border pt-3">
                              {item.caption && (
                                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                                  {item.caption}
                                </p>
                              )}

                              {item.hashtags && item.hashtags.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-1">
                                  {item.hashtags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {item.status === "published" && (
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { icon: Eye, label: "Views", value: item.impressions },
                                    { icon: Heart, label: "Likes", value: item.likes },
                                    { icon: MessageCircle, label: "Comments", value: item.comments },
                                  ].map(
                                    (stat) =>
                                      stat.value !== undefined && (
                                        <div
                                          key={stat.label}
                                          className="rounded-md bg-muted p-2 text-center"
                                        >
                                          <stat.icon className="mx-auto mb-0.5 h-3 w-3 text-muted-foreground" />
                                          <p className="text-xs font-bold">
                                            {formatCompact(stat.value)}
                                          </p>
                                          <p className="text-[10px] text-muted-foreground">
                                            {stat.label}
                                          </p>
                                        </div>
                                      )
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
