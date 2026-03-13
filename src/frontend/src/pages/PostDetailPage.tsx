import { SiteHeader } from "@/components/SiteHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useDeletePost,
  useIsAdmin,
  usePosts,
} from "@/hooks/useQueries";
import { formatTimestamp } from "@/utils/format";
import { Link, useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Clock,
  Loader2,
  MessageSquare,
  Trash2,
  User2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function PostDetailPage() {
  const { postId } = useParams({ from: "/post/$postId" });
  const postIdBigInt = BigInt(postId);

  const { data: posts, isLoading: postsLoading } = usePosts();
  const post = posts?.find((p) => p.id === postIdBigInt);

  const { data: comments, isLoading: commentsLoading } =
    useComments(postIdBigInt);
  const { data: isAdmin } = useIsAdmin();

  const { mutateAsync: createComment, isPending: commenting } =
    useCreateComment();
  const { mutateAsync: deletePost, isPending: deletingPost } = useDeletePost();
  const { mutateAsync: deleteComment } = useDeleteComment();
  const navigate = useNavigate();

  const [commentAlias, setCommentAlias] = useState("");
  const [commentBody, setCommentBody] = useState("");

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      await createComment({
        author: commentAlias.trim() || null,
        content: commentBody.trim(),
        postId: postIdBigInt,
      });
      toast.success("Kommentaren publicerades!");
      setCommentAlias("");
      setCommentBody("");
    } catch {
      toast.error("Kunde inte publicera kommentaren.");
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postIdBigInt);
      toast.success("Inlägget raderades.");
      navigate({ to: "/" });
    } catch {
      toast.error("Kunde inte radera inlägget.");
    }
  };

  const handleDeleteComment = async (commentId: bigint) => {
    try {
      await deleteComment(commentId);
      toast.success("Kommentaren raderades.");
    } catch {
      toast.error("Kunde inte radera kommentaren.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          data-ocid="nav.link"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Tillbaka till flödet
        </Link>

        {postsLoading && (
          <div className="space-y-4" data-ocid="post.loading_state">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {!postsLoading && !post && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="post.empty_state"
          >
            <p className="font-display text-xl mb-2">Inlägget hittades inte.</p>
            <Link to="/" className="text-accent text-sm underline">
              Gå tillbaka
            </Link>
          </div>
        )}

        {!postsLoading && post && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Post header */}
            <div className="mb-6">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User2 className="h-3.5 w-3.5" />
                    {post.author || "Anonym"}
                  </span>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimestamp(post.timestamp)}
                  </span>
                </div>

                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1.5"
                        data-ocid="post.delete_button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Ta bort
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="post.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ta bort inlägg?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Detta raderar inlägget permanent.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="post.cancel_button">
                          Avbryt
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeletePost}
                          disabled={deletingPost}
                          data-ocid="post.confirm_button"
                        >
                          {deletingPost && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Ta bort
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Post body */}
            <div className="prose-blog text-base leading-relaxed whitespace-pre-wrap mb-12">
              {post.content}
            </div>

            <Separator className="mb-8" />

            {/* Comments section */}
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Kommentarer
                {comments && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({comments.length})
                  </span>
                )}
              </h2>

              {commentsLoading && (
                <div className="space-y-4" data-ocid="comments.loading_state">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              )}

              {!commentsLoading && comments && comments.length === 0 && (
                <p
                  className="text-sm text-muted-foreground py-6"
                  data-ocid="comments.empty_state"
                >
                  Inga kommentarer ännu. Bli den första!
                </p>
              )}

              {!commentsLoading && comments && comments.length > 0 && (
                <div className="space-y-5 mb-10" data-ocid="comments.list">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id.toString()}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.04 }}
                      className="p-4 bg-card border border-border rounded group"
                      data-ocid={`comments.item.${index + 1}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User2 className="h-3 w-3" />
                            {comment.author || "Anonym"}
                          </span>
                          <span className="text-border">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(comment.timestamp)}
                          </span>
                        </div>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity"
                            onClick={() => handleDeleteComment(comment.id)}
                            data-ocid={`comments.delete_button.${index + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add comment form */}
              <div className="bg-card border border-border rounded p-5">
                <h3 className="font-display text-base font-semibold mb-4">
                  Lägg till kommentar
                </h3>
                <form onSubmit={handleComment} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="comment-alias">Alias (valfritt)</Label>
                    <Input
                      id="comment-alias"
                      placeholder="Anonym"
                      value={commentAlias}
                      onChange={(e) => setCommentAlias(e.target.value)}
                      data-ocid="comment.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="comment-body">
                      Kommentar <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="comment-body"
                      placeholder="Skriv din kommentar..."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      required
                      rows={3}
                      className="resize-none"
                      data-ocid="comment.textarea"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={commenting || !commentBody.trim()}
                      data-ocid="comment.submit_button"
                    >
                      {commenting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {commenting ? "Publicerar..." : "Publicera kommentar"}
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          </motion.div>
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
