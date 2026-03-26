import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <p className="mt-1 text-muted-foreground">
          Plan and organize your content pipeline across all platforms.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>March 2026</CardTitle>
              <CardDescription>Content schedule overview</CardDescription>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">
                Previous
              </button>
              <button className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">
                Next
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border border-border bg-border">
            {days.map((day) => (
              <div
                key={day}
                className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - 1;
              const isCurrentMonth = dayNum >= 0 && dayNum < 31;
              const hasEvent = [3, 7, 10, 14, 18, 21, 25, 28].includes(dayNum);

              return (
                <div
                  key={i}
                  className={`min-h-[80px] bg-card p-2 ${!isCurrentMonth ? "opacity-30" : ""}`}
                >
                  {isCurrentMonth && (
                    <>
                      <span className="text-xs text-muted-foreground">
                        {dayNum + 1}
                      </span>
                      {hasEvent && (
                        <div className="mt-1 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                          Post scheduled
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Instagram Reel - Mon 10 AM", "Blog Post - Tue 2 PM", "Twitter Thread - Wed 9 AM", "Newsletter - Fri 8 AM"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-md border border-border p-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { status: "Draft", count: 5, color: "bg-yellow-500" },
                { status: "In Review", count: 3, color: "bg-blue-500" },
                { status: "Approved", count: 8, color: "bg-green-500" },
                { status: "Published", count: 24, color: "bg-primary" },
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="flex-1 text-sm">{item.status}</span>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
