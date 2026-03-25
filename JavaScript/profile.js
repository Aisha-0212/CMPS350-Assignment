// ===== Follow User =====
function followUser(currentUserId, targetUserId) {
    if (currentUserId === targetUserId) {
        return { success: false, error: "You cannot follow yourself" };
    }

    const data = getData();

    const currentUser = data.users.find(u => u.id === currentUserId);
    const targetUser = data.users.find(u => u.id === targetUserId);

    if (!currentUser || !targetUser) {
        return { success: false, error: "User not found" };
    }

    // already following
    if (currentUser.following.includes(targetUserId)) {
        return { success: false, error: "Already following" };
    }

    // add relationship
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    saveData(data);

    return { success: true };
}

// ===== Unfollow User =====
function unfollowUser(currentUserId, targetUserId) {
    const data = getData();

    const currentUser = data.users.find(u => u.id === currentUserId);
    const targetUser = data.users.find(u => u.id === targetUserId);

    if (!currentUser || !targetUser) {
        return { success: false, error: "User not found" };
    }

    // remove relationship
    currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);

    saveData(data);

    return { success: true };
}

// ===== Update Bio =====
function updateBio(userId, newBio) {
    const MAX_LENGTH = 200;

    if (newBio.length > MAX_LENGTH) {
        return { success: false, error: "Bio cannot exceed 200 characters" };
    }

    const data = getData();

    const user = data.users.find(u => u.id === userId);

    if (!user) {
        return { success: false, error: "User not found" };
    }

    user.bio = newBio.trim();

    saveData(data);

    return { success: true, bio: user.bio };
}

// ===== Get User Profile =====
function getUserProfile(userId) {
    const data = getData();

    const user = data.users.find(u => u.id === userId);

    if (!user) {
        return null;
    }

    const userPosts = data.posts.filter(p => p.authorId === userId);

    return {
        user,
        posts: userPosts,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        postsCount: userPosts.length
    };
}