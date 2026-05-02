const maxLength = 500;

async function createPost(authorId, content){
    if (!content || content.trim()===""){
        return {success:false, error: "post content can't be empty"}
    }
    if(content.trim().length>maxLength){
        return {success:false, error: "post content cannot exceed 500 characters"}
    }
    const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', authorId, content: content.trim() })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true, post: data };
}

// function deletePost(postId, userId){

//     const data = getData();
//     // finding post:
//     const post = data.posts.find(p=>p.id===postId);
//     if(!post){
//         return {success: false, error: "Post not found" }
//     }
//     else if(post.authorId!==userId){
//         return{success: false, error: "Unauthorized access, you can't delete a post that's not yours"}
//     }
//     // removing post
//     data.posts = data.posts.filter(p=>p.id!==postId);
    
    
//     // removing comments:
//     data.comments = data.comments.filter(c=>c.postId!==postId);
//     saveData(data);

//     return{success: true};

// }
async function deletePost(postId, userId) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', postId, userId })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true };
}
// function toggleLike(postId, userId){
//     const data = getData();
//     // finding post:
//     const post = data.posts.find(p=>p.id===postId);
//     if(!post){
//         return {success: false, error: "Post not found" }
//     }

//     const alreadyLiked = post.likes.includes(userId);
//     if(alreadyLiked){
//         // remove like
//         post.likes = post.likes.filter(id=> id!==userId);
//     }
//     else{
//         post.likes.push(userId);
//     }
//     saveData(data);

//     return {
//         success: true,
//         action: alreadyLiked ? "Unliked" : "Liked",
//         likesCount: post.likes.length
//     }
// }
async function toggleLike(postId, userId) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'like', postId, userId })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return data;
}
// function addComment(postId, authorId, content){
//     if(!content || content.trim()===""){
//         return {success: false, error: "content cannot be empty"}
//     }
//     if(content.trim().length>maxLength){
//         return {success: false, error: "content cannot exceed 500 characters"}
//     }
//     const data = getData();
    

//     // make sure post exists
//     const post = data.posts.find(p=>p.id===postId);
//     if(!post){
//         return {success: false, error: "post not found"}
//     }
    
//     // create new comment
//     const newComment = {
//         id: generateId("c"),
//         postId: postId,
//         authorId: authorId,
//         content: content.trim(),
//         timestamp: Date.now()

//     }

//     data.comments.push(newComment);
//     saveData(data);
//     return{
//         success: true,
//         comment: newComment
//     };

// }
async function addComment(postId, authorId, content) {
  if (!content || !content.trim()) return { success: false, error: "content cannot be empty" };
  if (content.trim().length > 500) return { success: false, error: "content cannot exceed 500 characters" };
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', postId, authorId, content: content.trim() })
  });
  const data = await res.json();
  if (!res.ok) return { success: false, error: data.error };
  return { success: true, comment: data };
}


// function getFeedPosts(currentUserId){
//     const data = getData();
//     const currentUser = data.users.find(u=>u.id===currentUserId);

//     // if user not found
//     if(!currentUser){
//         return [];
//     }

//     // include user's own posts and everyone they follow
//     const relevantIds = [...currentUser.following, currentUserId]
//     const feedPosts = data.posts.filter(p=>relevantIds
//         .includes(p.authorId))
//         // sorting based on descending order ie.e newest first
//         .sort((a,b)=>b.timestamp-a.timestamp);

//         return feedPosts;

// }
async function getFeedPosts(currentUserId) {
  const res = await fetch(`/api/posts?userId=${currentUserId}`);
  if (!res.ok) return [];
  return await res.json();
}


// function getPostById(postId){
//     const data = getData();

//     // find post
//     const post = data.posts.find(p=>p.id===postId);
//     if(!post){
//         return null;
//     }

//     const postComments = data.comments.filter(c=>c.postId===postId)
//     // sort comments based on descending order
//     .sort((a,b)=>b.timestamp - a.timestamp);

//     return{
//         post,
//         comments: postComments
//     }

// }

// ===== Render Profile Posts =====


async function getUserPosts(authorId) {
  const res = await fetch(`/api/posts?authorId=${authorId}`);
  if (!res.ok) return [];
  return await res.json();
}


// function renderProfilePosts(userId) {
//     const data = getData();
//     const userPosts = data.posts.filter(p => p.authorId === userId)
//         .sort((a, b) => b.timestamp - a.timestamp);

//     const postsGrid = document.getElementById("profile-posts");
//     postsGrid.innerHTML = "";

//     if (userPosts.length === 0) {
//         postsGrid.innerHTML = "<p>No posts yet.</p>";
//         return;
//     }

//     userPosts.forEach(post => {
//         const postEl = document.createElement("div");
//         postEl.classList.add("post");
//         const preview = post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content;
//         postEl.innerHTML = `
//             <p>${preview}</p>
//             <small>${new Date(post.timestamp).toLocaleDateString()}</small>
//         `;
//         postsGrid.appendChild(postEl);
//     });
// }

async function getPostById(postId) {
  const res = await fetch(`/api/posts/${postId}`);
  if (!res.ok) return null;
  return await res.json();
}
