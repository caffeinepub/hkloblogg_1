import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Comment, Post } from "../backend.d";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getPosts();
      return [...posts].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useComments(postId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ["comments", postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const comments = await actor.getCommentsByPost(postId);
      return [...comments].sort((a, b) => Number(a.timestamp - b.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      author,
      title,
      content,
    }: {
      author: string | null;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPost(author, title, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useCreateComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      author,
      content,
      postId,
    }: {
      author: string | null;
      content: string;
      postId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createComment(author, content, postId);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({
        queryKey: ["comments", vars.postId.toString()],
      }),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePost(postId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useDeleteComment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteComment(commentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
