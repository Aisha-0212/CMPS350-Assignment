import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CommentRepo = {
  async getByPost(postId) {
    return await prisma.comment.findMany({
      where: { postId },
      include: { author: true },
      orderBy: { createdAt: "asc" },
    });
  },

  async getByUser(userId) {
    return await prisma.comment.findMany({
      where: { authorId: userId },
      include: { post: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async add(postId, authorId, content) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const comment = await prisma.comment.create({
      data: { postId, authorId, content },
      include: { author: true },
    });

    return { success: true, comment };
  },

  async delete(commentId, userId) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return { success: false, error: "Comment not found" };
    }
    if (comment.authorId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return { success: true };
  },
};

export default CommentRepo;
