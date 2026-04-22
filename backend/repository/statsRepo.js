import userRepo from "./userRepo";
import postRepo from "./postRepo";
import commentRepo from "./commentRepo";

const statsRepo = {

  async getAverageFollowersPerUser() {
    const users = await userRepo.getAll();
    if (!users.length) return 0;

    let total = 0;
    users.forEach(u => total += u.followers?.length || 0);

    return total / users.length;
  },

  async getAveragePostsPerUser() {
    const users = await userRepo.getAll();
    if (!users.length) return 0;

    let total = 0;
    for (let u of users) {
      const posts = await postRepo.getFeedPosts(u.id);
      total += posts.length;
    }

    return total / users.length;
  },

  async getMostActiveUser() {
    const users = await userRepo.getAll();
    let max = 0;
    let result = null;

    for (let u of users) {
      const posts = await postRepo.getFeedPosts(u.id);

      if (posts.length > max) {
        max = posts.length;
        result = {
          userId: u.id,
          username: u.username,
          postCount: posts.length
        };
      }
    }

    return result;
  },

  async getMostLikedPost() {
    const users = await userRepo.getAll();
    let allPosts = [];

    for (let u of users) {
      const posts = await postRepo.getFeedPosts(u.id);
      allPosts = allPosts.concat(posts);
    }

    if (!allPosts.length) return null;

    let top = allPosts[0];

    allPosts.forEach(p => {
      if ((p.likes?.length || 0) > (top.likes?.length || 0)) {
        top = p;
      }
    });

    return {
      postId: top.id,
      content: top.content,
      likes: top.likes?.length || 0
    };
  },

  async getPostsPerMonth() {
    const users = await userRepo.getAll();
    let allPosts = [];

    for (let u of users) {
      const posts = await postRepo.getFeedPosts(u.id);
      allPosts = allPosts.concat(posts);
    }

    const result = {};

    allPosts.forEach(p => {
      const m = new Date(p.createdAt).toLocaleString("default", { month: "short" });
      result[m] = (result[m] || 0) + 1;
    });

    return Object.keys(result).map(m => ({
      month: m,
      count: result[m]
    }));
  },

  async getMostCommonWord() {
    const users = await userRepo.getAll();
    let allPosts = [];

    for (let u of users) {
      const posts = await postRepo.getFeedPosts(u.id);
      allPosts = allPosts.concat(posts);
    }

    const map = {};

    allPosts.forEach(p => {
      p.content.split(/\s+/).forEach(word => {
        const w = word.toLowerCase().replace(/[^\w]/g, "");
        if (!w) return;
        map[w] = (map[w] || 0) + 1;
      });
    });

    let max = 0;
    let word = "";

    for (let k in map) {
      if (map[k] > max) {
        max = map[k];
        word = k;
      }
    }

    return word;
  },

  async getTopCommenters() {
    const users = await userRepo.getAll();
    const arr = [];

    for (let u of users) {
      const comments = await commentRepo.getByUser?.(u.id) || [];

      arr.push({
        userId: u.id,
        username: u.username,
        commentCount: comments.length
      });
    }

    return arr.sort((a, b) => b.commentCount - a.commentCount).slice(0, 3);
  },

  async getMostFollowedUser() {
    const users = await userRepo.getAll();

    let max = 0;
    let top = null;

    users.forEach(u => {
      const c = u.followers?.length || 0;

      if (c > max) {
        max = c;
        top = {
          userId: u.id,
          username: u.username,
          followers: c
        };
      }
    });

    return top;
  }
};

export default statsRepo;