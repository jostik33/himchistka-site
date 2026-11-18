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

  /* ---------- Индикатор прокрутки и параллакс ---------- */

  var docEl = document.documentElement;
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var heroBg = document.querySelector(".hero-bg");
  var heroLimit = 0;
  var progressMax = 1;

  var scrollOffset = function () {
    return window.pageYOffset || docEl.scrollTop || 0;
  };

  var paintProgress = function () {
    var ratio = progressMax > 0 ? scrollOffset() / progressMax : 0;

    progress.style.transform =
      "scaleX(" + Math.min(1, Math.max(0, ratio)).toFixed(4) + ")";
  };

  var paintParallax = function () {
    var offset = scrollOffset();

    if (offset <= heroLimit) {
      heroBg.style.transform = "translate3d(0, " + (offset * 0.18).toFixed(1) + "px, 0)";
    }
  };

  /* Высоты читаем только при изменении размера, чтобы не дёргать layout на скролле */

  var measure = function () {
    progressMax = docEl.scrollHeight - window.innerHeight;
    heroLimit = heroBg ? heroBg.parentElement.offsetHeight * 1.1 : 0;
    paintProgress();

    if (heroBg && !reduceMotion) paintParallax();
  };

  window.addEventListener(
    "scroll",
    function () {
      paintProgress();
      if (heroBg && !reduceMotion) paintParallax();
    },
    { passive: true }
  );

  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  measure();

  /* ---------- Переход между страницами без View Transitions ---------- */

  var hasViewTransitions =
    window.CSS && window.CSS.supports && window.CSS.supports("view-transition-name", "none");

  if (!hasViewTransitions && !reduceMotion) {
    var leaving = false;

    document.addEventListener("click", function (event) {
      if (leaving || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest ? event.target.closest("a[href]") : null;
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      var href = link.getAttribute("href");

      if (
        !href ||
        href.charAt(0) === "#" ||
        href.indexOf("tel:") === 0 ||
        href.indexOf("mailto:") === 0 ||
        href.indexOf("http") === 0 ||
        href.indexOf("//") === 0 ||
        link.host !== window.location.host
      ) {
        return;
      }

      leaving = true;
      document.documentElement.classList.add("is-leaving");

      window.setTimeout(function () {
        window.location.href = link.href;
      }, 160);
    });
  }

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
