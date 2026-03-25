// ===== Setup current user and data =====
const currentUser = { id: 1, username: "TestUser" };
let data = {
  users: [currentUser],
  posts: [{ id: 1, authorId: 1, content: "Hello World!", timestamp: Date.now(), likes: [] }],
  comments: [{ postId: 1, authorId: 1, content: "Nice post!", timestamp: Date.now() }]
};

// ===== Elements =====
const postInput = document.getElementById("post-input");
const postBtn = document.getElementById("create-post-btn");
const postsContainer = document.getElementById("posts-container");
const postError = document.getElementById("post-error");

// ===== Create Post =====
postBtn.addEventListener("click", () => {
  const content = postInput.value.trim();
  if (!content) {
    postError.textContent = "Post cannot be empty!";
    return;
  }{}
  postError.textContent = "";
  const newPost = { id: Date.now(), authorId: currentUser.id, content, timestamp: Date.now(), likes: [] };
  data.posts.unshift(newPost);
  postInput.value = "";
  renderPosts();
});

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
        <p>${new Date(post.timestamp).toLocaleString()}</p>
      </section>
      <p class="post-content">${post.content}</p>
      <section class="post-actions">
        <button class="like-btn">❤️ ${likes.length}</button>
      </section>
      <section class="comments">
        ${data.comments.filter(c=>c.postId===post.id).map(c=>`<div class="comment"><strong>${currentUser.username}</strong><p>${c.content}</p></div>`).join('')}
        <div class="add-comment">
          <input type="text" placeholder="Add comment..." data-id="${post.id}">
          <button class="comment-btn" data-id="${post.id}">Post</button>
        </div>
      </section>
    `;
    postsContainer.appendChild(postEl);
  });
}

// ===== Comment Functionality =====
document.addEventListener("click", e => {
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

// ===== Initial Load =====
renderPosts();