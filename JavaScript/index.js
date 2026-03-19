initAppData();

const user = getCurentUser();
if(user){
    window.location.href="feed.html"
}
else{
    window.location.href = "login.html"
}