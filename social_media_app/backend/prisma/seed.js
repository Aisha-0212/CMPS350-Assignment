const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

async function main() {
  await prisma.$transaction([
    prisma.repost.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ])

  const userProfiles = [
    { username: 'alice_wonder', email: 'alice@example.com', bio: '✨ Dreamer & creator | Next.js enthusiast', avatar: 'https://i.pravatar.cc/150?img=1', activityLevel: 'high' },
    { username: 'bob_builder', email: 'bob@example.com', bio: '🏗️ Building the web, one component at a time', avatar: 'https://i.pravatar.cc/150?img=2', activityLevel: 'high' },
    { username: 'carol_singer', email: 'carol@example.com', bio: '🎵 Musician | Songwriter | Life is better with melody', avatar: 'https://i.pravatar.cc/150?img=3', activityLevel: 'medium' },
    { username: 'dave_coder', email: 'dave@example.com', bio: '💻 Full-stack dev | Open source contributor', avatar: 'https://i.pravatar.cc/150?img=4', activityLevel: 'high' },
    { username: 'emma_writer', email: 'emma@example.com', bio: '📚 Author of fantasy novels | Coffee addict ☕', avatar: 'https://i.pravatar.cc/150?img=5', activityLevel: 'medium' },
    { username: 'frank_photo', email: 'frank@example.com', bio: '📸 Capturing moments | Landscape photography', avatar: 'https://i.pravatar.cc/150?img=6', activityLevel: 'low' },
    { username: 'grace_dev', email: 'grace@example.com', bio: '☁️ DevOps engineer | Cloud native | Kubernetes', avatar: 'https://i.pravatar.cc/150?img=7', activityLevel: 'medium' },
    { username: 'henry_gamer', email: 'henry@example.com', bio: '🎮 Pro gamer | Twitch streamer | Live daily', avatar: 'https://i.pravatar.cc/150?img=8', activityLevel: 'low' },
    { username: 'iris_artist', email: 'iris@example.com', bio: '🎨 Digital artist | Open for commissions', avatar: 'https://i.pravatar.cc/150?img=9', activityLevel: 'medium' },
    { username: 'jack_fitness', email: 'jack@example.com', bio: '💪 Fitness coach | Gym lifestyle | Stay hard', avatar: 'https://i.pravatar.cc/150?img=10', activityLevel: 'low' },
  ]

  const users = []
  for (const profile of userProfiles) {
    const user = await prisma.user.create({
      data: {
        username: profile.username,
        email: profile.email,
        password: 'hashed_password_123',
        bio: profile.bio,
        avatar: profile.avatar,
      },
    })
    users.push({ ...user, activityLevel: profile.activityLevel })
  }

  const follows = new Set()
  for (const follower of users) {
    const numFollows = randomInt(2, 5)
    const potentialFollowees = users.filter(u => u.id !== follower.id)
    for (let i = potentialFollowees.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [potentialFollowees[i], potentialFollowees[j]] = [potentialFollowees[j], potentialFollowees[i]]
    }
    const selectedFollowees = potentialFollowees.slice(0, Math.min(numFollows, potentialFollowees.length))
    for (const followee of selectedFollowees) {
      follows.add(`${follower.id}-${followee.id}`)
    }
  }
  const followList = Array.from(follows).map(key => {
    const [followerId, followeeId] = key.split('-').map(Number)
    return { followerId, followeeId }
  })
  for (const follow of followList) {
    await prisma.follow.create({ data: follow })
  }

  const postsData = []
  const highActivityUsers = users.filter(u => u.activityLevel === 'high')
  const mediumActivityUsers = users.filter(u => u.activityLevel === 'medium')
  const lowActivityUsers = users.filter(u => u.activityLevel === 'low')
  
  for (const user of highActivityUsers) {
    const numPosts = randomInt(5, 7)
    for (let i = 0; i < numPosts; i++) {
      postsData.push({ authorId: user.id, willBeViral: Math.random() < 0.3 })
    }
  }
  for (const user of mediumActivityUsers) {
    const numPosts = randomInt(3, 5)
    for (let i = 0; i < numPosts; i++) {
      postsData.push({ authorId: user.id, willBeViral: Math.random() < 0.2 })
    }
  }
  for (const user of lowActivityUsers) {
    const numPosts = randomInt(1, 3)
    for (let i = 0; i < numPosts; i++) {
      postsData.push({ authorId: user.id, willBeViral: Math.random() < 0.1 })
    }
  }
  
  const targetPostCount = randomInt(35, 45)
  const finalPostsData = postsData.slice(0, targetPostCount)
  
  const postTemplates = [
    { content: 'Just started learning Next.js! Any tips? 🚀', hasImage: false },
    { content: 'Prisma is amazing! Makes database work so much easier', hasImage: false },
    { content: 'Building a social media app for my portfolio project 💪', hasImage: false },
    { content: 'The weather today is incredible! ☀️', hasImage: true },
    { content: 'Check out my new GitHub project! ⭐', hasImage: false },
    { content: 'React Server Components are a game changer!', hasImage: false },
    { content: 'Just deployed my first Vercel app. Amazing experience!', hasImage: true },
    { content: 'Any recommendations for UI libraries? Using Tailwind currently', hasImage: false },
    { content: 'Open source is the future! Contributed to 3 projects this month', hasImage: false },
    { content: 'Released something new today! Link in bio 🎉', hasImage: true },
    { content: 'Numbers are up 200% this month! Thank you all!', hasImage: false },
    { content: 'Collaboration coming soon with an amazing partner 🤫', hasImage: false },
    { content: 'Just finished recording. Exhausted but happy!', hasImage: true },
    { content: 'Fixed a bug that took 6 hours. It was a typo. 😭', hasImage: false },
    { content: 'TypeScript saves lives. That is all.', hasImage: false },
    { content: 'Working on an open source project. Looking for contributors!', hasImage: false },
    { content: 'The new GitHub Copilot features are insane!', hasImage: false },
    { content: 'Writing clean code is an art form', hasImage: false },
    { content: 'Just finished writing Chapter 12 of my novel 📖', hasImage: false },
    { content: "Writer's block is real, but coffee helps ☕", hasImage: true },
    { content: 'Should I share my writing process on YouTube?', hasImage: false },
    { content: 'My book reached 1000 sales! Thank you everyone! 🎉', hasImage: false },
    { content: 'Just got a new camera! Can\'t wait to test it out 📷', hasImage: true },
    { content: 'Golden hour photography is magical', hasImage: true },
    { content: 'Anyone know good spots for landscape photography?', hasImage: false },
    { content: 'Kubernetes is powerful but complex. Learning every day!', hasImage: false },
    { content: 'Automated our deployment pipeline. Saved 10 hours/week!', hasImage: false },
    { content: 'Speaking at a tech conference next month! Nervous but excited', hasImage: true },
    { content: 'Docker tips: always use multi-stage builds', hasImage: false },
    { content: 'Just hit rank 1 in my favorite game! 🔥', hasImage: false },
    { content: 'Streaming live tonight! Come hang out 🎮', hasImage: true },
    { content: 'New setup finally complete!', hasImage: true },
    { content: 'Just published my first npm package! 🎉', hasImage: false },
    { content: 'Weekend coding session. Who else is grinding? 💻', hasImage: false },
    { content: 'Finally understood closures in JavaScript! 💡', hasImage: false },
  ]
  
  const posts = []
  for (let i = 0; i < finalPostsData.length; i++) {
    const postInfo = finalPostsData[i]
    const template = randomItem(postTemplates)
    const content = template.content
    const imageUrl = template.hasImage ? `https://picsum.photos/400/300?random=${i}` : null
    
    const post = await prisma.post.create({
      data: {
        authorId: postInfo.authorId,
        content: content,
        imageUrl: imageUrl,
      },
    })
    posts.push({ ...post, willBeViral: postInfo.willBeViral })
  }

  const likes = new Set()
  for (const post of posts) {
    let numLikes
    if (post.willBeViral) {
      numLikes = randomInt(8, 15)
    } else {
      numLikes = randomInt(2, 7)
    }
    numLikes = Math.min(numLikes, users.length - 1)
    const potentialLikers = users.filter(u => u.id !== post.authorId)
    for (let i = potentialLikers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [potentialLikers[i], potentialLikers[j]] = [potentialLikers[j], potentialLikers[i]]
    }
    const selectedLikers = potentialLikers.slice(0, numLikes)
    for (const liker of selectedLikers) {
      likes.add(`${liker.id}-${post.id}`)
    }
  }
  const likeList = Array.from(likes).map(key => {
    const [userId, postId] = key.split('-').map(Number)
    return { userId, postId }
  })
  for (const like of likeList) {
    await prisma.like.create({ data: like })
  }

  const commentTemplates = [
    'Great post! 🔥', 'Thanks for sharing!', 'I totally agree with this',
    'This is awesome!', 'Keep up the good work!', 'Love this content!',
    'Very insightful, thank you!', 'This made my day! 😊', 'Could not agree more!',
    'Interesting perspective!', 'Thanks for the tip!', 'This is exactly what I needed',
    'Wow, amazing!', 'So true!', 'This deserves more attention',
    'Underrated post!', 'First! 🥇', 'This is the way',
    'I learned something new today', 'Quality content right here',
  ]
  
  const comments = []
  for (const post of posts) {
    let numComments
    if (post.willBeViral) {
      numComments = randomInt(3, 6)
    } else {
      numComments = randomInt(1, 3)
    }
    const potentialCommenters = users.filter(u => u.id !== post.authorId)
    for (let i = 0; i < numComments && potentialCommenters.length > 0; i++) {
      const author = randomItem(potentialCommenters)
      const content = randomItem(commentTemplates)
      comments.push({
        postId: post.id,
        authorId: author.id,
        content: content,
      })
      if (Math.random() < 0.2) {
        const replyAuthor = randomItem(potentialCommenters.filter(u => u.id !== author.id))
        if (replyAuthor) {
          comments.push({
            postId: post.id,
            authorId: replyAuthor.id,
            content: `@${author.username} totally! ${randomItem(commentTemplates)}`,
          })
        }
      }
    }
  }
  for (const comment of comments) {
    await prisma.comment.create({ data: comment })
  }

  const reposts = new Set()
  for (const post of posts) {
    if (Math.random() < 0.3) {
      const potentialReposters = users.filter(u => u.id !== post.authorId)
      const numReposts = randomInt(1, 3)
      for (let i = 0; i < numReposts && potentialReposters.length > i; i++) {
        const reposter = randomItem(potentialReposters)
        reposts.add(`${reposter.id}-${post.id}`)
      }
    }
  }
  const repostList = Array.from(reposts).map(key => {
    const [userId, postId] = key.split('-').map(Number)
    return { userId, postId }
  })
  for (const repost of repostList) {
    await prisma.repost.create({ data: repost })
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })