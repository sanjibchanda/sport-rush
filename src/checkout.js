import { updateHeaderCounts } from "./products.js";

updateHeaderCounts();

document.addEventListener("DOMContentLoaded", () => {
  const allProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartQuantities =
    JSON.parse(localStorage.getItem("cartQuantities")) || {};
  let appliedCoupon = null;

  function renderOrderSummary() {
    const orderSummaryContainer = document.querySelector("#orderSummary");
    const cartProducts = allProducts.filter((p) =>
      cart.includes(p.id.toString())
    );

    if (cartProducts.length === 0) {
      orderSummaryContainer.innerHTML = "<p>No products in cart.</p>";
      return;
    }

    let subtotal = 0;
    let discount = 0;

    const productListHTML = cartProducts
      .map((product) => {
        const qty = cartQuantities[product.id] || 1;
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
              <p class="text-sm text-muted">item: #${product.id}</p>
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

    let shippingCharge =
      document.querySelector('input[name="shipping"]:checked').value ===
      "ExpressShipping"
        ? 9
        : 0;

    let couponDiscount = 0;
    if (appliedCoupon === "SAVE10") {
      couponDiscount = 10;
    }

    let total = subtotal - discount - couponDiscount + shippingCharge;

    orderSummaryContainer.innerHTML = `
      <p class="font-heading font-semibold text-lg uppercase">Order Summary</p>
      <div>${productListHTML}</div>
      <ul class="space-y-3">
        <li class="flex items-center justify-between font-medium"><span>Subtotal</span><span>$${subtotal.toFixed(
          2
        )}</span></li>
        <li class="flex items-center justify-between"><span>Discount</span><span>$${discount.toFixed(
          2
        )}</span></li>
        <li class="flex items-center justify-between"><span>Coupon</span><span>$${couponDiscount.toFixed(
          2
        )}</span></li>
        <li class="flex items-center justify-between"><span>Shipping & Handling</span><span class="${
          shippingCharge === 0 ? "text-success" : ""
        }">${shippingCharge === 0 ? "FREE" : `$${shippingCharge}`}</span></li>
        <li><hr class="border-b border-border" /></li>
        <li class="flex items-center justify-between font-medium text-lg"><span>Total</span><span>$${total.toFixed(
          2
        )}</span></li>
      </ul>
      <div class="space-y-2">
        <div class="flex">
          <div class="w-full flex items-center gap-1 px-2 py-3 bg-white text-accent border border-gray-300 rounded-l-sm">
            <i class="fa-solid fa-receipt"></i>
            <input id="promoCodeInput" placeholder="Promo code" class="w-full focus-visible:outline-0" type="text" />
          </div>
          <button id="applyCouponBtn" class="bg-black text-white px-4 py-2 rounded-r-sm hover:bg-black/70 transition">Apply</button>
        </div>
      </div>
      <button type="button" id="continueToPayment" class="px-8 py-3 rounded-full text-xl font-medium transition bg-black text-white hover:bg-black/70 hover:text-white w-full">Continue to Payment</button>
      <div class="text-center space-y-2">
        <p class="font-semibold text-accent flex items-center justify-center gap-1"><i class="fa-solid fa-lock"></i><span>Secure Checkout - SSL Encrypted</span></p>
        <p class="text-muted text-sm">Ensure your financial and personal details are secure during every transaction.</p>
      </div>
    `;

    setupCouponApply();
    setupContinueToPayment();
  }

  function setupCouponApply() {
    document.getElementById("applyCouponBtn").addEventListener("click", () => {
      const promoCode = document.getElementById("promoCodeInput").value.trim();
      if (promoCode === "SAVE10") {
        appliedCoupon = "SAVE10";
        alert("Coupon Applied!");
      } else {
        appliedCoupon = null;
        alert("Invalid Coupon");
      }
      renderOrderSummary();
    });
  }

  function setupContinueToPayment() {
    document
      .getElementById("continueToPayment")
      .addEventListener("click", () => {
        // Simple Form Validation
        const requiredFields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "city",
          "state",
          "zipcode",
          "address",
        ];
        let isValid = true;

        requiredFields.forEach((id) => {
          const field = document.getElementById(id);
          if (!field.value.trim()) {
            field.classList.add("border-red-500");
            isValid = false;
          } else {
            field.classList.remove("border-red-500");
          }
        });

        if (!document.getElementById("termsAccepted").checked) {
          alert("You must accept the Terms and Conditions.");
          isValid = false;
        }

        if (isValid) {
          const selectedShipping = document.querySelector(
            'input[name="shipping"]:checked'
          ).value;
          const selectedPayment = document.querySelector(
            'input[name="payment"]:checked'
          ).value;

          const orderData = {
            customer: {
              firstName: document.getElementById("firstName").value.trim(),
              lastName: document.getElementById("lastName").value.trim(),
              email: document.getElementById("email").value.trim(),
              phone: document.getElementById("phone").value.trim(),
              city: document.getElementById("city").value.trim(),
              state: document.getElementById("state").value.trim(),
              zipcode: document.getElementById("zipcode").value.trim(),
              address: document.getElementById("address").value.trim(),
            },
            shippingMethod:
              selectedShipping === "ExpressShipping" ? "Express" : "Free",
            paymentMethod:
              selectedPayment === "Card" ? "Credit Card" : "Cash on Delivery",
            appliedCoupon: appliedCoupon,
            cartProducts: cart,
            cartQuantities: cartQuantities,
          };

          localStorage.setItem("orderData", JSON.stringify(orderData));

          window.location.href = "thankyou.html";
        }

        if (isValid) {
          alert("Order Placed Successfully!");
          window.location.href = "thankyou.html";
        } else {
          alert("Please fill all required fields.");
        }
      });
  }

  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", renderOrderSummary);
  });

  renderOrderSummary();
});
