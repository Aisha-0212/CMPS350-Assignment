"use client";

import { useEffect, useState } from "react";

export default function StatsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/stats");
      const json = await res.json();
      setData(json);
    }

    fetchStats();
  }, []);

  if (!data) return <p>Loading stats...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Statistics Dashboard</h1>

      <p>👥 Avg Followers: {data.avgFollowers}</p>
      <p>📝 Avg Posts: {data.avgPosts}</p>

      <p>🔥 Most Active User: {data.mostActiveUser?.name}</p>

      <p>❤️ Most Liked Post: {data.mostLikedPost?.title}</p>

      <h3>📅 Posts Per Month</h3>
      <pre>{JSON.stringify(data.postsPerMonth, null, 2)}</pre>

      <h3>🧠 Most Common Word</h3>
      <p>
        {data.commonWord.word} ({data.commonWord.count})
      </p>
    </div>
  );
}