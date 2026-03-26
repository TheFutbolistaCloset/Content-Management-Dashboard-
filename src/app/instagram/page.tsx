import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Camera, Image, Heart, MessageCircle } from "lucide-react";

export default function InstagramPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Instagram Manager</h1>
        <p className="mt-1 text-muted-foreground">
          Schedule posts, manage stories, and track engagement metrics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Posts", value: "248", icon: Image },
          { label: "Followers", value: "12.4K", icon: Camera },
          { label: "Avg. Likes", value: "892", icon: Heart },
          { label: "Avg. Comments", value: "47", icon: MessageCircle },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className="rounded-md bg-primary/10 p-2">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
            <CardDescription>Upcoming content in your queue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Product showcase - Tomorrow 9:00 AM", "Behind the scenes - Wed 2:00 PM", "User spotlight - Thu 11:00 AM"].map((post) => (
                <div
                  key={post}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  <div className="h-10 w-10 rounded bg-muted" />
                  <span className="text-sm">{post}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Engagement on your latest posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
