import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statsRepo = {
  // Stat 1: Average number of followers per user
  async getAverageFollowersPerUser() {
    const result = await prisma.follow.groupBy({
      by: ["followeeId"],
      _count: { followerId: true },
    });
    if (!result.length) return 0;
    const total = result.reduce((sum, r) => sum + r._count.followerId, 0);
    return parseFloat((total / result.length).toFixed(2));
  },

  // Stat 2: Average number of posts per user
  async getAveragePostsPerUser() {
    const result = await prisma.post.groupBy({
      by: ["authorId"],
      _count: { id: true },
    });
    if (!result.length) return 0;
    const total = result.reduce((sum, r) => sum + r._count.id, 0);
    return parseFloat((total / result.length).toFixed(2));
  },

  // Stat 3: Most active user (most posts)
  async getMostActiveUser() {
    const result = await prisma.post.groupBy({
      by: ["authorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    });
    if (!result.length) return null;

    const user = await prisma.user.findUnique({
      where: { id: result[0].authorId },
      select: { id: true, username: true },
    });
    return { userId: user.id, username: user.username, postCount: result[0]._count.id };
  },

  // Stat 4: Most liked post
  async getMostLikedPost() {
    const result = await prisma.like.groupBy({
      by: ["postId"],
      _count: { userId: true },
      orderBy: { _count: { userId: "desc" } },
      take: 1,
    });
    if (!result.length) return null;

    const post = await prisma.post.findUnique({
      where: { id: result[0].postId },
      select: { id: true, content: true },
    });
    return { postId: post.id, content: post.content, likes: result[0]._count.userId };
  },

  // Stat 5: Posts per month — raw SQL, BigInt safely converted
  async getPostsPerMonth() {
    const rows = await prisma.$queryRaw`
      SELECT strftime('%Y-%m', createdAt) AS month, COUNT(*) AS count
      FROM Post
      GROUP BY month
      ORDER BY month ASC
    `;
    // COUNT(*) returns BigInt in Prisma raw queries — convert explicitly
    return rows.map((r) => ({ month: r.month, count: Number(r.count) }));
  },

  // Stat 6: Most frequently used word in posts
  async getMostCommonWord() {
    const posts = await prisma.post.findMany({ select: { content: true } });
    if (!posts.length) return { word: "", count: 0 };

    const stopWords = new Set([
      "the", "a", "an", "is", "in", "it", "to", "and", "of", "for",
      "on", "at", "by", "my", "i", "this", "that", "with", "are", "was",
      "be", "but", "not", "or", "so", "we", "you", "he", "she", "they",
      "just", "so", "up", "out", "if", "about", "who", "get", "which",
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
      if (count > topCount) { topCount = count; topWord = word; }
    }
    return { word: topWord, count: topCount };
  },

  // Stat 7: Top 3 commenters
  async getTopCommenters() {
    const result = await prisma.comment.groupBy({
      by: ["authorId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 3,
    });

    return await Promise.all(
      result.map(async (r) => {
        const user = await prisma.user.findUnique({
          where: { id: r.authorId },
          select: { id: true, username: true },
        });
        return { userId: user.id, username: user.username, commentCount: r._count.id };
      })
    );
  },

  // Stat 8: Most followed user
  async getMostFollowedUser() {
    const result = await prisma.follow.groupBy({
      by: ["followeeId"],
      _count: { followerId: true },
      orderBy: { _count: { followerId: "desc" } },
      take: 1,
    });
    if (!result.length) return null;

    const user = await prisma.user.findUnique({
      where: { id: result[0].followeeId },
      select: { id: true, username: true },
    });
    return { userId: user.id, username: user.username, followers: result[0]._count.followerId };
  },
};

export default statsRepo;