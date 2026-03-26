// ===== Setup current user =====
const currentUser = getCurrentUserData();
if (!currentUser) {
    window.location.href = "login.html";
}

// ===== Elements =====
const postInput = document.getElementById("post-input");
const postBtn = document.getElementById("create-post-btn");
const postsContainer = document.getElementById("posts-container");
const postError = document.getElementById("post-error");
    const usersList = document.getElementById("users-list");

// ===== Create Post =====
postBtn.addEventListener("click", () => {
    const content = postInput.value.trim();
    const result = createPost(currentUser.id, content);
    if (!result.success) {
        postError.textContent = result.error;
        return;
    }
    postError.textContent = "";
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
    const data = getData();
    const feedPosts = getFeedPosts(currentUser.id);

    if (feedPosts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    feedPosts.forEach(post => {
        const author = data.users.find(u => u.id === post.authorId);
        const comments = data.comments.filter(c => c.postId === post.id);
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
                ${post.authorId === currentUser.id ? `<button class="delete-btn" data-id="${post.id}">🗑 Delete</button>` : ""}
            </section>
            <section class="comments">
                ${comments.map(c => {
                    const commentAuthor = data.users.find(u => u.id === c.authorId);
                    return `<div class="comment"><strong>${commentAuthor ? commentAuthor.username : "Unknown"}</strong>: ${c.content}</div>`;
                }).join('')}
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
        const postId = e.target.dataset.id;
        toggleLike(postId, currentUser.id);
        renderPosts();
    }

    if (e.target.classList.contains("delete-btn")) {
        const postId = e.target.dataset.id;
        deletePost(postId, currentUser.id);
        renderPosts();
    }

    if (e.target.classList.contains("comment-btn")) {
        const postId = e.target.dataset.id;
        const input = document.querySelector(`input[data-id="${postId}"]`);
        const text = input.value.trim();
        if (!text) return;
        addComment(postId, currentUser.id, text);
        input.value = "";
        renderPosts();
    }
});

// ===== Initial render =====
renderPosts();

// ===== Render Users List =====
function renderUsersList() {
    const data = getData();
    if (!usersList) return;
    usersList.innerHTML = "";

    data.users.forEach(user => {
        if (user.id === currentUser.id) return;
        const isFollowing = currentUser.following.includes(user.id);
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${user.username}</span>
            <button data-id="${user.id}" class="follow-toggle-btn">
                ${isFollowing ? "Unfollow" : "Follow"}
            </button>
        `;
        usersList.appendChild(li);
    });
}

usersList.addEventListener("click", function(e) {
    if (!e.target.classList.contains("follow-toggle-btn")) return;
    const targetId = e.target.dataset.id;
    const fresh = getCurrentUserData();
    if (fresh.following.includes(targetId)) {
        unfollowUser(fresh.id, targetId);
        e.target.textContent = "Follow";
    } else {
        followUser(fresh.id, targetId);
        e.target.textContent = "Unfollow";
    }
});

renderUsersList();