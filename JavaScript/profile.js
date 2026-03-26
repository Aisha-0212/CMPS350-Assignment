// ===== Follow User =====
function followUser(currentUserId, targetUserId) {
    if (currentUserId === targetUserId) {
        return { success: false, error: "You cannot follow yourself" };
    }

    const data = getData();

    const loggedInUser = data.users.find(u => u.id === currentUserId);
    const targetUser = data.users.find(u => u.id === targetUserId);

    if (!loggedInUser || !targetUser) {
        return { success: false, error: "User not found" };
    }

    // already following
    if (loggedInUser.following.includes(targetUserId)) {
        return { success: false, error: "Already following" };
    }

    // add relationship
    loggedInUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    saveData(data);

    return { success: true };
}

// ===== Unfollow User =====
function unfollowUser(currentUserId, targetUserId) {
    const data = getData();

    const loggedInUser = data.users.find(u => u.id === currentUserId);
    const targetUser = data.users.find(u => u.id === targetUserId);

    if (!loggedInUser || !targetUser) {
        return { success: false, error: "User not found" };
    }

    // remove relationship
    loggedInUser.following = loggedInUser.following.filter(id => id !== targetUserId);
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

// ===== Render Profile =====
const loggedInUser = getCurrentUserData();

if (!loggedInUser) {
    window.location.href = "login.html";
}
else{
    const profile = getUserProfile(loggedInUser.id);

    // Fill in profile info
    if(document.getElementById("username")){
        document.getElementById("username").textContent = profile.user.username;
        document.getElementById("bio").textContent = profile.user.bio || "No bio yet.";
        document.getElementById("post-count").textContent = profile.postsCount;
        document.getElementById("followers-count").textContent = profile.followersCount;
        document.getElementById("following-count").textContent = profile.followingCount;

        // Hide follow button since this is the current user's own profile
        document.getElementById("follow-btn").style.display = "none";

        renderProfilePosts(loggedInUser.id);

        // ===== Update Bio =====
        document.getElementById("update-bio-btn").addEventListener("click", function () {
        const newBio = document.getElementById("bio-input").value.trim();
        const result = updateBio(loggedInUser.id, newBio);
        if (result.success) {
            document.getElementById("bio").textContent = result.bio || "No bio yet.";
            document.getElementById("bio-input").value = "";
            document.getElementById("bio-error").textContent = "";
        } else {
            document.getElementById("bio-error").textContent = result.error;
        }
    });

        // ===== Profile Picture Upload =====
        document.getElementById("profile-pic-input").addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        if(!file.type.startsWith("image/")){
            alert("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("profile-pic").src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    }


    }

    