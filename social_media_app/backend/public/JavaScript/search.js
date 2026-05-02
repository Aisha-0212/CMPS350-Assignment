// search.js — handles search bar logic on the feed page

document.getElementById("search-btn").addEventListener("click", runSearch);

document.getElementById("search-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

document.getElementById("close-search").addEventListener("click", () => {
  document.getElementById("search-results").style.display = "none";
  document.getElementById("search-input").value = "";
});

async function runSearch() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;

  const [postsRes, usersRes] = await Promise.all([
    fetch(`/api/posts?search=${encodeURIComponent(query)}`),
    fetch(`/api/users?search=${encodeURIComponent(query)}`),
  ]);

  const posts = await postsRes.json();
  const users = await usersRes.json();

  const container = document.getElementById("search-results-content");
  document.getElementById("search-results-title").textContent =
    `Results for "${query}"`;

  let html = "";

  if (users.length) {
    html += `<strong>👤 Users</strong><ul>`;
    users.forEach((u) => {
      html += `<li>${u.username}${u.bio ? ` — ${u.bio}` : ""}</li>`;
    });
    html += "</ul>";
  }

  if (posts.length) {
    html += `<strong>📝 Posts</strong><ul>`;
    posts.forEach((p) => {
      const preview =
        p.content.length > 100 ? p.content.substring(0, 100) + "..." : p.content;
      html += `<li><em>${p.author?.username}</em>: ${preview}</li>`;
    });
    html += "</ul>";
  }

  if (!users.length && !posts.length) {
    html = "<p>No results found.</p>";
  }

  container.innerHTML = html;
  document.getElementById("search-results").style.display = "block";
}