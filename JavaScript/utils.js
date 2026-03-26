function validateUsername(username) {
    if (username.length < 3) {
        return { isValid: false, message: "Username must be at least 3 characters" };
    }
    if (username.length > 20) {
        return { isValid: false, message: "Username must be less than 20 characters" };
    }
    let regex = /^[a-zA-Z0-9_]+$/;
    if (!regex.test(username)) {
        return { isValid: false, message: "Username can only contain letters, numbers, and underscores" };
    }
    return { isValid: true, message: "" };
}





function validateEmail(email) {
    let emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    let isOk = emailRegex.test(email);
    if (isOk == false) {
        return { isValid: false, message: "Please enter a valid email address" };
    }
    return { isValid: true, message: "" };
}





function validatePassword(password) {
    if (password.length < 6) {
        return { isValid: false, message: "Password must be at least 6 characters" };
    }
    return { isValid: true, message: "" };
}