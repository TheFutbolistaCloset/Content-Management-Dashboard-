import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const articles = [
  { title: "Instagram Algorithm Changes Coming in Q2", source: "Social Media Today", time: "2 hours ago", category: "Platform Updates" },
  { title: "Short-Form Video Continues to Dominate Engagement", source: "Marketing Dive", time: "4 hours ago", category: "Trends" },
  { title: "New AI Tools for Content Creators Launched", source: "TechCrunch", time: "6 hours ago", category: "Technology" },
  { title: "Brand Authenticity: Why Raw Content Wins", source: "Forbes", time: "8 hours ago", category: "Strategy" },
  { title: "E-commerce Integration Expanding on Social Platforms", source: "Business Insider", time: "12 hours ago", category: "E-commerce" },
  { title: "Micro-Influencer Partnerships Outperform Celebrity Deals", source: "Adweek", time: "1 day ago", category: "Influencer" },
];

const categories = ["All", "Platform Updates", "Trends", "Technology", "Strategy", "E-commerce", "Influencer"];

export default function NewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">News Consolidator</h1>
        <p className="mt-1 text-muted-foreground">
          Stay updated with the latest industry news and trending topics.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.title} className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.time}</span>
                </div>
                <h3 className="font-semibold">{article.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{article.source}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
          <CardDescription>Most discussed topics in your industry this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["#ContentMarketing", "#Reels", "#AIContent", "#BrandStrategy", "#SocialCommerce", "#CreatorEconomy", "#VideoFirst", "#Authenticity"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-primary hover:text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
