document.addEventListener("DOMContentLoaded", () => {
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  const orderData = JSON.parse(localStorage.getItem("orderData"));

  if (!orderData) {
    alert("No order data found!");
    window.location.href = "index.html";
    return;
  }

  // Order Number
  document.getElementById("orderNumber").textContent =
    "#ORD" + Math.floor(100000 + Math.random() * 900000);

  // Populate Customer Info
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
    " " +
    orderData.customer.zipcode;

  // Shipping & Payment
  document.getElementById("deliveryService").textContent =
    orderData.shippingMethod;
  document.getElementById("paymentMethod").textContent =
    orderData.paymentMethod;

  // Cart Products
  const cartProducts = allProducts.filter((p) =>
    orderData.cartProducts.includes(p.id.toString())
  );

  let subtotal = 0;
  let discount = 0;
  let couponDiscount = orderData.appliedCoupon === "SAVE10" ? 10 : 0;
  let shippingCharge = orderData.shippingMethod === "Express" ? 9 : 0;

  const productsHTML = cartProducts
    .map((product) => {
      const qty = orderData.cartQuantities[product.id] || 1;
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
              <p class="text-sm"><span class="font-medium">Color:</span> Black</p>
              <p class="text-sm"><span class="font-medium">Size:</span> 6</p>
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

  document.getElementById("thankyouProducts").innerHTML = productsHTML;

  const total = subtotal - discount - couponDiscount + shippingCharge;

  // Order Summary
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("discount").textContent = `$${discount.toFixed(2)}`;
  document.getElementById("coupon").textContent = `$${couponDiscount.toFixed(
    2
  )}`;
  document.getElementById("shipping").textContent =
    shippingCharge === 0 ? "FREE" : `$${shippingCharge}`;
  document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
});
