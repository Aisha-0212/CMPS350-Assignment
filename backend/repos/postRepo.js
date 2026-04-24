import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PostRepo = {
  async getFeedPosts(userId) {
    // Get IDs of users that userId follows
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });

    const followeeIds = following.map((f) => f.followeeId);
    followeeIds.push(userId); // include own posts in feed

    return await prisma.post.findMany({
      where: {
        authorId: { in: followeeIds },
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
  },

  async create(authorId, content) {
    return await prisma.post.create({
      data: { authorId, content },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
  },

  async delete(postId, userId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return { success: false, error: "Post not found" };
    }
    if (post.authorId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.post.delete({ where: { id: postId } });
    return { success: true };
  },

  async toggleLike(postId, userId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const existing = await prisma.like.findFirst({
      where: { postId, userId },
    });

    if (existing) {
      // Already liked → unlike
      await prisma.like.delete({ where: { id: existing.id } });
      return { success: true, liked: false };
    } else {
      // Not liked yet → like
      await prisma.like.create({ data: { postId, userId } });
      return { success: true, liked: true };
    }
  },
};

export default PostRepo;
