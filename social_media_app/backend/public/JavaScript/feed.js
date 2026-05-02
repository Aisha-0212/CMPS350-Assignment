(async function () {
  const urlParams = new URLSearchParams(window.location.search);
  CURRENT_USER_ID = parseInt(urlParams.get('userId'));

  if (!CURRENT_USER_ID) {
    window.location.href = 'login.html';
    return;
  }

  const postInput = document.getElementById('post-input');
  const postBtn = document.getElementById('create-post-btn');
  const postsContainer = document.getElementById('posts-container');
  const postError = document.getElementById('post-error');
  const usersList = document.getElementById('users-list');

  postBtn.addEventListener('click', async () => {
    const content = postInput.value.trim();
    const result = await createPost(CURRENT_USER_ID, content);
    if (!result.success) {
      postError.textContent = result.error;
      return;
    }
    postError.textContent = '';
    postInput.value = '';
    await renderPosts();
  });

  function formatEnglishDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }

  async function renderPosts() {
    postsContainer.innerHTML = '';
    const feedPosts = await getFeedPosts(CURRENT_USER_ID);
    if (!feedPosts.length) {
      postsContainer.innerHTML = '<p>No posts yet. Follow some users or create a post!</p>';
      return;
    }
    feedPosts.forEach(post => {
      const author = post.author;
      const comments = post.comments || [];
      const likes = post.likes || [];
      const postEl = document.createElement('article');
      postEl.classList.add('post');
      postEl.innerHTML = `
        <section class="post-header">
          <p><strong>${author?.username || 'Unknown'}</strong></p>
          <p class="post-timestamp">${formatEnglishDate(post.createdAt)}</p>
        </section>
        <p class="post-content">${post.content}</p>
        <section class="post-actions">
          <button class="like-btn" data-id="${post.id}">❤️ <span>${likes.length}</span></button>
          ${post.authorId === CURRENT_USER_ID ? `<button class="delete-btn" data-id="${post.id}">🗑 Delete</button>` : ''}
        </section>
        <section class="comments">
          ${comments.map(c => {
            const commentAuthor = c.author;
            return `<div class="comment"><strong>${commentAuthor?.username || 'Unknown'}</strong>: ${c.content}</div>`;
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

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('like-btn')) {
      const postId = parseInt(e.target.dataset.id);
      await toggleLike(postId, CURRENT_USER_ID);
      await renderPosts();
    }
    if (e.target.classList.contains('delete-btn')) {
      const postId = parseInt(e.target.dataset.id);
      const result = await deletePost(postId, CURRENT_USER_ID);
      if (result.success) await renderPosts();
      else alert(result.error);
    }
    if (e.target.classList.contains('comment-btn')) {
      const postId = parseInt(e.target.dataset.id);
      const input = document.querySelector(`input[data-id="${postId}"]`);
      const text = input.value.trim();
      if (!text) return;
      await addComment(postId, CURRENT_USER_ID, text);
      input.value = '';
      await renderPosts();
    }
  });

  async function renderUsersList() {
    const res = await fetch('/api/users');
    const users = await res.json();
    usersList.innerHTML = '';

    // Fetch current user's following list first
    const currentUser = await getCurrentUserData(CURRENT_USER_ID);
    const followingIds = currentUser
      ? currentUser.following.map(f => f.followeeId)
      : [];

    users.forEach(user => {
      if (user.id === CURRENT_USER_ID) return;
      const isFollowing = followingIds.includes(user.id);
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${user.username}</span>
        <button data-id="${user.id}" class="follow-toggle-btn">
          ${isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      `;
      usersList.appendChild(li);
    });
  }

  usersList.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('follow-toggle-btn')) return;
    const targetId = parseInt(e.target.dataset.id);
    const isCurrentlyUnfollow = e.target.textContent.trim() === 'Unfollow';

    if (isCurrentlyUnfollow) {
      const result = await unfollowUser(CURRENT_USER_ID, targetId);
      if (result.success) e.target.textContent = 'Follow';
    } else {
      const result = await followUser(CURRENT_USER_ID, targetId);
      // Only update button if follow actually succeeded
      if (result.success) e.target.textContent = 'Unfollow';
    }
  });
  document.getElementById('feed-nav-link').href = `feed.html?userId=${CURRENT_USER_ID}`;
  document.getElementById('profile-link').href = `profile.html?userId=${CURRENT_USER_ID}`;
  document.getElementById('stats-link').href = `stats.html?userId=${CURRENT_USER_ID}`;
  await renderPosts();
  await renderUsersList();
})();