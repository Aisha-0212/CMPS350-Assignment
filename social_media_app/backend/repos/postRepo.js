import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const postRepo = {
  async getFeedPosts(userId) {
    userId = parseInt(userId); // ← was missing, caused empty feed
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });

    const followeeIds = following.map((f) => f.followeeId);
    followeeIds.push(userId);

    return await prisma.post.findMany({
      where: { authorId: { in: followeeIds } },
      include: { author: true, likes: true, comments: { include: { author: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getByAuthor(authorId) {
    return await prisma.post.findMany({
      where: { authorId: parseInt(authorId) },
      include: { author: true, likes: true, comments: { include: { author: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id) {
    return await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { author: true, likes: true, comments: { include: { author: true } } },
    });
  },

  async getAll() {
    return await prisma.post.findMany({
      include: { author: true, likes: true, comments: { include: { author: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  // Search posts by content keyword
  async search(query) {
    return await prisma.post.findMany({
      where: { content: { contains: query } },
      include: { author: true, likes: true, comments: { include: { author: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(authorId, content) {
    return await prisma.post.create({
      data: { authorId: parseInt(authorId), content },
      include: { author: true, likes: true, comments: { include: { author: true } } },
    });
  },

  async delete(postId, userId) {
    postId = parseInt(postId);
    userId = parseInt(userId);
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return { success: false, error: "Post not found" };
    if (post.authorId !== userId) return { success: false, error: "Unauthorized" };

    await prisma.post.delete({ where: { id: postId } });
    return { success: true };
  },

  async toggleLike(postId, userId) {
    postId = parseInt(postId);
    userId = parseInt(userId);

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { success: false, error: "Post not found" };

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
      return { success: true, liked: false };
    } else {
      await prisma.like.create({ data: { postId, userId } });
      return { success: true, liked: true };
    }
  },
};

export default postRepo;