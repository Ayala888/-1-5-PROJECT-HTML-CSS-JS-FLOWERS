document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("flowers.json");
        if (!response.ok) {
            throw new Error("Қате орын алды");
        }

        const data = await response.json();
        const flowers = data.flowers;

        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const cartContainer = document.getElementById("cart-items");
        const totalPriceElement = document.getElementById("total-price");
        cartContainer.innerHTML = "";
        let totalPrice = 0;

        if (cartItems.length === 0) {
            cartContainer.innerHTML = "<p>Сіздің себетіңіз бос.</p>";
        } else {
            let cartMap = {};
            cartItems.forEach(id => {
                cartMap[id] = (cartMap[id] || 0) + 1;
            });

            Object.keys(cartMap).forEach(cartItemId => {
                const flower = flowers.find(f => f.id === cartItemId);
                if (flower) {
                    const quantity = cartMap[cartItemId];
                    const price = parseInt(flower.price.replace(/\D/g, ""));
                    const totalItemPrice = price * quantity;
                    totalPrice += totalItemPrice;

                    const cartItem = document.createElement("div");
                    cartItem.classList.add("cart-item");
                    cartItem.innerHTML = `
                        <div class="cart-item-content">
                            <img src="${flower.image}" alt="${flower.name}">
                            <div>
                                <div class="flower-info">
                                    <h4>${flower.name}</h4>
                                    <p>Бағасы: <strong>${flower.price}</strong></p>
                                </div>
                                <p>Саны: 
                                    <button class="quantity-btn decrease" data-id="${flower.id}">➖</button>
                                    <span class="quantity">${quantity}</span>
                                    <button class="quantity-btn increase" data-id="${flower.id}">➕</button>
                                </p>
                                <p>Жалпы: <strong class="total-item-price">${totalItemPrice.toLocaleString()}₸</strong></p>
                                <button class="remove-btn" data-id="${flower.id}">×</button>
                            </div>
                        </div>
                    `;
                    cartContainer.appendChild(cartItem);
                }
            });
            totalPriceElement.textContent = totalPrice.toLocaleString() + "₸";

            document.querySelectorAll(".quantity-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const flowerId = event.target.getAttribute("data-id");
                    const isIncrease = event.target.classList.contains("increase");
                    if (isIncrease) {
                        cartItems.push(flowerId);
                    } else {
                        const index = cartItems.indexOf(flowerId);
                        if (index !== -1) {
                            cartItems.splice(index, 1);
                        }
                    }
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    location.reload();
                });
            });

            document.querySelectorAll(".remove-btn").forEach(button => {
                button.addEventListener("click", (event) => {
                    const flowerId = event.target.getAttribute("data-id");
                    cartItems = cartItems.filter(id => id !== flowerId);
                    localStorage.setItem("cartItems", JSON.stringify(cartItems));
                    location.reload();
                });
            });
        }

        updateCartCount();
        updateFavoriteCount();

    } catch (error) {
        console.error("JSON жүктеу қатесі:", error);
    }
});

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

