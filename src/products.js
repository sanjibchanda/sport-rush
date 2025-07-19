export async function renderProducts() {
  const container = document.getElementById("products");
  const container2 = document.getElementById("products2");

  try {
    const response = await fetch("../data/products.json");
    const products = await response.json();

    products.forEach((product) => {
      const productHTML = `
        <div class="bg-surface p-4 space-y-4 rounded-sm">
          <div class="relative">
            <span class="inline-block bg-primary text-white px-2 py-1 rounded-sm text-xs absolute top-0 left-0 z-1">
              ${product.tag}
            </span>
            <span class="absolute top-0 right-0 z-1 cursor-pointer text-xl">
              <i class="fa-regular fa-heart"></i>
            </span>
            <a class="block w-full mx-auto relative group overflow-hidden" href="/" data-discover="true">
              <img alt="${product.title}" src="${product.img}" 
                class="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-110" />
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
              <span class="text-sm font-medium text-muted line-through">$${product.oldPrice.toFixed(
                2
              )}</span>
              <span class="text-xs font-medium text-muted bg-white px-2 py-0.5 rounded-full">${
                product.discount
              }</span>
              <button type="button" class="flex items-center gap-1 bg-white hover:bg-primary p-2 rounded-sm ml-auto">
                <img src="images/shopping-cart-outlined.svg" alt="shopping-cart-outlined" class="w-5">
              </button>
            </div>
          </div>
        </div>
      `;

      // Append one instance to each container
      container.insertAdjacentHTML("beforeend", productHTML);
      container2.insertAdjacentHTML("beforeend", productHTML);
    });
  } catch (error) {
    console.error("Error loading feature products:", error);
  }
}
