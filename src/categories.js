async function loadAllProducts() {
  let products = JSON.parse(localStorage.getItem("allProducts"));
  if (!products) {
    const response = await fetch("./data/products.json");
    products = await response.json();
    localStorage.setItem("allProducts", JSON.stringify(products));
  }
  return products;
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function updateHeaderCounts() {
  const wishlist = getWishlist();
  const cart = getCart();

  const wishlistCountEl = document.getElementById("wishlistCount");
  const cartCountEl = document.getElementById("cartCount");

  if (wishlistCountEl) wishlistCountEl.textContent = wishlist.length;
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}

function setupWishlistToggle(container) {
  container.querySelectorAll(".wishlist-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      let wishlist = getWishlist();
      const icon = btn.querySelector("i");

      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter((id) => id !== productId);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      } else {
        wishlist.push(productId);
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      updateHeaderCounts();
    });
  });
}

function setupAddToCart(container) {
  container.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      let cart = getCart();

      if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateHeaderCounts();
      }
    });
  });
}

function setupProductLinkNavigation(container) {
  container.querySelectorAll(".product-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.id;
      localStorage.setItem("selectedProductId", productId);
    });
  });
}

async function renderCategoryProducts() {
  const category = getQueryParam("category");
  const allProducts = await loadAllProducts();

  const filteredProducts = allProducts.filter((p) =>
    p.category.toLowerCase().includes(category.toLowerCase())
  );

  const container = document.getElementById("categoryProductContainer");

  if (filteredProducts.length === 0) {
    container.innerHTML = "<p>No products found in this category.</p>";
    return;
  }

  container.innerHTML = filteredProducts
    .map(
      (product) => `
        <div class="bg-surface p-4 space-y-4 rounded-sm">
          <div class="relative">
            ${
              product.badge
                ? `<span class="inline-block bg-primary text-white px-2 py-1 rounded-sm text-xs absolute top-0 left-0 z-1">${product.badge}</span>`
                : ""
            }
            <span class="absolute top-0 right-0 z-1 cursor-pointer text-xl wishlist-toggle" data-id="${
              product.id
            }">
              <i class="${
                isInWishlist(product.id) ? "fa-solid" : "fa-regular"
              } fa-heart"></i>
            </span>
            <a class="product-link block w-full mx-auto relative group overflow-hidden" href="product-details.html" data-id="${
              product.id
            }">
              <img alt="${product.title}" src="${
        product.image
      }" class="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110" />
            </a>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-muted">${product.category}</p>
            <p class="font-heading font-semibold text-accent">${
              product.title
            }</p>
            <div class="flex items-center gap-2 font-heading">
              <span class="text-xl font-semibold">$${product.price.toFixed(
                2
              )}</span>
              <span class="text-sm font-medium text-muted line-through">$${product.originalPrice.toFixed(
                2
              )}</span>
              <span class="text-xs font-medium text-muted bg-white px-2 py-0.5 rounded-full">${
                product.discount
              }</span>
              <button type="button" class="flex items-center gap-1 bg-white hover:bg-primary p-2 rounded-sm ml-auto add-to-cart" data-id="${
                product.id
              }">
                <img src="images/shopping-cart-outlined.svg" alt="shopping-cart-outlined" class="w-5" />
              </button>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  // Attach Events AFTER rendering
  setupWishlistToggle(container);
  setupAddToCart(container);
  setupProductLinkNavigation(container);
  updateHeaderCounts();
}

// Initial Render
renderCategoryProducts();
