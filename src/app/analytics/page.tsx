import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, MousePointerClick } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Track performance metrics across all your content channels.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Reach", value: "45.2K", change: "+12%", up: true, icon: Eye },
          { label: "Engagement Rate", value: "4.8%", change: "+0.3%", up: true, icon: TrendingUp },
          { label: "Click-through", value: "2.1%", change: "-0.2%", up: false, icon: MousePointerClick },
          { label: "Conversions", value: "156", change: "+24%", up: true, icon: TrendingUp },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-primary" />
                <span
                  className={`text-xs font-medium ${stat.up ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Engagement metrics for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
              Line chart placeholder
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Content</CardTitle>
            <CardDescription>Best performing posts this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  <span className="text-sm font-bold text-primary">#{i}</span>
                  <div className="h-8 w-8 rounded bg-muted" />
                  <div className="flex-1">
                    <p className="text-sm">Post title {i}</p>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 5000)} impressions</p>
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
