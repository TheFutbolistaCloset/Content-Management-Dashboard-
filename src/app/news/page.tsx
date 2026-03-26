"use client";

import { useState, useMemo } from "react";
import {
  Newspaper,
  Clock,
  Rss,
  BookOpen,
  Sparkles,
  Wrench,
  GraduationCap,
  Globe,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- Types (swap fetchNewsItems with a real RSS/API call later) ---

type NewsTopic = "updates" | "tutorials" | "workflows" | "general-ai";

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;   // ISO 8601
  summary: string;
  topic: NewsTopic;
  tags: string[];
}

// --- Config ---

const TOPIC_CONFIG: Record<
  NewsTopic,
  { label: string; icon: typeof Sparkles; color: string; bg: string }
> = {
  updates: {
    label: "Updates",
    icon: Sparkles,
    color: "text-violet-400",
    bg: "bg-violet-400/15",
  },
  tutorials: {
    label: "Tutorials",
    icon: GraduationCap,
    color: "text-emerald-400",
    bg: "bg-emerald-400/15",
  },
  workflows: {
    label: "Workflows",
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-400/15",
  },
  "general-ai": {
    label: "General AI",
    icon: Globe,
    color: "text-sky-400",
    bg: "bg-sky-400/15",
  },
};

// --- Mock RSS feed data ---

