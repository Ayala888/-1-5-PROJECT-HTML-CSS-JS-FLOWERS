document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("flowers.json");
        if (!response.ok) {
            throw new Error("Қате орын алды");
        }

        const data = await response.json();
        displayFavoriteFlowers(data.flowers);
        updateFavoriteCount();
        updateCartCount();
    } catch (error) {
        console.error("JSON жүктеу қатесі:", error);
    }
});

function displayFavoriteFlowers(flowers) {
    const likedFlowers = JSON.parse(localStorage.getItem("likedFlowers")) || {};
    const favoriteFlowers = flowers.filter(flower => likedFlowers[flower.id]);

    const favoritesContainer = document.getElementById("favoritesContainer");
    favoritesContainer.innerHTML = "";

    if (favoriteFlowers.length === 0) {
        favoritesContainer.innerHTML = "<p>Сізде әлі таңдаулы гүлдер жоқ.</p>";
        return;
    }

    favoriteFlowers.forEach(flower => {
        const flowerCard = document.createElement("div");
        flowerCard.classList.add("card-product");

        flowerCard.innerHTML = `
            <i class="fa-solid fa-heart heart-icon" data-id="${flower.id}" style="color: red"></i>
            <img class="img2" src="${flower.image}" alt="${flower.name}">
            <h4>${flower.name}</h4><br>
            <p><span class="price">${flower.price}</span>
            <span class="old-price">${flower.oldPrice}</span></p><br>
            <button class="button add-to-cart" data-id="${flower.id}">Себетке қосу</button>`;

        favoritesContainer.appendChild(flowerCard);
    });

    document.querySelectorAll(".heart-icon").forEach(heart => {
        heart.addEventListener("click", () => {
            const flowerId = heart.getAttribute("data-id");
            removeFromFavorites(flowerId);
        });
    });

    
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const flowerId = button.getAttribute("data-id");
            let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            if (cartItems.includes(flowerId)) {
                cartItems = cartItems.filter(id => id !== flowerId);
                button.textContent = "Себетке қосу";
                button.style.backgroundColor = "";
            } else {
                cartItems.push(flowerId);
                button.textContent = "Себетке қосылды";
                button.style.backgroundColor = "#d9534f";
            }
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            updateCartCount();
        });

        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const flowerId = button.getAttribute("data-id");
        if (cartItems.includes(flowerId)) {
            button.textContent = "Себетке қосылды";
            button.style.backgroundColor = "#d9534f";
        }
    });

    updateFavoriteCount();
}

function removeFromFavorites(flowerId) {
    let likedFlowers = JSON.parse(localStorage.getItem("likedFlowers")) || {};

    if (likedFlowers[flowerId]) {
        delete likedFlowers[flowerId];
    }

    localStorage.setItem("likedFlowers", JSON.stringify(likedFlowers));

    const flowerCard = document.querySelector(`.card-product .heart-icon[data-id="${flowerId}"]`)?.parentElement;
    if (flowerCard) {
        flowerCard.remove();
    }

    updateFavoriteCount();
}

function updateFavoriteCount() {
    const likedFlowers = JSON.parse(localStorage.getItem("likedFlowers")) || {};
    const favoriteCount = document.querySelector("#likeCount");

    let count = Object.keys(likedFlowers).length;
    favoriteCount.textContent = count;

    favoriteCount.style.display = count > 0 ? "flex" : "none";
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartCount = document.querySelector("#cartCount");

    cartCount.textContent = cartItems.length;
    cartCount.style.display = cartItems.length > 0 ? "flex" : "none";
}


