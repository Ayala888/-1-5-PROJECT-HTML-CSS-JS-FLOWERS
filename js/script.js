document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("flowers.json");
        if (!response.ok) {
            throw new Error("Қате орын алды");
        }

        const data = await response.json();
        console.log(data);

        if (document.body.classList.contains("favorites-page")) {
            displayFavoriteFlowers(data.flowers);
        } else {
            displayFlowers(data.flowers);
        }

        document.getElementById("searchBtn").addEventListener("click", () => handleSearch(data.flowers));

        document.getElementById("searchBar").addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSearch(data.flowers);
            }
        });
        

        document.querySelector(".fa-magnifying-glass").addEventListener("click", () => {
            const searchBar = document.getElementById("searchBar");
            searchBar.focus();
            searchBar.style.outline = "3px solid #ff4081";
            setTimeout(() => searchBar.style.outline = "none", 1500);
        });

        document.querySelectorAll(".section-link").forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();
                const target = document.getElementById(link.getAttribute("href").slice(1));
                target.scrollIntoView({ behavior: "smooth" });
            });
        });
    } catch (error) {
        console.error("JSON жүктеу қатесі:", error);
    }
});



function handleSearch(flowers) {
    const query = document.getElementById("searchBar").value.toLowerCase();
    if (query === "") {
        displayFlowers(flowers);
    } else {
        const filteredFlowers = flowers.filter(flower =>
            flower.name.toLowerCase().includes(query)
        );
        displayFlowers(filteredFlowers);
    }
}



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

function displayFlowers(flowers) {
    const menuContainer = document.querySelector(".card");
    menuContainer.innerHTML = "";
    const likedFlowers = JSON.parse(localStorage.getItem("likedFlowers")) || {};
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    flowers.forEach(flower => {
        const flowerCard = document.createElement("div");
        flowerCard.classList.add("card-product");

        const isLiked = likedFlowers[flower.id];
        const heartClass = isLiked ? "fa-solid" : "fa-regular";
        const heartColor = isLiked ? "red" : "white";

        flowerCard.innerHTML = `
            <i class="fa-heart ${heartClass} heart-icon" data-id="${flower.id}" style="color: ${heartColor}"></i>
            <img class="img2" src="${flower.image}" alt="${flower.name}">
            <h4>${flower.name}</h4><br>
            <p><span class="price">${flower.price}</span>
            <span class="old-price">${flower.oldPrice}</span></p><br>
            <button class="button add-to-cart" data-id="${flower.id}">Себетке қосу</button>
        `;

        menuContainer.appendChild(flowerCard);
    });

    document.querySelectorAll(".heart-icon").forEach(heart => {
        heart.addEventListener("click", () => {
            const flowerId = heart.getAttribute("data-id");
            if (likedFlowers[flowerId]) {
                delete likedFlowers[flowerId];
                heart.classList.remove("fa-solid");
                heart.classList.add("fa-regular");
                heart.style.color = "white";
            } else {
                likedFlowers[flowerId] = true;
                heart.classList.remove("fa-regular");
                heart.classList.add("fa-solid");
                heart.style.color = "red";
            }
            localStorage.setItem("likedFlowers", JSON.stringify(likedFlowers));
            updateFavoriteCount();
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
    updateCartCount();
}


function displayFavoriteFlowers(flowers) {
    const likedFlowers = JSON.parse(localStorage.getItem("likedFlowers")) || {};
    const favoriteFlowers = flowers.filter(flower => likedFlowers[flower.id]);
    displayFlowers(favoriteFlowers);
}


function searchFlowers(query, flowers) {
    const filteredFlowers = flowers.filter(flower =>
        flower.name.toLowerCase().includes(query)
    );
    displayFlowers(filteredFlowers);
}


function showDetails(flowerId) {
    console.log(`Displaying details for flower ID: ${flowerId}`);
}










