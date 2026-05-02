"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError("Failed to load statistics."));
  }, []);

  if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;
  if (!data) return <p style={{ padding: 20 }}>Loading stats...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: 700 }}>
      <h1>📊 Statistics Dashboard</h1>

      <section>
        <h2>👥 Average Followers per User</h2>
        <p>{data.avgFollowers ?? "N/A"}</p>
      </section>

      <section>
        <h2>📝 Average Posts per User</h2>
        <p>{data.avgPosts ?? "N/A"}</p>
      </section>

      <section>
        <h2>🔥 Most Active User (most posts)</h2>
        {data.mostActiveUser ? (
          <p>
            <strong>{data.mostActiveUser.username}</strong> —{" "}
            {data.mostActiveUser.postCount} posts
          </p>
        ) : (
          <p>N/A</p>
        )}
      </section>

      <section>
        <h2>❤️ Most Liked Post</h2>
        {data.mostLikedPost ? (
          <p>
            "{data.mostLikedPost.content}" —{" "}
            <strong>{data.mostLikedPost.likes} likes</strong>
          </p>
        ) : (
          <p>N/A</p>
        )}
      </section>

      <section>
        <h2>📅 Posts per Month</h2>
        {data.postsPerMonth?.length ? (
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Month</th>
                <th>Posts</th>
              </tr>
            </thead>
            <tbody>
              {data.postsPerMonth.map((row) => (
                <tr key={row.month}>
                  <td>{row.month}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data</p>
        )}
      </section>

      <section>
        <h2>🧠 Most Common Word in Posts</h2>
        {data.commonWord ? (
          <p>
            <strong>"{data.commonWord.word}"</strong> — used{" "}
            {data.commonWord.count} times
          </p>
        ) : (
          <p>N/A</p>
        )}
      </section>

      <section>
        <h2>💬 Top 3 Commenters</h2>
        {data.topCommenters?.length ? (
          <ol>
            {data.topCommenters.map((u) => (
              <li key={u.userId}>
                {u.username} — {u.commentCount} comments
              </li>
            ))}
          </ol>
        ) : (
          <p>No data</p>
        )}
      </section>

      <section>
        <h2>🌟 Most Followed User</h2>
        {data.mostFollowedUser ? (
          <p>
            <strong>{data.mostFollowedUser.username}</strong> —{" "}
            {data.mostFollowedUser.followers} followers
          </p>
        ) : (
          <p>N/A</p>
        )}
      </section>
    </div>
  );
}