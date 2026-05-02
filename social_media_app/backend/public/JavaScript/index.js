const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');
if (userId) {
    window.location.href = `feed.html?userId=${userId}`;
} else {
    window.location.href = 'login.html';
}