
async function followUser(currentUserId, targetUserId) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'follow', followerId: currentUserId, followeeId: targetUserId })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
}

async function unfollowUser(currentUserId, targetUserId) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'unfollow', followerId: currentUserId, followeeId: targetUserId })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
}

async function updateBio(userId, newBio) {
  if (newBio.length > 200) return { success: false, error: "Bio cannot exceed 200 characters" };
  const res = await fetch('/api/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bio: newBio })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true, bio: data.bio };
}

async function getUserProfile(userId) {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) return null;
  const user = await res.json();
  const posts = await getUserPosts(userId);
  return {
    user,
    posts,
    followersCount: user._count?.followers || 0,
    followingCount: user._count?.following || 0,
    postsCount: user._count?.posts || 0
  };
}


if (document.getElementById('profile-posts')) {
  (async function () {
    const urlParams = new URLSearchParams(window.location.search);
    CURRENT_USER_ID = parseInt(urlParams.get('userId'));
    if (!CURRENT_USER_ID) {
      window.location.href = 'login.html';
      return;
    }

    const profile = await getUserProfile(CURRENT_USER_ID);
    if (!profile) return;

    document.getElementById('username').textContent = profile.user.username;
    document.getElementById('bio').textContent = profile.user.bio || 'No bio yet.';
    document.getElementById('post-count').textContent = profile.postsCount;
    document.getElementById('followers-count').textContent = profile.followersCount;
    document.getElementById('following-count').textContent = profile.followingCount;
    document.getElementById('follow-btn').style.display = 'none';

    const postsGrid = document.getElementById('profile-posts');
    postsGrid.innerHTML = '';
    if (profile.posts.length === 0) {
      postsGrid.innerHTML = '<p>No posts yet.</p>';
    } else {
      profile.posts.forEach(post => {
        const preview = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
        const div = document.createElement('div');
        div.classList.add('post');
        div.innerHTML = `<p>${preview}</p><small>${new Date(post.createdAt).toLocaleDateString()}</small>`;
        postsGrid.appendChild(div);
      });
    }

    document.getElementById('update-bio-btn').addEventListener('click', async () => {
      const newBio = document.getElementById('bio-input').value.trim();
      const result = await updateBio(CURRENT_USER_ID, newBio);
      if (result.success) {
        document.getElementById('bio').textContent = result.bio || 'No bio yet.';
        document.getElementById('bio-input').value = '';
        document.getElementById('bio-error').textContent = '';
      } else {
        document.getElementById('bio-error').textContent = result.error;
      }
    });

    document.getElementById('profile-pic-input').addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('profile-pic').src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('feed-link').href = `feed.html?userId=${CURRENT_USER_ID}`;
  })();
}