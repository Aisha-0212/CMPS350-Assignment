const maxLength = 500;

async function createPost(authorId, content) {
  if (!content || content.trim() === "") {
    return { success: false, error: "Post content can't be empty" };
  }
  if (content.trim().length > maxLength) {
    return { success: false, error: "Post content cannot exceed 500 characters" };
  }
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authorId, content: content.trim() }), // no action field
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true, post: data };
}

async function deletePost(postId, userId) {
  // DELETE /api/posts/:id?userId=... (not POST with action)
  const res = await fetch(`/api/posts/${postId}?userId=${userId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
}

async function toggleLike(postId, userId) {
  // POST /api/posts/:id/like?userId=... (not POST /api/posts with action)
  const res = await fetch(`/api/posts/${postId}/like?userId=${userId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return data;
}

async function addComment(postId, authorId, content) {
  if (!content || !content.trim()) return { success: false, error: "Content cannot be empty" };
  if (content.trim().length > 500) return { success: false, error: "Content cannot exceed 500 characters" };
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, authorId, content: content.trim() }), // no action field
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true, comment: data };
}

async function getFeedPosts(currentUserId) {
  const res = await fetch(`/api/posts?userId=${currentUserId}`);
  if (!res.ok) return [];
  return await res.json();
}

async function getUserPosts(authorId) {
  const res = await fetch(`/api/posts?authorId=${authorId}`);
  if (!res.ok) return [];
  return await res.json();
}

async function getPostById(postId) {
  const res = await fetch(`/api/posts/${postId}`);
  if (!res.ok) return null;
  return await res.json();
}