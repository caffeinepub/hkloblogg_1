import { NewPostForm } from "@/components/NewPostForm";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/useQueries";
import { formatTimestamp } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, User2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function FeedPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: posts, isLoading } = usePosts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader onNewPost={() => setShowForm(true)} />
      <NewPostForm open={showForm} onClose={() => setShowForm(false)} />

      {/* Hero banner */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "url('/assets/generated/blog-hero-pattern.dim_1200x400.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3"
          >
            HKLO<span className="text-accent">Blogg</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-md"
          >
            En öppen blogg för alla. Skriv anonymt eller under alias — inga
            konton krävs.
          </motion.p>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Senaste inlägg
          </h2>
          <span className="text-sm text-muted-foreground">
            {posts ? `${posts.length} inlägg` : ""}
          </span>
        </div>

        {isLoading && (
          <div className="space-y-6" data-ocid="feed.loading_state">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && posts && posts.length === 0 && (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="feed.empty_state"
          >
            <p className="font-display text-lg mb-2">Inga inlägg ännu.</p>
            <p className="text-sm">Bli den första att skriva något!</p>
          </div>
        )}

        {!isLoading && posts && posts.length > 0 && (
          <div className="divide-y divide-border" data-ocid="feed.list">
            {posts.map((post, index) => (
              <motion.article
                key={post.id.toString()}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="py-7 group"
                data-ocid={`feed.item.${index + 1}`}
              >
                <Link
                  to="/post/$postId"
                  params={{ postId: post.id.toString() }}
                  className="block"
                  data-ocid="feed.link"
                >
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <User2 className="h-3 w-3" />
                    {post.author || "Anonym"}
                  </span>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(post.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed mb-3">
                  {post.content}
                </p>
                <Link
                  to="/post/$postId"
                  params={{ postId: post.id.toString() }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                  data-ocid="feed.secondary_button"
                >
                  Läs mer
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Byggt med ❤ med{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
