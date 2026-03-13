import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "@/hooks/useQueries";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NewPostForm({ open, onClose }: Props) {
  const [alias, setAlias] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { mutateAsync, isPending } = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    try {
      await mutateAsync({
        author: alias.trim() || null,
        title: title.trim(),
        content: body.trim(),
      });
      toast.success("Inlägget publicerades!");
      setAlias("");
      setTitle("");
      setBody("");
      onClose();
    } catch {
      toast.error("Kunde inte publicera inlägget.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="post.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Nytt inlägg
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="alias">Alias (valfritt)</Label>
            <Input
              id="alias"
              placeholder="Anonym"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              data-ocid="post.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Rubrik <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Vad handlar inlägget om?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              data-ocid="post.search_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">
              Innehåll <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="body"
              placeholder="Skriv ditt inlägg här..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={6}
              className="resize-none"
              data-ocid="post.textarea"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              data-ocid="post.cancel_button"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !body.trim()}
              data-ocid="post.submit_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Publicerar..." : "Publicera"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
