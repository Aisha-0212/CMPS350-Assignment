import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statsRepo = {
  // Stat 1: Average number of followers per user — aggregated in DB
  async getAverageFollowersPerUser() {
    const result = await prisma.follow.groupBy({
      by: ["followeeId"],
      _count: { followerId: true },
    });
    if (!result.length) return 0;
    const total = result.reduce((sum, r) => sum + r._count.followerId, 0);
    return parseFloat((total / result.length).toFixed(2));
  },

  // Stat 2: Average number of posts per user — aggregated in DB
  async getAveragePostsPerUser() {
    const result = await prisma.post.groupBy({
      by: ["authorId"],
      _count: { id: true },
    });
    if (!result.length) return 0;
    const total = result.reduce((sum, r) => sum + r._count.id, 0);
    return parseFloat((total / result.length).toFixed(2));
  },

  // Stat 3: Most active user (most posts) — sorted and limited in DB
  async getMostActiveUser() {
    const result = await prisma.post.groupBy({
      by: ["authorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });
    if (!result.length) return null;

    const top = result[0];
    const user = await prisma.user.findUnique({
      where: { id: top.authorId },
      select: { id: true, username: true },
    });
    return { userId: user.id, username: user.username, postCount: top._count.id };
  },

  // Stat 4: Most liked post — sorted and limited in DB
  async getMostLikedPost() {
    const result = await prisma.like.groupBy({
      by: ["postId"],
      _count: { userId: true },
      orderBy: { _count: { userId: "desc" } },
      take: 1,
    });
    if (!result.length) return null;

    const top = result[0];
    const post = await prisma.post.findUnique({
      where: { id: top.postId },
      select: { id: true, content: true, authorId: true },
    });
    return { postId: post.id, content: post.content, likes: top._count.userId };
  },

  // Stat 5: Number of posts per month — aggregated via raw SQL in DB
  async getPostsPerMonth() {
    const rows = await prisma.$queryRaw`
      SELECT strftime('%Y-%m', createdAt) AS month, COUNT(*) AS count
      FROM Post
      GROUP BY month
      ORDER BY month ASC
    `;
    return rows.map((r) => ({ month: r.month, count: Number(r.count) }));
  },

  // Stat 6: Most frequently used word across all post content
  // Only content strings are fetched — word-counting must be done in JS
  // since SQLite has no built-in tokeniser.
  async getMostCommonWord() {
    const posts = await prisma.post.findMany({ select: { content: true } });
    const stopWords = new Set([
      "the", "a", "an", "is", "in", "it", "to", "and", "of", "for",
      "on", "at", "by", "my", "i", "this", "that", "with", "are", "was",
      "be", "but", "not", "or", "so", "we", "you", "he", "she", "they",
    ]);

    const map = {};
    posts.forEach((p) => {
      p.content.split(/\s+/).forEach((raw) => {
        const word = raw.toLowerCase().replace(/[^\w]/g, "");
        if (!word || stopWords.has(word)) return;
        map[word] = (map[word] || 0) + 1;
      });
    });

    let topWord = "";
    let topCount = 0;
    for (const [word, count] of Object.entries(map)) {
      if (count > topCount) {
        topCount = count;
        topWord = word;
      }
    }
    return { word: topWord, count: topCount };
  },

  // Stat 7: Top 3 commenters — sorted and limited in DB
  async getTopCommenters() {
    const result = await prisma.comment.groupBy({
      by: ["authorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 3,
    });

    const enriched = await Promise.all(
      result.map(async (r) => {
        const user = await prisma.user.findUnique({
          where: { id: r.authorId },
          select: { id: true, username: true },
        });
        return { userId: user.id, username: user.username, commentCount: r._count.id };
      })
    );
    return enriched;
  },

  // Stat 8: Most followed user — sorted and limited in DB
  async getMostFollowedUser() {
    const result = await prisma.follow.groupBy({
      by: ["followeeId"],
      _count: { followerId: true },
      orderBy: { _count: { followerId: "desc" } },
      take: 1,
    });
    if (!result.length) return null;

    const top = result[0];
    const user = await prisma.user.findUnique({
      where: { id: top.followeeId },
      select: { id: true, username: true },
    });
    return { userId: user.id, username: user.username, followers: top._count.followerId };
  },
};

export default statsRepo;