// ===== Setup current user and data =====
const currentUser = { id: 1, username: "TestUser" };

// ===== Elements =====
const postInput = document.getElementById("post-input");
const postBtn = document.getElementById("create-post-btn");
const postsContainer = document.getElementById("posts-container");
const postError = document.getElementById("post-error");

// ===== Initialize data from existing HTML posts =====
let data = {
  users: [currentUser],
  posts: [],
  comments: []
};

// Assign IDs to existing posts in HTML
document.querySelectorAll(".feed .post").forEach((postEl, index) => {
  const postId = Date.now() + index; // unique ID
  const username = postEl.querySelector(".post-header strong")?.textContent || currentUser.username;
  const content = postEl.querySelector(".post-content")?.textContent || "(No content)";
  const timestamp = new Date().getTime();

  // Add user if not already
  if (!data.users.find(u => u.username === username)) {
    data.users.push({ id: data.users.length + 1, username });
  }
  const authorId = data.users.find(u => u.username === username).id;

  data.posts.push({ id: postId, authorId, content, timestamp, likes: [] });

  // Optional: extract existing comments
  postEl.querySelectorAll(".comment").forEach(cEl => {
    const cText = cEl.textContent.split(": ")[1] || "";
    data.comments.push({ postId, authorId, content: cText, timestamp });
  });
});

// ===== Create Post =====
postBtn.addEventListener("click", () => {
  const content = postInput.value.trim();
  if (!content) {
    postError.textContent = "Post cannot be empty!";
    return;
  }
  postError.textContent = "";

  const newPost = {
    id: Date.now(),
    authorId: currentUser.id,
    content,
    timestamp: Date.now(),
    likes: []
  };
  data.posts.unshift(newPost);
  postInput.value = "";
  renderPosts();
});

// ===== Helper: Format timestamp =====
function formatEnglishDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

// ===== Render Posts =====
function renderPosts() {
  postsContainer.innerHTML = "";

  data.posts.forEach(post => {
    const author = data.users.find(u => u.id === post.authorId);
    const likes = post.likes || [];

    const postEl = document.createElement("article");
    postEl.classList.add("post");

    postEl.innerHTML = `
      <section class="post-header">
        <p><strong>${author.username}</strong></p>
        <p class="post-timestamp">${formatEnglishDate(post.timestamp)}</p>
      </section>
      <p class="post-content">${post.content}</p>
      <section class="post-actions">
        <button class="like-btn" data-id="${post.id}">❤️ <span>${likes.length}</span></button>
        <button class="delete-btn" data-id="${post.id}">🗑 Delete</button>
      </section>
      <section class="comments">
        ${data.comments.filter(c => c.postId === post.id)
          .map(c => `<div class="comment"><strong>${currentUser.username}</strong>: ${c.content}</div>`)
          .join('')}
        <div class="add-comment">
          <input type="text" placeholder="Add comment..." data-id="${post.id}">
          <button class="comment-btn" data-id="${post.id}">Post</button>
        </div>
      </section>
    `;
    postsContainer.appendChild(postEl);
  });
}

// ===== Like, Delete, Comment =====
document.addEventListener("click", e => {
  if (e.target.classList.contains("like-btn")) {
    const postId = Number(e.target.dataset.id);
    const post = data.posts.find(p => p.id === postId);
    if (!post.likes.includes(currentUser.id)) post.likes.push(currentUser.id);
    else post.likes = post.likes.filter(id => id !== currentUser.id);
    renderPosts();
  }

  if (e.target.classList.contains("delete-btn")) {
    const postId = Number(e.target.dataset.id);
    data.posts = data.posts.filter(p => p.id !== postId);
    data.comments = data.comments.filter(c => c.postId !== postId);
    renderPosts();
  }

  if (e.target.classList.contains("comment-btn")) {
    const id = Number(e.target.dataset.id);
    const input = document.querySelector(`input[data-id="${id}"]`);
    const text = input.value.trim();
    if (!text) return;
    data.comments.push({ postId: id, authorId: currentUser.id, content: text, timestamp: Date.now() });
    input.value = "";
    renderPosts();
  }
});

// ===== Initial render =====
renderPosts();