const maxLength = 500;

function createPost(authorId, content){
    if (!content || content.trim()===""){
        return {success:false, error: "post content can't be empty"}
    }
    if(content.trim().length>maxLength){
        return {success:false, error: "post content cannot exceed 500 characters"}
    }
    const data = getData();
    const newPost = {
        id:        generateId("p"),
        authorId:  authorId,
        content:   content.trim(),
        timestamp: Date.now(),
        likes:     []
    }
    data.posts.push(newPost);
    saveData(data);
    return{success: true, post: newPost}
}
function deletePost(postId, userId){

    const data = getData();
    // finding post:
    const post = data.posts.find(p=>p.id===postId);
    if(!post){
        return {success: false, error: "Post not found" }
    }
    else if(post.authorId!==userId){
        return{success: false, error: "Unauthorized access, you can't delete a post that's not yours"}
    }
    // removing post
    data.posts = data.posts.filter(p=>p.id!==postId);
    
    
    // removing comments:
    data.comments = data.comments.filter(c=>c.postId!==postId);
    saveData(data);

    return{success: true};

}

function toggleLike(postId, userId){
    const data = getData();
    // finding post:
    const post = data.posts.find(p=>p.id===postId);
    if(!post){
        return {success: false, error: "Post not found" }
    }

    const alreadyLiked = post.likes.includes(userId);
    if(alreadyLiked){
        // remove like
        post.likes = post.likes.filter(id=> id!==userId);
    }
    else{
        post.likes.push(userId);
    }
    saveData(data);

    return {
        success: true,
        action: alreadyLiked ? "Unliked" : "Liked",
        likesCount: post.likes.length
    }
}

function addComment(postId, authorId, content){
    if(!content || content.trim()===""){
        return {success: false, error: "content cannot be empty"}
    }
    if(content.trim().length>maxLength){
        return {success: false, error: "content cannot exceed 500 characters"}
    }
    const data = getData();
    

    // make sure post exists
    const post = data.posts.find(p=>p.id===postId);
    if(!post){
        return {success: false, error: "post not found"}
    }
    
    // create new comment
    const newComment = {
        id: generateId("c"),
        postId: postId,
        authorId: authorId,
        content: content.trim(),
        timestamp: Date.now()

    }

    data.comments.push(newComment);
    saveData(data);
    return{
        success: true, 
        comment: newComment
    };

}


function getFeedPosts(currentUserId){
    const data = getData();
    const currentUser = data.users.find(u=>u.id===currentUserId);

    // if user not found
    if(!currentUser){
        return [];
    }

    // include user's own posts and everyone they follow
    const relevantIds = [...currentUser.following, currentUserId]
    const feedPosts = data.posts.filter(p=>relevantIds
        .includes(p.authorId))
        // sorting based on descending order ie.e newest first
        .sort((a,b)=>b.timestamp-a.timestamp);

        return feedPosts;

}

function getPostById(postId){
    const data = getData();

    // find post
    const post = data.posts.find(p=>p.id===postId);
    if(!post){
        return null;
    }

    const postComments = data.comments.filter(c=>c.postId===postId)
    // sort comments based on descending order
    .sort((a,b)=>b.timestamp - a.timestamp);

    return{
        post,
        comments: postComments
    }

}