function fetchNewsItems(): NewsItem[] {
  return [
    // Updates
    {
      id: "n1",
      headline: "Claude Code 1.0.35 Ships Background Agents and Multi-File Editing",
      source: "Anthropic Blog",
      sourceUrl: "https://anthropic.com/blog",
      publishedAt: "2026-03-26T08:00:00Z",
      summary:
        "The latest Claude Code release introduces background agents that can run tasks autonomously, alongside a revamped multi-file editing experience with better diff previews and conflict resolution.",
      topic: "updates",
      tags: ["Claude Code", "Release", "Background Agents"],
    },
    {
      id: "n2",
      headline: "Anthropic Announces Claude 4.5 Opus with Extended Thinking",
      source: "Anthropic Blog",
      sourceUrl: "https://anthropic.com/blog",
      publishedAt: "2026-03-25T14:00:00Z",
      summary:
        "Claude 4.5 Opus brings breakthrough reasoning capabilities with extended thinking mode, enabling deeper analysis on complex tasks while maintaining low latency for everyday use.",
      topic: "updates",
      tags: ["Claude", "Opus", "Extended Thinking"],
    },
    {
      id: "n3",
      headline: "MCP Protocol 2.0: Tool Discovery and Streaming Now Standard",
      source: "Anthropic Engineering",
      sourceUrl: "https://anthropic.com/engineering",
      publishedAt: "2026-03-24T10:00:00Z",
      summary:
        "The Model Context Protocol v2.0 specification standardizes tool discovery, streaming responses, and authentication, making it easier to build interoperable AI tool servers.",
      topic: "updates",
      tags: ["MCP", "Protocol", "Tools"],
    },
    {
      id: "n4",
      headline: "Claude Code IDE Extensions Now Available for VS Code and JetBrains",
      source: "Anthropic Blog",
      sourceUrl: "https://anthropic.com/blog",
      publishedAt: "2026-03-22T09:00:00Z",
      summary:
        "Native IDE extensions bring Claude Code's agentic capabilities directly into VS Code and JetBrains IDEs, with inline diff previews, terminal integration, and project-aware context.",
      topic: "updates",
      tags: ["Claude Code", "IDE", "VS Code", "JetBrains"],
    },
    {
      id: "n5",
      headline: "Anthropic API Adds Batch Processing and Priority Queues",
      source: "Anthropic Developer Docs",
      sourceUrl: "https://docs.anthropic.com",
      publishedAt: "2026-03-20T11:00:00Z",
      summary:
        "New batch processing endpoints allow developers to submit up to 10,000 requests in a single batch at 50% reduced cost, with priority queue support for latency-sensitive workloads.",
      topic: "updates",
      tags: ["API", "Batch Processing", "Developer"],
    },

    // Tutorials
    {
      id: "n6",
      headline: "Building a Full-Stack App with Claude Code: From Scaffold to Deploy",
      source: "Dev.to",
      sourceUrl: "https://dev.to",
      publishedAt: "2026-03-25T16:00:00Z",
      summary:
        "A step-by-step tutorial showing how to scaffold a Next.js app, implement features, write tests, and deploy to Vercel — all guided by Claude Code in the terminal.",
      topic: "tutorials",
      tags: ["Claude Code", "Next.js", "Full-Stack"],
    },
    {
      id: "n7",
      headline: "How to Write Effective CLAUDE.md Files for Your Projects",
      source: "Anthropic Cookbook",
      sourceUrl: "https://github.com/anthropics/anthropic-cookbook",
      publishedAt: "2026-03-23T12:00:00Z",
      summary:
        "Best practices for writing CLAUDE.md project instructions that give Claude Code the context it needs: folder structure, conventions, testing commands, and architectural decisions.",
      topic: "tutorials",
      tags: ["CLAUDE.md", "Best Practices", "Configuration"],
    },
    {
      id: "n8",
      headline: "Creating Custom MCP Servers: A Practical Guide",
      source: "Smashing Magazine",
      sourceUrl: "https://smashingmagazine.com",
      publishedAt: "2026-03-21T09:00:00Z",
      summary:
        "Learn how to build a custom MCP server that connects Claude Code to your internal APIs, databases, and third-party services with type-safe tool definitions.",
      topic: "tutorials",
      tags: ["MCP", "Server", "Integration"],
    },
    {
      id: "n9",
      headline: "Prompt Engineering for Claude: Structured Outputs and Tool Use",
      source: "Anthropic Cookbook",
      sourceUrl: "https://github.com/anthropics/anthropic-cookbook",
      publishedAt: "2026-03-19T14:00:00Z",
      summary:
        "A deep dive into getting reliable structured JSON outputs from Claude, including tool use patterns, schema validation, and error handling strategies.",
      topic: "tutorials",
      tags: ["Prompt Engineering", "Tool Use", "JSON"],
    },

    // Workflows
    {
      id: "n10",
      headline: "Automating Code Reviews with Claude Code Hooks and GitHub Actions",
      source: "GitHub Blog",
      sourceUrl: "https://github.blog",
      publishedAt: "2026-03-26T06:00:00Z",
      summary:
        "Set up Claude Code as an automated PR reviewer using GitHub Actions and custom hooks. Catch bugs, suggest improvements, and enforce coding standards on every push.",
      topic: "workflows",
      tags: ["Code Review", "GitHub Actions", "Automation"],
    },
    {
      id: "n11",
      headline: "Using Claude Code for Database Migration Planning",
      source: "PlanetScale Blog",
      sourceUrl: "https://planetscale.com/blog",
      publishedAt: "2026-03-24T15:00:00Z",
      summary:
        "How one team uses Claude Code to analyze existing schemas, generate migration scripts, validate data integrity constraints, and plan zero-downtime rollouts.",
      topic: "workflows",
      tags: ["Database", "Migrations", "DevOps"],
    },
    {
      id: "n12",
      headline: "Building an AI-Powered Content Pipeline with Claude and Metricool",
      source: "Content Marketing Institute",
      sourceUrl: "https://contentmarketinginstitute.com",
      publishedAt: "2026-03-22T08:00:00Z",
      summary:
        "Combine Claude's writing capabilities with Metricool analytics to create a feedback-driven content pipeline that optimizes posts based on real engagement data.",
      topic: "workflows",
      tags: ["Content", "Metricool", "Pipeline"],
    },
    {
      id: "n13",
      headline: "CI/CD Testing Workflows: Let Claude Code Write and Fix Your Tests",
      source: "CircleCI Blog",
      sourceUrl: "https://circleci.com/blog",
      publishedAt: "2026-03-18T10:00:00Z",
      summary:
        "A workflow for using Claude Code in your CI pipeline to auto-generate missing test coverage, fix flaky tests, and maintain test quality as your codebase evolves.",
      topic: "workflows",
      tags: ["Testing", "CI/CD", "Automation"],
    },

    // General AI
    {
      id: "n14",
      headline: "The State of AI Coding Assistants in 2026: Benchmarks and Comparisons",
      source: "The Verge",
      sourceUrl: "https://theverge.com",
      publishedAt: "2026-03-25T18:00:00Z",
      summary:
        "A comprehensive benchmark comparing Claude Code, GitHub Copilot, Cursor, and other AI coding tools across real-world tasks like refactoring, debugging, and greenfield development.",
      topic: "general-ai",
      tags: ["Benchmarks", "Comparison", "Industry"],
    },
    {
      id: "n15",
      headline: "OpenAI Releases GPT-5 Turbo with Native Tool Calling",
      source: "TechCrunch",
      sourceUrl: "https://techcrunch.com",
      publishedAt: "2026-03-24T20:00:00Z",
      summary:
        "OpenAI launches GPT-5 Turbo featuring native tool calling, improved instruction following, and a 256K context window — intensifying competition in the AI developer tools space.",
      topic: "general-ai",
      tags: ["OpenAI", "GPT-5", "Competition"],
    },
    {
      id: "n16",
      headline: "Google DeepMind's Gemini 3.0 Targets Enterprise Coding Workflows",
      source: "Ars Technica",
      sourceUrl: "https://arstechnica.com",
      publishedAt: "2026-03-23T14:00:00Z",
      summary:
        "Gemini 3.0 introduces enterprise-grade coding features including private codebase indexing, compliance guardrails, and integration with Google Cloud's development suite.",
      topic: "general-ai",
      tags: ["Google", "Gemini", "Enterprise"],
    },
    {
      id: "n17",
      headline: "AI Agents Are Reshaping Software Development: A 2026 Survey",
      source: "IEEE Spectrum",
      sourceUrl: "https://spectrum.ieee.org",
      publishedAt: "2026-03-21T11:00:00Z",
      summary:
        "A survey of 5,000 developers shows 73% now use AI coding agents daily, with the biggest productivity gains in debugging, test writing, and documentation — but concerns remain about code ownership.",
      topic: "general-ai",
      tags: ["Survey", "Developer Productivity", "Trends"],
    },
    {
      id: "n18",
      headline: "The Rise of Agentic AI: Why 2026 Is the Year of the AI Developer",
      source: "MIT Technology Review",
      sourceUrl: "https://technologyreview.com",
      publishedAt: "2026-03-19T08:00:00Z",
      summary:
        "From autonomous coding agents to self-healing CI pipelines, agentic AI is transforming how software is built. A look at the key trends driving adoption and the challenges ahead.",
      topic: "general-ai",
      tags: ["Agentic AI", "Trends", "2026"],
    },
  ];
}

