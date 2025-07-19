// import "./lib/slick.js";
// Optionally import CSS
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

import $ from "jquery";
import "slick-carousel";
import { toggleMenu } from "./utils.js";
import { renderProducts } from "./products.js";

// Event listeners for menu toggle
document
  .querySelectorAll('[aria-label="Toggle Menu"]')
  .forEach((button) => button.addEventListener("click", toggleMenu));
document
  .querySelectorAll('[aria-label="Close Menu"]')
  .forEach((button) => button.addEventListener("click", toggleMenu));

// Render
renderProducts();

document.addEventListener("DOMContentLoaded", function () {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.querySelector(".accordion-content");
      const icon = header.querySelector("i");

      // Toggle current accordion
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
});

/*single slider*/
$(document).ready(function () {
  $(".single-item").slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });
});

/*feedback slider*/
$(document).ready(function () {
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
});

// news - slider;
$(document).ready(function () {
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
