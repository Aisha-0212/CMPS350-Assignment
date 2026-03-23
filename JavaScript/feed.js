// ===== Get current user =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  window.location.href = "index.html";
}

// ===== Elements =====
const postInput = document.getElementById("post-input");
const postBtn = document.getElementById("create-post-btn");
const postsContainer = document.getElementById("posts-container");
const postError = document.getElementById("post-error");

// ===== Create Post =====
postBtn.addEventListener("click", () => {
  const content = postInput.value;

  const result = createPost(currentUser.id, content);

  if (!result.success) {
    postError.textContent = result.error;
    return;
  }

  postInput.value = "";
  postError.textContent = "";

  renderPosts();
});

// ===== Render Posts =====
function renderPosts() {
  const posts = getFeedPosts(currentUser.id);
  const data = getData();

  postsContainer.innerHTML = "";

  posts.forEach(post => {

    const author = data.users.find(u => u.id === post.authorId);

    const postEl = document.createElement("article");
    postEl.classList.add("post");

    postEl.innerHTML = `
      <section class="post-header">
        <p><strong>${author ? author.username : "Unknown"}</strong></p>
        <p>${new Date(post.timestamp).toLocaleString()}</p>
      </section>

      <p class="post-content">${post.content}</p>

      <section class="post-actions">
        <button class="like-btn" data-id="${post.id}">
          ❤️ ${post.likes.length}
        </button>

        ${
          post.authorId === currentUser.id
            ? `<button class="delete-btn" data-id="${post.id}">Delete</button>`
            : ""
        }
      </section>

      <section class="comments">

        <div class="comments-list">
          ${renderComments(post.id)}
        </div>

        <div class="add-comment">
          <input type="text" placeholder="Add comment..." data-id="${post.id}">
          <button class="comment-btn" data-id="${post.id}">Post</button>
        </div>

      </section>
    `;

    postsContainer.appendChild(postEl);
  });
}

// ===== Render Comments =====
function renderComments(postId) {
  const data = getData();

  if (!data.comments) return "";

  const comments = data.comments
    .filter(c => c.postId === postId)
    .sort((a, b) => b.timestamp - a.timestamp);

  return comments.map(c => {
    const user = data.users.find(u => u.id === c.authorId);

    return `
      <div class="comment">
        <strong>${user ? user.username : "User"}</strong>
        <p>${c.content}</p>
      </div>
    `;
  }).join("");
}

// ===== Events (Like / Delete / Comment) =====
document.addEventListener("click", (e) => {

  // Like
  if (e.target.classList.contains("like-btn")) {
    const id = e.target.dataset.id;
    toggleLike(id, currentUser.id);
    renderPosts();
  }

  // Delete
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    deletePost(id, currentUser.id);
    renderPosts();
  }

  // Comment
  if (e.target.classList.contains("comment-btn")) {
    const id = e.target.dataset.id;
    const input = document.querySelector(`input[data-id="${id}"]`);

    const text = input.value;

    const result = addComment(id, currentUser.id, text);

    if (result.success) {
      renderPosts();
    }

    input.value = "";
  }

});

// ===== Initial Load =====
renderPosts();