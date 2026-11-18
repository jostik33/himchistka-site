/* Меню, появление блоков при скролле, тень шапки и демо-форма.
   Перед запуском рекламы подключите реальный обработчик заявок. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Мобильное меню ---------- */

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Тень шапки при скролле ---------- */

  var header = document.querySelector("[data-header]");

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Появление блоков ---------- */

  var revealItems = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- Год в подвале ---------- */

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- Демо-отправка форм ---------- */

  document.querySelectorAll("[data-lead-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var status = form.querySelector("[data-form-status]");
      if (status) {
        status.textContent =
          "Спасибо! Это демо-форма: подключите обработчик, чтобы заявки приходили вам.";
      }

      form.reset();
    });
  });
})();
