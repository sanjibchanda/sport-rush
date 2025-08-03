import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import $ from "jquery";
import "slick-carousel";
import { toggleMenu } from "./utils.js";
import { renderProducts, updateHeaderCounts } from "./products.js";
import { applyFilters, setupFilterUI } from "./filters.js";

let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((products) => {
      allProducts = products;
      localStorage.setItem("allProducts", JSON.stringify(allProducts));

      // Render Main Product Grid (default)
      renderProducts(allProducts, ".productContainer");

      // Static Sections Rendering
      renderProducts(allProducts.slice(0, 4), ".bestSellerContainer");
      renderProducts(allProducts, ".newArrivalContainer");
      renderProducts(allProducts, ".featuredContainer");

      updateHeaderCounts();
      setupFilterUI(allProducts, onFilterChange);
    });

  // Event listeners for menu toggle
  document
    .querySelectorAll('[aria-label="Toggle Menu"]')
    .forEach((button) => button.addEventListener("click", toggleMenu));
  document
    .querySelectorAll('[aria-label="Close Menu"]')
    .forEach((button) => button.addEventListener("click", toggleMenu));

  // Accordion setup
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.querySelector(".accordion-content");
      const icon = header.querySelector("i");

      content.classList.toggle("hidden");
      icon.classList.toggle("fa-angle-down");
      icon.classList.toggle("fa-angle-up");

      // Close others
      headers.forEach((otherHeader) => {
        if (otherHeader !== header) {
          otherHeader
            .querySelector(".accordion-content")
            .classList.add("hidden");
          const otherIcon = otherHeader.querySelector("i");
          otherIcon.classList.remove("fa-angle-up");
          otherIcon.classList.add("fa-angle-down");
        }
      });
    });
  });

  // Sliders Init
  $(".single-item").slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  $(".feedback-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  });

  $(".news-slider").slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});

function onFilterChange(filters) {
  const filteredProducts = applyFilters(allProducts, filters);
  renderProducts(filteredProducts, ".productContainer"); // Always render in main grid for filters
}

document.querySelectorAll(".navigate-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const url = btn.dataset.url; // Read data-url attribute
    window.location.href = url; // Navigate to the page
  });
});
