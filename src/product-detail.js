import { updateHeaderCounts } from './products.js';

async function loadAllProducts() {
  let products = JSON.parse(localStorage.getItem('allProducts'));
  if (!products) {
    const response = await fetch('../data/products.json');
    products = await response.json();
    localStorage.setItem('allProducts', JSON.stringify(products));
  }
  return products;
}

async function renderProductDetail() {
  const allProducts = await loadAllProducts();
  const selectedId = localStorage.getItem('selectedProductId');
  const product = allProducts.find(p => p.id.toString() === selectedId);

  const container = document.getElementById('productDetailContainer');

  if (!product) {
    container.innerHTML = '<p>Product not found.</p>';
    return;
  }

  const colorsHTML = product.colors.map((color, idx) => `
    <div class="relative">
      <input id="color-${idx}" class="hidden peer" type="radio" value="${color}" name="color" ${idx === 0 ? 'checked' : ''} />
      <label for="color-${idx}" class="border rounded-sm px-2 py-1 border-border cursor-pointer peer-checked:bg-black peer-checked:text-white"">
        <span class="text-sm">${color}</span>
      </label>
    </div>
  `).join('');

  const sizesHTML = product.sizes.map((size, idx) => `
    <div class="relative">
      <input id="size-${idx}" class="hidden peer" type="radio" value="${size}" name="size" ${idx === 0 ? 'checked' : ''} />
      <label for="size-${idx}" class="cursor-pointer border rounded-sm px-3 py-1 border-border peer-checked:bg-black peer-checked:text-white"">
        <span class="text-sm">${size}</span>
      </label>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row gap-12">
      <div class="sm:w-1/2">
        <div class="w-full mx-auto">
          <img alt="${product.title}" src="${product.image}" />
        </div>
      </div>
      <div class="sm:w-1/2 space-y-4">
        <div class="uppercase font-medium flex items-center text-accent gap-1">${product.category}</div>
        <h3 class="font-heading font-semibold text-accent">${product.title}</h3>
        <div class="flex items-center gap-2">
          <span class="flex items-center gap-1">
            <i class="fa-solid fa-star text-amber-300"></i>
            <span class="font-medium">${product.rating} Ratings</span>
          </span>
          <i class="fa-solid fa-circle text-[8px] text-muted"></i>
          <span class="text-muted">(${product.reviews} reviews)</span>
          <i class="fa-solid fa-circle text-[8px] text-muted"></i>
          <span class="text-green-500">${product.stock}+ Sold</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-heading font-semibold text-3xl">$${product.price.toFixed(2)}</span>
          <span class="line-through text-muted">$${product.originalPrice.toFixed(2)}</span>
          <span class="bg-green-100 text-green-700 px-2 border border-green-200 py-1 text-xs rounded-full">${product.discount}</span>
        </div>
        <div class="space-y-1">
          <span class="block font-medium">Color:</span>
          <div class="flex items-center gap-2">${colorsHTML}</div>
        </div>
        <div class="flex justify-between">
          <div class="space-y-1">
            <span class="block font-medium">Size:</span>
            <div class="flex items-center gap-2">${sizesHTML}</div>
          </div>
          <div class="flex items-center gap-1">
            <img src="images/ruler.svg" alt="ruler" />
            <span class="text-muted text-sm underline">Size Guide</span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <div class="space-y-1">
            <span class="block font-medium">Quantity:</span>
            <div class="flex items-center gap-3 font-medium text-accent">
              <button class="border rounded-sm px-2 py-1 border-border" id="decrementQty">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="quantity-value">1</span>
              <button class="border rounded-sm px-2 py-1 border-border" id="incrementQty">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-1 text-muted text-sm">
            Stock Available: <span class="text-accent font-medium">${product.stock}</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button type="button" id="checkoutBtn" class="px-4 py-3 rounded text-lg transition bg-black text-white hover:bg-black/70 hover:text-white w-full">
            Proceed to Checkout <i class="fa-solid fa-angle-right ml-2"></i>
          </button>
          <button id="addToCart" data-id="${product.id}" class="bg-gray-200 text-black px-4 py-3 sm:text-xl rounded inline-block cursor-pointer">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
          <span class="bg-gray-200 text-black px-4 py-3 sm:text-xl rounded inline-block cursor-pointer">
            <i class="fa-regular fa-heart"></i>
          </span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

  

  // Quantity Increment/Decrement Logic
  let quantity = 1;

  document.getElementById('incrementQty').addEventListener('click', () => {
    quantity++;
    document.querySelector('.quantity-value').textContent = quantity;
  });

  document.getElementById('decrementQty').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      document.querySelector('.quantity-value').textContent = quantity;
    }
  });

  // document.getElementById('addToCart').addEventListener('click', () => {
  //   let cart = JSON.parse(localStorage.getItem('cart')) || [];
  //   if (!cart.includes(product.id.toString())) {
  //     cart.push(product.id.toString());
  //     localStorage.setItem('cart', JSON.stringify(cart));
  //     alert('Product added to Cart!');
  //   }
  // });

  document.getElementById('addToCart').addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartQuantities = JSON.parse(localStorage.getItem('cartQuantities')) || {};
    let cartSelections = JSON.parse(localStorage.getItem('cartSelections')) || {};

    const productId = product.id.toString();
    const selectedQuantity = parseInt(document.querySelector('.quantity-value').textContent);
    const selectedColor = document.querySelector('input[name="color"]:checked').nextElementSibling.textContent.trim();
    const selectedSize = document.querySelector('input[name="size"]:checked').nextElementSibling.textContent.trim();

    if (!cart.includes(productId)) {
      cart.push(productId);
    }

    cartQuantities[productId] = selectedQuantity;
    cartSelections[productId] = { color: selectedColor, size: selectedSize };

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartQuantities', JSON.stringify(cartQuantities));
    localStorage.setItem('cartSelections', JSON.stringify(cartSelections));

    alert('Product added to Cart!');
    window.location.href = 'cart.html';
  });

}

renderProductDetail();
updateHeaderCounts();