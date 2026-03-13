# HKLOBlogg

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public blog feed showing all posts in reverse chronological order
- Create post form: optional alias field + title + body text
- Posts display alias (or "Anonym" if none set)
- Comment section per post: open, anonymous with optional alias
- Admin login (via authorization component) with ability to delete any post or comment
- Sample content (a few posts and comments)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Posts (id, title, body, alias, timestamp) stored in stable var
2. Backend: Comments (id, postId, body, alias, timestamp) stored in stable var
3. Backend: Public functions: createPost, getPosts, getComments, createComment
4. Backend: Admin-only functions: deletePost, deleteComment (guarded by authorization)
5. Frontend: Blog feed page with list of posts
6. Frontend: New post form (alias optional, title, body)
7. Frontend: Post detail page with comments and add comment form
8. Frontend: Admin panel/mode: delete buttons visible when logged in as admin
