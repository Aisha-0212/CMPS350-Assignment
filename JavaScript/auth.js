// auth.js

function registerUser(username, email, password) {
    if (username == "" || email == "" || password == "") {
        return { success: false, message: "All fields are required" };
    }
    const uCheck = validateUsername(username);
    if (!uCheck.isValid) {
        return { success: false, message: uCheck.message };
    }
    const eCheck = validateEmail(email);
    if (!eCheck.isValid) {
        return { success: false, message: eCheck.message };
    }
    const pCheck = validatePassword(password);
    if (!pCheck.isValid) {
        return { success: false, message: pCheck.message };
    }
    let data = getData();
    let exists = false;
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].username == username) {
            exists = true;
        }
    }
    if (exists == true) {
        return { success: false, message: "Username already taken" };
    }
    let emailExists = data.users.some(u => {
        return u.email == email;
    });
    if (emailExists) {
        return { success: false, message: "Email already registered" };
    }
    let newUser = {};
    newUser.id = generateId("u");
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.bio = "";
    newUser.profilePic = "";
    newUser.followers = [];
    newUser.following = [];
    data.users.push(newUser);
    saveData(data);
    setCurrentUser(newUser.id);
    return {
        success: true,
        message: "Account created successfully!",
        user: newUser
    };
}








function loginUser(email, password) {
    if (email == "" || password == "") {
        return { success: false, message: "Email and password are required" };
    }
    let data = getData();
    let found = null;
    for (let i = 0; i < data.users.length; i++) {
        if (data.users[i].email == email) {
            found = data.users[i];
        }
    }
    if (found == null) {
        return { success: false, message: "No account found with this email" };
    }
    if (found.password != password) {
        return { success: false, message: "Incorrect password" };
    }
    setCurrentUser(found.id);
    return {
        success: true,
        message: "Login successful!",
        user: found
    };
}









function logoutUser() {
    setCurrentUser(null);
    return {
        success: true,
        message: "Logged out successfully"
    };
}





function isLoggedIn() {
    let current = getCurrentUser();
    if (current == null) {
        return false;
    } else {
        return true;
    }
}




function getCurrentUserData() {
    let user = getCurrentUser();
    return user;
}