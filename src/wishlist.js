async function loadAllProducts() {
  let products = JSON.parse(localStorage.getItem("allProducts"));
  if (!products) {
    const response = await fetch("../data/products.json");
    products = await response.json();
    localStorage.setItem("allProducts", JSON.stringify(products));
  }
  return products;
}

function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function getWishlistSelections() {
  return JSON.parse(localStorage.getItem("wishlistSelections")) || {};
}

function updateHeaderCounts() {
  const wishlist = getWishlist();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("wishlistCount").textContent = wishlist.length;
  document.getElementById("cartCount").textContent = cart.length;
}

function removeWishlistItem(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((id) => id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Also remove selections (optional cleanup)
  let selections = getWishlistSelections();
  delete selections[productId];
  localStorage.setItem("wishlistSelections", JSON.stringify(selections));

  renderWishlist();
  updateHeaderCounts();
}

async function renderWishlist() {
  const allProducts = await loadAllProducts();
  const wishlist = getWishlist();
  const selections = getWishlistSelections();

  const wishlistProducts = allProducts.filter((p) =>
    wishlist.includes(p.id.toString())
  );
  const container = document.getElementById("wishlistContainer");

  if (wishlistProducts.length === 0) {
    container.innerHTML = `<p class="text-muted">No products found in your wishlist.</p>`;
    return;
  }

  container.innerHTML = wishlistProducts
    .map((product) => {
      const selected = selections[product.id] || {
        color: "Default",
        size: "Default",
      };

      return `
        <div class="flex gap-4 py-4 border-b border-border">
            <div class="bg-white p-2 size-20 rounded-sm relative">
              <img alt="${
                product.title
              }" class="w-full h-full object-contain" src="${product.image}" />
            </div>
            <div class="w-full flex gap-4 justify-between">
              <div class="space-y-1 w-full">
                <p class="font-semibold font-heading">${product.title}</p>
                <p class="text-sm">
                  <span class="font-medium">Color:</span> <span>${
                    selected.color
                  }</span>
                </p>
                <p class="text-sm">
                  <span class="font-medium">Size:</span> <span>${
                    selected.size
                  }</span>
                </p>
              </div>
              <div class="flex flex-col justify-between items-end">
                <button class="text-muted hover:text-accent remove-wishlist" data-id="${
                  product.id
                }">
                  <i class="fa-solid fa-trash-can"></i>
                </button>            
                <p class="font-semibold font-heading">$${product.price.toFixed(
                  2
                )}</p>
              </div>
            </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".remove-wishlist").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      removeWishlistItem(id);
    });
  });
}

// Initial Load
renderWishlist();
updateHeaderCounts();
