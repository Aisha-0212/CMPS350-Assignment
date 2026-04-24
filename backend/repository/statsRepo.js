import UserRepo from "./UserRepo.js";
import PostRepo from "./PostRepo.js";
import CommentRepo from "./CommentRepo.js";

const StatsRepo = {
  async getAverageFollowersPerUser() {
    const users = await UserRepo.getAll();
    if (!users.length) return 0;

    const total = users.reduce((sum, u) => sum + (u.followers?.length || 0), 0);
    return total / users.length;
  },

  async getAveragePostsPerUser() {
    const users = await UserRepo.getAll();
    if (!users.length) return 0;

    const total = users.reduce((sum, u) => sum + (u.posts?.length || 0), 0);
    return total / users.length;
  },

  async getMostActiveUser() {
    const users = await UserRepo.getAll();
    if (!users.length) return null;

    let max = 0;
    let result = null;

    for (const u of users) {
      const count = u.posts?.length || 0;
      if (count > max) {
        max = count;
        result = {
          userId: u.id,
          username: u.username,
          postCount: count,
        };
      }
    }

    return result;
  },

  async getMostLikedPost() {
    const users = await UserRepo.getAll();
    let allPosts = [];

    for (const u of users) {
      const posts = await PostRepo.getFeedPosts(u.id);
      allPosts = allPosts.concat(posts);
    }

    if (!allPosts.length) return null;

    let top = allPosts[0];

    allPosts.forEach((p) => {
      if ((p.likes?.length || 0) > (top.likes?.length || 0)) {
        top = p;
      }
    });

    return {
      postId: top.id,
      content: top.content,
      likes: top.likes?.length || 0,
    };
  },

  async getPostsPerMonth() {
    const users = await UserRepo.getAll();
    let allPosts = [];

    for (const u of users) {
      const posts = await PostRepo.getFeedPosts(u.id);
      allPosts = allPosts.concat(posts);
    }

    const result = {};

    allPosts.forEach((p) => {
      const m = new Date(p.createdAt).toLocaleString("default", {
        month: "short",
      });
      result[m] = (result[m] || 0) + 1;
    });

    return Object.keys(result).map((m) => ({ month: m, count: result[m] }));
  },

  async getMostCommonWord() {
    const users = await UserRepo.getAll();
    let allPosts = [];

    for (const u of users) {
      const posts = await PostRepo.getFeedPosts(u.id);
      allPosts = allPosts.concat(posts);
    }

    const map = {};

    allPosts.forEach((p) => {
      p.content.split(/\s+/).forEach((word) => {
        const w = word.toLowerCase().replace(/[^\w]/g, "");
        if (!w) return;
        map[w] = (map[w] || 0) + 1;
      });
    });

    let max = 0;
    let top = "";

    for (const k in map) {
      if (map[k] > max) {
        max = map[k];
        top = k;
      }
    }

    return top;
  },

  async getTopCommenters() {
    const users = await UserRepo.getAll();
    const arr = [];

    for (const u of users) {
      const comments = await CommentRepo.getByUser(u.id);
      arr.push({
        userId: u.id,
        username: u.username,
        commentCount: comments.length,
      });
    }

    return arr.sort((a, b) => b.commentCount - a.commentCount).slice(0, 3);
  },

  async getMostFollowedUser() {
    const users = await UserRepo.getAll();
    if (!users.length) return null;

    let max = 0;
    let top = null;

    users.forEach((u) => {
      const c = u.followers?.length || 0;
      if (c > max) {
        max = c;
        top = {
          userId: u.id,
          username: u.username,
          followers: c,
        };
      }
    });

    return top;
  },
};

export default StatsRepo;