// --- Helpers ---

function timeAgo(dateStr: string): string {
  const now = new Date("2026-03-26T12:00:00Z");
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatPublishDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsPage() {
  const allItems = useMemo(() => fetchNewsItems(), []);
  const [activeTopic, setActiveTopic] = useState<NewsTopic | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesTopic =
        activeTopic === "all" || item.topic === activeTopic;
      const matchesSearch =
        searchQuery === "" ||
        item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesTopic && matchesSearch;
    });
  }, [allItems, activeTopic, searchQuery]);

  // Topic counts
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allItems.length };
    for (const key of Object.keys(TOPIC_CONFIG)) {
      map[key] = allItems.filter((i) => i.topic === key).length;
    }
    return map;
  }, [allItems]);

  // Trending tags across all items
  const trendingTags = useMemo(() => {
    const tagCount = new Map<string, number>();
    for (const item of allItems) {
      for (const tag of item.tags) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      }
    }
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [allItems]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Consolidator</h1>
          <p className="mt-1 text-muted-foreground">
            Latest Claude Code, Anthropic, and AI development news.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground">
          <Rss className="h-4 w-4 text-primary" />
          <span>{allItems.length} articles</span>
          <span className="text-border">|</span>
          <Clock className="h-3.5 w-3.5" />
          <span>Updated just now</span>
        </div>
      </div>

      {/* Topic Filters + Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {/* All button */}
          <button
            onClick={() => setActiveTopic("all")}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
              activeTopic === "all"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Newspaper className="h-3.5 w-3.5" />
            All
            <span className="ml-0.5 text-xs opacity-70">{counts.all}</span>
          </button>

          {(
            Object.entries(TOPIC_CONFIG) as [
              NewsTopic,
              (typeof TOPIC_CONFIG)[NewsTopic],
            ][]
          ).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeTopic === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTopic(key)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? cn("border-current", config.bg, config.color)
                    : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
                <span className="ml-0.5 text-xs opacity-70">
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Newspaper className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium">No articles found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search terms."
                : "No articles match the selected topic."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const topicConfig = TOPIC_CONFIG[item.topic];
            const TopicIcon = topicConfig.icon;

            return (
              <Card
                key={item.id}
                className="group flex flex-col transition-all duration-200 hover:border-primary/40 hover:shadow-[0_0_15px_-3px_rgba(124,58,237,0.15)]"
              >
                <CardContent className="flex flex-1 flex-col">
                  {/* Topic + Time */}
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        topicConfig.bg,
                        topicConfig.color
                      )}
                    >
                      <TopicIcon className="h-3 w-3" />
                      {topicConfig.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(item.publishedAt)}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="mb-2 text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary">
                    {item.headline}
                  </h3>

                  {/* Summary */}
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>

                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer: Source + Date */}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      <span className="font-medium">{item.source}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {formatPublishDate(item.publishedAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Trending Topics */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Trending Topics</CardTitle>
          </div>
          <CardDescription>
            Most mentioned topics across all sources this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {tag}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
