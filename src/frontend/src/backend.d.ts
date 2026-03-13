import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Comment {
    id: bigint;
    content: string;
    author?: string;
    timestamp: Time;
    postId: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Post {
    id: bigint;
    title: string;
    content: string;
    author?: string;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createComment(author: string | null, content: string, postId: bigint): Promise<bigint>;
    createPost(author: string | null, title: string, content: string): Promise<bigint>;
    deleteComment(commentId: bigint): Promise<void>;
    deletePost(postId: bigint): Promise<void>;
    getAllComments(): Promise<Array<Comment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommentsByPost(postId: bigint): Promise<Array<Comment>>;
    getPosts(): Promise<Array<Post>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
