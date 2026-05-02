(async function () {
  const container = document.getElementById("stats-content");

  // Set feed link with userId if available
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  if (userId) {
    document.getElementById("feed-link").href = `feed.html?userId=${userId}`;
  }

  let data;
  try {
    const res = await fetch("/api/stats");
    if (!res.ok) throw new Error("Failed to fetch");
    data = await res.json();
  } catch {
    container.innerHTML = `<p class="error-text">Failed to load statistics. Please try again.</p>`;
    return;
  }

  const na = (val) => (val !== null && val !== undefined ? val : "N/A");

  // Posts per month table rows
  const monthRows = data.postsPerMonth?.length
    ? data.postsPerMonth
        .map(
          (r) => `
        <tr>
          <td>${r.month}</td>
          <td>${r.count}</td>
        </tr>`
        )
        .join("")
    : `<tr><td colspan="2" style="color:#aaa;text-align:center">No data</td></tr>`;

  // Top commenters list
  const commenterItems = data.topCommenters?.length
    ? data.topCommenters
        .map(
          (u, i) => `
        <li>
          <span class="rank">#${i + 1}</span>
          <span class="commenter-name">${u.username}</span>
          <span class="commenter-count">${u.commentCount} comments</span>
        </li>`
        )
        .join("")
    : `<li style="color:#aaa;justify-content:center">No data</li>`;

  container.innerHTML = `
    <div class="stats-grid">

      <div class="stat-card">
        <span class="stat-label">Average Followers per User</span>
        <span class="stat-value">${na(data.avgFollowers)}</span>
        <span class="stat-sub">Across all registered users</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Average Posts per User</span>
        <span class="stat-value">${na(data.avgPosts)}</span>
        <span class="stat-sub">Across all registered users</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Most Active User</span>
        <span class="stat-value">${data.mostActiveUser?.username ?? "N/A"}</span>
        <span class="stat-sub">${data.mostActiveUser ? `${data.mostActiveUser.postCount} posts` : ""}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Most Followed User</span>
        <span class="stat-value">${data.mostFollowedUser?.username ?? "N/A"}</span>
        <span class="stat-sub">${data.mostFollowedUser ? `${data.mostFollowedUser.followers} followers` : ""}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Most Liked Post</span>
        <span class="stat-value">${data.mostLikedPost ? `${data.mostLikedPost.likes} likes` : "N/A"}</span>
        <span class="stat-sub">${data.mostLikedPost ? `"${data.mostLikedPost.content.substring(0, 60)}${data.mostLikedPost.content.length > 60 ? "..." : ""}"` : ""}</span>
      </div>

      <div class="stat-card">
        <span class="stat-label">Most Common Word</span>
        <span class="stat-value">${data.commonWord?.word ?? "N/A"}</span>
        <span class="stat-sub">${data.commonWord ? `Used ${data.commonWord.count} times` : ""}</span>
      </div>

      <div class="stat-card wide">
        <span class="stat-label">Posts per Month</span>
        <table class="stats-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Posts</th>
            </tr>
          </thead>
          <tbody>${monthRows}</tbody>
        </table>
      </div>

      <div class="stat-card wide">
        <span class="stat-label">Top Commenters</span>
        <ul class="commenters-list">${commenterItems}</ul>
      </div>

    </div>
  `;
})();