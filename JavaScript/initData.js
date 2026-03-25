// ===== Initialize Data (ONLY first time) =====

if (!localStorage.getItem("socialAppData")) {

  const data = {
    users: [
      {
        id: "u1",
        username: "Alice",
        email: "alice@test.com",
        password: "123",
        following: ["u2"]
      },
      {
        id: "u2",
        username: "Bob",
        email: "bob@test.com",
        password: "123",
        following: []
      }
    ],

    posts: [
      {
        id: "p1",
        authorId: "u2",
        content: "Hello 👋 this is my first post!",
        timestamp: Date.now() - 500000,
        likes: ["u1"]
      },
      {
        id: "p2",
        authorId: "u1",
        content: "Welcome to Social Synapse 🚀",
        timestamp: Date.now() - 200000,
        likes: []
      }
    ],

    comments: [
      {
        id: "c1",
        postId: "p1",
        authorId: "u1",
        content: "Nice post!",
        timestamp: Date.now() - 100000
      }
    ]
  };

  localStorage.setItem("socialAppData", JSON.stringify(data));
}

// ===== Set current user =====

if (!localStorage.getItem("currentUser")) {
  localStorage.setItem("currentUser", JSON.stringify({
    id: "u1",
    username: "Alice"
  }));
}