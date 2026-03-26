import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const competitors = [
  { name: "Competitor A", followers: "45.2K", growth: "+2.4%", up: true, posts: 12, engagement: "3.8%" },
  { name: "Competitor B", followers: "38.7K", growth: "+1.1%", up: true, posts: 8, engagement: "4.2%" },
  { name: "Competitor C", followers: "52.1K", growth: "-0.5%", up: false, posts: 15, engagement: "2.9%" },
  { name: "Competitor D", followers: "29.3K", growth: "+3.7%", up: true, posts: 20, engagement: "5.1%" },
  { name: "Competitor E", followers: "61.8K", growth: "+0.8%", up: true, posts: 10, engagement: "3.2%" },
];

export default function CompetitorsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Competitor Tracker</h1>
        <p className="mt-1 text-muted-foreground">
          Monitor competitor activity, growth trends, and content strategies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Competitors</CardTitle>
          <CardDescription>Performance comparison overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Followers</th>
                  <th className="pb-3 font-medium">Growth</th>
                  <th className="pb-3 font-medium">Posts (30d)</th>
                  <th className="pb-3 font-medium">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.name} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3">{c.followers}</td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 ${c.up ? "text-green-400" : "text-red-400"}`}>
                        {c.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {c.growth}
                      </span>
                    </td>
                    <td className="py-3">{c.posts}</td>
                    <td className="py-3">{c.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Growth Comparison</CardTitle>
            <CardDescription>Follower growth over the last 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
              Comparison chart placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Strategy Insights</CardTitle>
            <CardDescription>What competitors are posting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "Reels/Video", pct: 45 },
                { type: "Carousels", pct: 25 },
                { type: "Static Images", pct: 20 },
                { type: "Stories", pct: 10 },
              ].map((item) => (
                <div key={item.type}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{item.type}</span>
                    <span className="text-muted-foreground">{item.pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
