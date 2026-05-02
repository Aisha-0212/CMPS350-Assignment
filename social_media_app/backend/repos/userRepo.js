import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRepo = {
  async getById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        posts: true,
        followers: true,
        following: true,
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });
  },

  async getAll() {
    return await prisma.user.findMany({
      include: { posts: true, followers: true, following: true },
    });
  },

  // Search users by username
  async search(query) {
    return await prisma.user.findMany({
      where: { username: { contains: query } },
      select: { id: true, username: true, bio: true, avatar: true },
    });
  },

  async getByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  },

  async create(data) {
    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        bio: data.bio ?? "",
      },
    });
  },

  async updateBio(id, bio) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: { bio },
    });
  },

  async followUser(followerId, followeeId) {
    return await prisma.follow.create({
      data: {
        followerId: parseInt(followerId),
        followeeId: parseInt(followeeId),
      },
    });
  },

  async unfollowUser(followerId, followeeId) {
    return await prisma.follow.deleteMany({
      where: {
        followerId: parseInt(followerId),
        followeeId: parseInt(followeeId),
      },
    });
  },
};

export default userRepo;