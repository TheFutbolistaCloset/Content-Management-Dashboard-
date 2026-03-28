"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Image,
  Heart,
  MessageCircle,
  Plus,
  Clock,
  FileEdit,
  CheckCircle2,
  Archive,
  Search,
  MoreVertical,
  Trash2,
  Edit3,
  Calendar,
  X,
  ImageIcon,
  Video,
  LayoutGrid,
  Database,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PostType = "image" | "carousel" | "reel" | "story";
type PostStatus = "scheduled" | "draft" | "published" | "backlog";

interface Post {
  id: string;
  caption: string;
  postType: PostType;
  status: PostStatus;
  scheduledDate?: string;
  createdAt: string;
  likes?: number;
  comments?: number;
  hashtags: string[];
  instagramId?: string;
  permalink?: string;
}

const POST_TYPE_CONFIG: Record<PostType, { label: string; icon: typeof Image }> = {
  image: { label: "Image", icon: ImageIcon },
  carousel: { label: "Carousel", icon: LayoutGrid },
  reel: { label: "Reel", icon: Video },
  story: { label: "Story", icon: Clock },
};

const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; icon: typeof Clock; color: string; bg: string }
> = {
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  draft: {
    label: "Draft",
    icon: FileEdit,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  published: {
    label: "Published",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  backlog: {
    label: "Backlog",
    icon: Archive,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
};

// Fallback data shown when Supabase is not configured
const DEMO_POSTS: Post[] = [
  {
    id: "1",
    caption: "New collection drop! Explore our latest streetwear essentials 🔥",
    postType: "carousel",
    status: "scheduled",
    scheduledDate: "2026-03-28T09:00",
    createdAt: "2026-03-24",
    hashtags: ["#streetwear", "#newdrop", "#fashion"],
  },
  {
    id: "2",
    caption: "Behind the scenes: How we source vintage football jerseys from around the world",
    postType: "reel",
    status: "scheduled",
    scheduledDate: "2026-03-29T14:00",
    createdAt: "2026-03-23",
    hashtags: ["#vintage", "#football", "#behindthescenes"],
  },
  {
    id: "3",
    caption: "Customer spotlight: @sneakerhead_mike rocking our retro kit",
    postType: "image",
    status: "scheduled",
    scheduledDate: "2026-03-30T11:00",
    createdAt: "2026-03-22",
    hashtags: ["#customerspotlight", "#retro"],
  },
  {
    id: "4",
    caption: "Working on something special for the Champions League final... stay tuned",
    postType: "story",
    status: "draft",
    createdAt: "2026-03-25",
    hashtags: ["#championsleague", "#comingsoon"],
  },
  {
    id: "5",
    caption: "Styling guide: 5 ways to wear a classic football shirt in 2026",
    postType: "carousel",
    status: "draft",
    createdAt: "2026-03-20",
    hashtags: ["#stylingguide", "#footballfashion"],
  },
  {
    id: "6",
    caption: "Match day fit check 🏟️ Which kit are you wearing this weekend?",
    postType: "image",
    status: "published",
    scheduledDate: "2026-03-22T10:00",
    createdAt: "2026-03-19",
    likes: 1247,
    comments: 89,
    hashtags: ["#matchday", "#fitcheck"],
  },
  {
    id: "7",
    caption: "From pitch to street — our Spring 2026 lookbook is here",
    postType: "reel",
    status: "published",
    scheduledDate: "2026-03-20T15:00",
    createdAt: "2026-03-17",
    likes: 3421,
    comments: 156,
    hashtags: ["#lookbook", "#spring2026"],
  },
  {
    id: "8",
    caption: "Throwback jerseys ranked: Top 10 World Cup kits of all time",
    postType: "carousel",
    status: "published",
    scheduledDate: "2026-03-18T12:00",
    createdAt: "2026-03-15",
    likes: 5892,
    comments: 312,
    hashtags: ["#worldcup", "#throwback", "#top10"],
  },
  {
    id: "9",
    caption: "Idea: Collab with local street artists for limited edition jersey designs",
    postType: "image",
    status: "backlog",
    createdAt: "2026-03-14",
    hashtags: ["#collab", "#streetart"],
  },
  {
    id: "10",
    caption: "Series idea: \"Jersey Stories\" — the history behind iconic football shirts",
    postType: "reel",
    status: "backlog",
    createdAt: "2026-03-10",
    hashtags: ["#jerseystories", "#history"],
  },
  {
    id: "11",
    caption: "Giveaway concept: Win a signed vintage jersey — engagement driver",
    postType: "image",
    status: "backlog",
    createdAt: "2026-03-08",
    hashtags: ["#giveaway", "#vintage"],
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function InstagramPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"supabase" | "demo">("demo");
  const [activeTab, setActiveTab] = useState<PostStatus | "all">("all");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
        setDataSource("supabase");
      } else {
        setPosts(DEMO_POSTS);
        setDataSource("demo");
      }
    } catch {
      setPosts(DEMO_POSTS);
      setDataSource("demo");
    } finally {
      setLoading(false);
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "all" || post.status === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some((h) =>
        h.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: posts.length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    draft: posts.filter((p) => p.status === "draft").length,
    published: posts.filter((p) => p.status === "published").length,
    backlog: posts.filter((p) => p.status === "backlog").length,
  };

  async function handleAddPost(post: Omit<Post, "id" | "createdAt">) {
    if (dataSource === "demo") {
      const newPost: Post = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPosts((prev) => [newPost, ...prev]);
      setShowNewPostForm(false);
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
      }
    } catch {
      // silent
    }
    setShowNewPostForm(false);
  }

  async function handleUpdatePost(post: Omit<Post, "id" | "createdAt">) {
    if (!editingPost) return;

    if (dataSource === "demo") {
      setPosts((prev) =>
        prev.map((p) => (p.id === editingPost.id ? { ...p, ...post } : p))
      );
      setEditingPost(null);
      return;
    }

    try {
      const res = await fetch(`/api/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPost.id ? updated : p))
        );
      }
    } catch {
      // silent
    }
    setEditingPost(null);
  }

  async function handleDeletePost(id: string) {
    setMenuOpenId(null);

    if (dataSource === "demo") {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // silent
    }
  }

  const publishedPosts = posts.filter((p) => p.status === "published");
  const totalLikes = publishedPosts.reduce((s, p) => s + (p.likes ?? 0), 0);
  const totalComments = publishedPosts.reduce((s, p) => s + (p.comments ?? 0), 0);
  const avgLikes = publishedPosts.length
    ? Math.round(totalLikes / publishedPosts.length)
    : 0;
  const avgComments = publishedPosts.length
    ? Math.round(totalComments / publishedPosts.length)
    : 0;

  function formatCompact(n: number) {
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  }

  const stats = [
    { label: "Total Posts", value: posts.length.toString(), icon: Image },
    { label: "Scheduled", value: counts.scheduled.toString(), icon: Clock },
    { label: "Avg. Likes", value: formatCompact(avgLikes), icon: Heart },
    { label: "Avg. Comments", value: avgComments.toString(), icon: MessageCircle },
  ];

  const tabs: { key: PostStatus | "all"; label: string }[] = [
    { key: "all", label: "All Posts" },
    { key: "scheduled", label: "Scheduled" },
    { key: "draft", label: "Drafts" },
    { key: "published", label: "Published" },
    { key: "backlog", label: "Backlog" },
  ];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instagram Manager</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your content pipeline — schedule, draft, publish, and plan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Data source badge */}
          <span
            className={cn(
              "hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium sm:flex",
              dataSource === "supabase"
                ? "bg-green-400/10 text-green-400"
                : "bg-yellow-400/10 text-yellow-400"
            )}
          >
            <Database className="h-3 w-3" />
            {dataSource === "supabase" ? "Live — Supabase" : "Demo data"}
          </span>
          <button
            onClick={() => {
              setEditingPost(null);
              setShowNewPostForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className="rounded-md bg-primary/10 p-2.5">
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

      {/* Tabs + Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-muted pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Archive className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium">No posts found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query."
                : "Get started by creating a new post."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => {
            const statusConfig = STATUS_CONFIG[post.status];
            const typeConfig = POST_TYPE_CONFIG[post.postType];
            const StatusIcon = statusConfig.icon;
            const TypeIcon = typeConfig.icon;

            return (
              <Card
                key={post.id}
                className="relative flex flex-col transition-colors hover:border-primary/30"
              >
                <CardContent className="flex flex-1 flex-col">
                  {/* Header: status + type + menu */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          statusConfig.bg,
                          statusConfig.color
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        <TypeIcon className="h-3 w-3" />
                        {typeConfig.label}
                      </span>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpenId(
                            menuOpenId === post.id ? null : post.id
                          )
                        }
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpenId === post.id && (
                        <div className="absolute right-0 top-8 z-10 w-36 rounded-md border border-border bg-popover p-1 shadow-lg">
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              setShowNewPostForm(true);
                              setMenuOpenId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-muted"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          {post.permalink && (
                            <a
                              href={post.permalink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-popover-foreground hover:bg-muted"
                              onClick={() => setMenuOpenId(null)}
                            >
                              <AlertCircle className="h-3.5 w-3.5" />
                              View on IG
                            </a>
                          )}
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-muted"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image placeholder / Instagram thumbnail */}
                  <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-muted/50">
                    <Camera className="h-8 w-8 text-muted-foreground/50" />
                  </div>

                  {/* Caption */}
                  <p className="mb-3 flex-1 text-sm leading-relaxed">
                    {post.caption}
                  </p>

                  {/* Hashtags */}
                  {post.hashtags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {post.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.scheduledDate
                        ? formatDateTime(post.scheduledDate)
                        : `Created ${formatDate(post.createdAt)}`}
                    </div>

                    {post.status === "published" && (
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes?.toLocaleString() ?? "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.comments ?? "—"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showNewPostForm && (
        <PostFormModal
          post={editingPost}
          onSubmit={editingPost ? handleUpdatePost : handleAddPost}
          onClose={() => {
            setShowNewPostForm(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}

function PostFormModal({
  post,
  onSubmit,
  onClose,
}: {
  post: Post | null;
  onSubmit: (post: Omit<Post, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const [caption, setCaption] = useState(post?.caption ?? "");
  const [postType, setPostType] = useState<PostType>(post?.postType ?? "image");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [scheduledDate, setScheduledDate] = useState(
    post?.scheduledDate ?? ""
  );
  const [hashtagInput, setHashtagInput] = useState(
    post?.hashtags.join(", ") ?? ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hashtags = hashtagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    onSubmit({
      caption,
      postType,
      status,
      scheduledDate: scheduledDate || undefined,
      hashtags,
      likes: post?.likes,
      comments: post?.comments,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">
            {post ? "Edit Post" : "New Post Idea"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Caption */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              required
              placeholder="Write your post caption..."
              className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Post Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Post Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                Object.entries(POST_TYPE_CONFIG) as [
                  PostType,
                  (typeof POST_TYPE_CONFIG)[PostType],
                ][]
              ).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPostType(key)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-md border p-3 text-xs font-medium transition-colors",
                      postType === key
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Status</label>
            <div className="grid grid-cols-4 gap-2">
              {(
                Object.entries(STATUS_CONFIG) as [
                  PostStatus,
                  (typeof STATUS_CONFIG)[PostStatus],
                ][]
              ).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-md border p-3 text-xs font-medium transition-colors",
                      status === key
                        ? cn("border-current bg-current/10", config.color)
                        : "border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Scheduled Date
              <span className="ml-1 text-muted-foreground">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring [color-scheme:dark]"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Hashtags
              <span className="ml-1 text-muted-foreground">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              placeholder="#fashion, #streetwear, #ootd"
              className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {post ? "Save Changes" : "Add Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
