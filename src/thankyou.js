document.addEventListener("DOMContentLoaded", () => {
  const orderData = JSON.parse(localStorage.getItem("orderData")) || {};
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  const cartQuantities =
    JSON.parse(localStorage.getItem("cartQuantities")) || {};
  const cartSelections =
    JSON.parse(localStorage.getItem("cartSelections")) || {};

  // Generate Order Number
  document.getElementById("orderNumber").textContent =
    "#ORD" + Math.floor(100000 + Math.random() * 900000);

  // Render Product Items
  const productsContainer = document.getElementById("thankyouProductList");
  let subtotal = 0;
  let discount = 0;

  const productListHTML = orderData.cartProducts
    .map((id) => {
      const product = allProducts.find((p) => p.id.toString() === id);
      if (!product) return "";

      const qty = cartQuantities[id] || 1;
      const selection = cartSelections[id] || { color: "N/A", size: "N/A" };

      subtotal += product.price * qty;
      discount += (product.originalPrice - product.price) * qty;

      return `
        <div class="flex gap-4 py-4 border-b border-border">
          <div class="bg-white p-2 size-20 rounded-sm relative">
            <img alt="${
              product.title
            }" class="w-full h-full object-contain" src="${product.image}" />
            <span class="absolute -top-2 -right-2 bg-gray-400 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">${qty}</span>
          </div>
          <div class="w-full flex gap-4 justify-between">
            <div class="space-y-1 w-full">
              <p class="font-semibold font-heading">${product.title}</p>
              <p class="text-sm"><span class="font-medium">Color:</span> ${
                selection.color
              }</p>
              <p class="text-sm"><span class="font-medium">Size:</span> ${
                selection.size
              }</p>
            </div>
            <div class="flex flex-col justify-between items-end">
              <p class="font-semibold font-heading">$${product.price.toFixed(
                2
              )}</p>
            </div>
          </div>
        </div>`;
    })
    .join("");

  productsContainer.innerHTML = productListHTML;

  // Fill Order Details
  document.getElementById("orderDate").textContent =
    new Date().toLocaleDateString();
  document.getElementById("deliveryMethod").textContent =
    orderData.shippingMethod;
  document.getElementById("paymentMethod").textContent =
    orderData.paymentMethod;
  document.getElementById("customerName").textContent =
    orderData.customer.firstName + " " + orderData.customer.lastName;
  document.getElementById("customerEmail").textContent =
    orderData.customer.email;
  document.getElementById("customerPhone").textContent =
    orderData.customer.phone;
  document.getElementById("customerAddress").textContent =
    orderData.customer.address +
    ", " +
    orderData.customer.city +
    ", " +
    orderData.customer.state +
    " - " +
    orderData.customer.zipcode;

  // Calculate Summary
  const shippingCharge = orderData.shippingMethod === "Express" ? 9 : 0;
  const couponDiscount = orderData.appliedCoupon === "SAVE10" ? 10 : 0;
  const total = subtotal - discount - couponDiscount + shippingCharge;

  document.getElementById("summarySubtotal").textContent = `$${subtotal.toFixed(
    2
  )}`;
  document.getElementById("summaryDiscount").textContent = `$${discount.toFixed(
    2
  )}`;
  document.getElementById(
    "summaryCoupon"
  ).textContent = `$${couponDiscount.toFixed(2)}`;
  document.getElementById("summaryShipping").textContent =
    shippingCharge === 0 ? "FREE" : `$${shippingCharge.toFixed(2)}`;
  document.getElementById("summaryTotal").textContent = `$${total.toFixed(2)}`;
});
