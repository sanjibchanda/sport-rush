// File: cart.js

async function loadAllProducts() {
  let products = JSON.parse(localStorage.getItem("allProducts"));
  if (!products) {
    const response = await fetch("./data/products.json");
    products = await response.json();
    localStorage.setItem("allProducts", JSON.stringify(products));
  }
  return products;
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function getCartQuantities() {
  return JSON.parse(localStorage.getItem("cartQuantities")) || {};
}

function saveCartQuantities(quantities) {
  localStorage.setItem("cartQuantities", JSON.stringify(quantities));
}

function updateHeaderCounts() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cart = getCart();
  document.getElementById("wishlistCount").textContent = wishlist.length;
  document.getElementById("cartCount").textContent = cart.length;
}

function updateOrderSummary(products) {
  const cartQuantities = getCartQuantities();

  const subtotal = products.reduce((sum, product) => {
    const qty = cartQuantities[product.id] || 1;
    return sum + product.price * qty;
  }, 0);

  const discount = products.reduce((sum, product) => {
    const qty = cartQuantities[product.id] || 1;
    return sum + (product.originalPrice - product.price) * qty;
  }, 0);

  const total = subtotal - discount;

  document.getElementById("orderSummary").innerHTML = `
    <ul class="space-y-3">
      <li class="flex items-center justify-between font-medium">
        <span>Subtotal</span><span>$${subtotal.toFixed(2)}</span>
      </li>
      <li class="flex items-center justify-between">
        <span>Discount</span><span>$${discount.toFixed(2)}</span>
      </li>
      <li class="flex items-center justify-between">
        <span>Shipping & Handling</span><span class="text-success">FREE</span>
      </li>
      <li><hr class="border-b border-border" /></li>
      <li class="flex items-center justify-between font-medium text-lg">
        <span>Total</span><span>$${total.toFixed(2)}</span>
      </li>
    </ul>
    <button type="button" id="checkoutBtn" class="px-8 py-3 rounded-full text-xl font-medium transition bg-black text-white hover:bg-black/70 hover:text-white w-full">
      Proceed to Checkout
    </button>
  `;

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

function renderCartItems(products) {
  const container = document.getElementById("cartContainer");
  const cartSelections =
    JSON.parse(localStorage.getItem("cartSelections")) || {};

  if (products.length === 0) {
    container.innerHTML = `<p class="text-muted">No products found in your cart.</p>`;
    document.getElementById("orderSummary").innerHTML = "";
    return;
  }

  container.innerHTML = products
    .map((product) => {
      const selection = cartSelections[product.id] || {
        color: "Default",
        size: "Default",
      };
      const quantity = getCartQuantities()[product.id] || 1;

      return `
      <div class="flex gap-4 py-4 border-b border-border">
        <div class="bg-surface2 p-3 size-28 rounded-sm">
          <img alt="${
            product.title
          }" class="w-full h-full object-contain" src="${product.image}" />
        </div>
        <div class="w-full flex gap-4 justify-between">
          <div class="space-y-1 w-full">
            <p class="font-semibold font-heading">${product.title}</p>
            <p class="text-sm">Quantity: ${quantity}</p>
            <div class="flex gap-2">
              <p class="text-sm"><span class="font-medium">Color:</span> <span>${
                selection.color
              }</span></p>
              <p class="text-sm"><span class="font-medium">Size:</span> <span>${
                selection.size
              }</span></p>
            </div>
            <p class="font-semibold font-heading">$${product.price.toFixed(
              2
            )}</p>
          </div>
          <div class="flex flex-col justify-between items-end">
            <button class="text-muted hover:text-accent remove-cart" data-id="${
              product.id
            }">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <div class="flex items-center gap-3 px-3 py-2 border-2 border-border rounded-full font-medium text-accent quantity-control" data-id="${
              product.id
            }">
              <button class="decrement"><i class="fa-solid fa-minus"></i></button>
              <span class="quantity-value">${quantity}</span>
              <button class="increment"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  setupQuantityControls();
  setupRemoveCartButtons();
}

function setupQuantityControls() {
  const cartQuantities = getCartQuantities();

  document.querySelectorAll(".quantity-control").forEach((control) => {
    const id = control.dataset.id;
    const quantitySpan = control.querySelector(".quantity-value");
    const decrementBtn = control.querySelector(".decrement");
    const incrementBtn = control.querySelector(".increment");

    decrementBtn.addEventListener("click", () => {
      let qty = cartQuantities[id] || 1;
      if (qty > 1) {
        qty--;
        cartQuantities[id] = qty;
        quantitySpan.textContent = qty;
        saveCartQuantities(cartQuantities);
        refreshCartData();
      }
    });

    incrementBtn.addEventListener("click", () => {
      let qty = cartQuantities[id] || 1;
      qty++;
      cartQuantities[id] = qty;
      quantitySpan.textContent = qty;
      saveCartQuantities(cartQuantities);
      refreshCartData();
    });
  });
}

// function setupRemoveCartButtons() {
//   document.querySelectorAll('.remove-cart').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const id = btn.dataset.id;
//       let cart = getCart().filter(itemId => itemId !== id);
//       let quantities = getCartQuantities();
//       delete quantities[id];
//       localStorage.setItem('cart', JSON.stringify(cart));
//       saveCartQuantities(quantities);
//       refreshCartData();
//     });
//   });
// }

function setupRemoveCartButtons() {
  document.querySelectorAll(".remove-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let cart = getCart().filter((itemId) => itemId !== id);
      let quantities = getCartQuantities();
      let selections = JSON.parse(localStorage.getItem("cartSelections")) || {};

      delete quantities[id];
      delete selections[id];

      localStorage.setItem("cart", JSON.stringify(cart));
      saveCartQuantities(quantities);
      localStorage.setItem("cartSelections", JSON.stringify(selections));

      refreshCartData();
    });
  });
}

function refreshCartData() {
  loadAllProducts().then((allProducts) => {
    const cart = getCart();
    const cartProducts = allProducts.filter((p) =>
      cart.includes(p.id.toString())
    );
    renderCartItems(cartProducts);
    updateOrderSummary(cartProducts);
    updateHeaderCounts();
  });
}

// Initial Load
loadAllProducts().then((allProducts) => {
  const cart = getCart();
  const cartProducts = allProducts.filter((p) =>
    cart.includes(p.id.toString())
  );
  renderCartItems(cartProducts);
  updateOrderSummary(cartProducts);
  updateHeaderCounts();
});
