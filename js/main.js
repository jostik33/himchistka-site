/* Мобильное меню, год в подвале и демо-отправка формы.
   Подключите реальный обработчик формы перед запуском рекламы. */

(function () {
  "use strict";

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

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

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
