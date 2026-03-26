import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Camera,
  BarChart3,
  Calendar,
  Users,
  Newspaper,
} from "lucide-react";

const sections = [
  {
    title: "Instagram Manager",
    description: "Schedule posts, manage stories, and track engagement.",
    icon: Camera,
    href: "/instagram",
    stat: "12 scheduled",
  },
  {
    title: "Analytics",
    description: "Track performance metrics across all channels.",
    icon: BarChart3,
    href: "/analytics",
    stat: "+24% this week",
  },
  {
    title: "Content Calendar",
    description: "Plan and organize your content pipeline.",
    icon: Calendar,
    href: "/calendar",
    stat: "8 upcoming",
  },
  {
    title: "Competitor Tracker",
    description: "Monitor competitor activity and trends.",
    icon: Users,
    href: "/competitors",
    stat: "5 tracked",
  },
  {
    title: "News Consolidator",
    description: "Aggregate industry news and trending topics.",
    icon: Newspaper,
    href: "/news",
    stat: "34 new articles",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back. Here&apos;s an overview of your content operations.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <a key={section.href} href={section.href}>
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <section.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {section.stat}
                  </span>
                </div>
                <CardTitle className="mt-3">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.random() * 60 + 20}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
