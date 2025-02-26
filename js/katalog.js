document.addEventListener("DOMContentLoaded", () => {
    updateFavoriteCount();
    updateCartCount();
});

function updateFavoriteCount() {
    const likedFlowers = JSON.parse(localStorage.getItem("likedFlowers")) || {};
    const favoriteCount = document.querySelector("#likeCount");
    let count = Object.keys(likedFlowers).length;
    favoriteCount.textContent = count;
    favoriteCount.style.display = count > 0 ? "flex" : "none";
}

function updateCartCount(){
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartCount = document.querySelector("#cartCount");
    cartCount.textContent = cartItems.length;
    cartCount.style.display = cartItems.length > 0 ? "flex" : "none";
}
