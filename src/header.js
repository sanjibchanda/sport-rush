export function updateHeaderCounts() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const wishlistCount = document.getElementById("wishlistCount");
  const cartCount = document.getElementById("cartCount");

  if (wishlistCount) wishlistCount.textContent = wishlist.length;
  if (cartCount) cartCount.textContent = cart.length;
}

export function initHeaderEvents() {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuToggleBtn = document.querySelector(".fa-bars");
  const menuCloseBtn = document.querySelector(".fa-xmark");

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("translate-x-full");
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener("click", () => {
      mobileMenu.classList.add("translate-x-full");
    });
  }
}
