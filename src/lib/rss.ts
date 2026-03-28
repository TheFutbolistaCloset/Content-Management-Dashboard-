// RSS feed aggregator — server-side only (used in API routes)
// Feeds: Anthropic Blog, The Verge AI, Ars Technica

import Parser from "rss-parser";

export type NewsTopic = "updates" | "tutorials" | "workflows" | "general-ai";

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  sourceUrl: string;
  publishedAt: string; // ISO 8601
  summary: string;
  topic: NewsTopic;
  tags: string[];
}

const FEEDS: { url: string; source: string; sourceUrl: string }[] = [
  {
    url: "https://www.anthropic.com/rss.xml",
    source: "Anthropic Blog",
    sourceUrl: "https://www.anthropic.com/blog",
  },
  {
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    source: "The Verge",
    sourceUrl: "https://www.theverge.com/ai-artificial-intelligence",
  },
  {
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
    source: "Ars Technica",
    sourceUrl: "https://arstechnica.com/information-technology",
  },
];

// Keyword → topic mapping (first match wins)
const TOPIC_KEYWORDS: { keywords: string[]; topic: NewsTopic }[] = [
  {
    keywords: [
      "release", "update", "launch", "new", "announce", "ship", "version",
      "claude", "anthropic", "model", "api",
    ],
    topic: "updates",
  },
  {
    keywords: [
      "tutorial", "guide", "how to", "howto", "learn", "build",
      "step by step", "getting started",
    ],
    topic: "tutorials",
  },
  {
    keywords: [
      "workflow", "automation", "pipeline", "integrate", "devops",
      "ci/cd", "productivity", "tool",
    ],
    topic: "workflows",
  },
];

function inferTopic(title: string, content: string): NewsTopic {
  const haystack = (title + " " + content).toLowerCase();
  for (const { keywords, topic } of TOPIC_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) {
      return topic;
    }
  }
  return "general-ai";
}

function extractTags(title: string): string[] {
  // Pull capitalised words / short phrases as rough tags
  const words = title.split(/\s+/);
  const tags: string[] = [];
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z0-9.+#]/g, "");
    if (clean.length >= 3 && /[A-Z]/.test(clean[0])) {
      tags.push(clean);
    }
  }
  return [...new Set(tags)].slice(0, 4);
}

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<NewsItem[]> {
  try {
    const parser = new Parser({ timeout: 8000 });
    const result = await parser.parseURL(feed.url);
    return (result.items ?? []).slice(0, 10).map((item, i) => {
      const title = item.title ?? "Untitled";
      const content = item.contentSnippet ?? item.content ?? "";
      return {
        id: `${feed.source}-${i}-${Date.now()}`,
        headline: title,
        source: feed.source,
        sourceUrl: item.link ?? feed.sourceUrl,
        publishedAt: item.isoDate ?? new Date().toISOString(),
        summary: content.slice(0, 280) || "No summary available.",
        topic: inferTopic(title, content),
        tags: extractTags(title),
      };
    });
  } catch {
    return [];
  }
}

export async function fetchRssNewsItems(): Promise<NewsItem[]> {
  const results = await Promise.all(FEEDS.map(fetchFeed));
  const items = results.flat();

  // Sort newest first
  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (items.length > 0) return items;

  // All feeds failed — return curated mock data as fallback
  return getMockNewsItems();
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

export function getMockNewsItems(): NewsItem[] {
  return [
    {
      id: "mock-n1",
      headline: "Claude Code 1.0.35 Ships Background Agents and Multi-File Editing",
      source: "Anthropic Blog",
      sourceUrl: "https://anthropic.com/blog",
      publishedAt: "2026-03-26T08:00:00Z",
      summary:
        "The latest Claude Code release introduces background agents that can run tasks autonomously, alongside a revamped multi-file editing experience with better diff previews and conflict resolution.",
      topic: "updates",
      tags: ["Claude", "Code", "Release"],
    },
    {
      id: "mock-n2",
      headline: "Anthropic Announces Claude 4.5 Opus with Extended Thinking",
      source: "Anthropic Blog",
      sourceUrl: "https://anthropic.com/blog",
      publishedAt: "2026-03-25T14:00:00Z",
      summary:
        "Claude 4.5 Opus brings breakthrough reasoning capabilities with extended thinking mode, enabling deeper analysis on complex tasks.",
      topic: "updates",
      tags: ["Claude", "Opus", "Thinking"],
    },
    {
      id: "mock-n3",
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
      id: "mock-n4",
      headline: "Building a Full-Stack App with Claude Code: From Scaffold to Deploy",
      source: "Dev.to",
      sourceUrl: "https://dev.to",
      publishedAt: "2026-03-25T16:00:00Z",
      summary:
        "A step-by-step tutorial showing how to scaffold a Next.js app, implement features, write tests, and deploy to Vercel — all guided by Claude Code.",
      topic: "tutorials",
      tags: ["Claude", "Next.js", "Tutorial"],
    },
    {
      id: "mock-n5",
      headline: "Automating Code Reviews with Claude Code Hooks and GitHub Actions",
      source: "GitHub Blog",
      sourceUrl: "https://github.blog",
      publishedAt: "2026-03-24T15:00:00Z",
      summary:
        "Set up Claude Code as an automated PR reviewer using GitHub Actions and custom hooks. Catch bugs, suggest improvements, and enforce coding standards on every push.",
      topic: "workflows",
      tags: ["Automation", "GitHub", "Review"],
    },
    {
      id: "mock-n6",
      headline: "Google DeepMind's Gemini 3.0 Targets Enterprise Coding Workflows",
      source: "Ars Technica",
      sourceUrl: "https://arstechnica.com",
      publishedAt: "2026-03-23T14:00:00Z",
      summary:
        "Gemini 3.0 introduces enterprise-grade coding features including private codebase indexing, compliance guardrails, and Google Cloud integration.",
      topic: "general-ai",
      tags: ["Google", "Gemini", "Enterprise"],
    },
  ];
}
