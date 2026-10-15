/* ==========================================================
   LOWNEE · COMPORTAMIENTO
   Sin dependencias. Lee la configuración de js/config.js
   ========================================================== */
(function () {
  "use strict";

  var CFG = window.LOWNEE_CONFIG || {};
  var MSG = CFG.messages || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Aviso (toast) ---------- */
  var toast = $("#toast"), toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 4200);
  }

  /* ---------- WhatsApp ---------- */
  function waNumber() { return String(CFG.whatsappNumber || "").replace(/\D/g, ""); }
  function waUrl(text) {
    // https://wa.me/NUMERO_INTERNACIONAL?text=MENSAJE_CODIFICADO
    return "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(text);
  }
  function messageFor(el) {
    var kind = el.getAttribute("data-wa");
    if (kind === "personalizar") return MSG.personalizar || "";
    if (kind === "diseno") return MSG.diseno ? MSG.diseno(el.getAttribute("data-wa-name") || "", el.getAttribute("data-wa-detail") || "") : "";
    if (kind === "producto") {
      var a = el.getAttribute("data-material"), b = el.getAttribute("data-size"), c = el.getAttribute("data-price");
      return MSG.producto ? MSG.producto(a, b, c) : "";
    }
    return MSG.general || "";
  }
  function refreshWa(el) {
    if (!waNumber()) { el.setAttribute("href", "#"); el.removeAttribute("target"); return; }
    el.setAttribute("href", waUrl(messageFor(el)));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  }
  function refreshAllWa() { $$("[data-wa]").forEach(refreshWa); }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-wa]");
    if (t && !waNumber()) {
      e.preventDefault();
      showToast("Falta configurar el número de WhatsApp en js/config.js.");
      if (window.console) console.warn("[Lownee] Define whatsappNumber en js/config.js");
      return;
    }
    var s = e.target.closest("[data-social]");
    if (s) {
      var url = CFG[s.getAttribute("data-social") + "Url"];
      if (!url) {
        e.preventDefault();
        showToast("Falta configurar este enlace en js/config.js.");
      }
    }
  });

  /* ---------- Redes ---------- */
  $$("[data-social]").forEach(function (a) {
    var url = CFG[a.getAttribute("data-social") + "Url"];
    if (url) a.setAttribute("href", url); else a.removeAttribute("target");
  });

  /* ---------- Año ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Header: sombra, FAB, menú móvil ---------- */
  var header = $("#header"), fab = $("#fab"), burger = $("#burger"), nav = $("#nav");
  function onScroll() {
    var sc = window.scrollY || 0;
    header.classList.toggle("is-scrolled", sc > 12);
    var hero = $("#inicio");
    var limit = hero ? hero.offsetHeight * 0.6 : 500;
    fab.classList.toggle("is-visible", sc > limit);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("is-locked", open);
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 961px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });

  /* ---------- Scrollspy + indicador animado ---------- */
  var links = $$(".nav__list a"), indicator = $(".nav__indicator");
  var current = "inicio";
  function moveIndicator() {
    var active = links.filter(function (l) { return l.getAttribute("data-nav") === current; })[0];
    if (!active || !indicator) return;
    var list = active.parentElement.parentElement;
    var lr = list.getBoundingClientRect(), ar = active.getBoundingClientRect();
    indicator.style.width = (ar.width - 28) + "px";
    indicator.style.transform = "translateX(" + (ar.left - lr.left + 14) + "px)";
    indicator.classList.add("is-on");
  }
  function setActive(name) {
    current = name;
    links.forEach(function (l) {
      var on = l.getAttribute("data-nav") === name;
      l.classList.toggle("is-active", on);
      if (on) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current");
    });
    moveIndicator();
  }
  var groups = $$("[data-nav-group]");
  function spy() {
    var line = window.innerHeight * 0.35, found = "inicio";
    groups.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) found = s.getAttribute("data-nav-group");
    });
    if (found !== current) setActive(found);
  }
  window.addEventListener("scroll", spy, { passive: true });
  window.addEventListener("resize", moveIndicator);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveIndicator);
  setActive("inicio"); spy();

  /* ---------- Aparición al desplazarse ---------- */
  var reveals = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) {
      var sibs = el.parentElement ? $$(":scope > [data-reveal]", el.parentElement) : [];
      var i = sibs.indexOf(el);
      if (i > 0) el.style.setProperty("--stagger", Math.min(i, 4) * 90 + "ms");
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Parallax ligero del hero (solo puntero fino) ---------- */
  var art = $("#heroArt");
  if (art && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var raf = null;
    art.addEventListener("pointermove", function (e) {
      var r = art.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var yy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        art.style.setProperty("--mx", x.toFixed(3));
        art.style.setProperty("--my", yy.toFixed(3));
      });
    });
    art.addEventListener("pointerleave", function () {
      art.style.setProperty("--mx", 0); art.style.setProperty("--my", 0);
    });
  }

  /* ---------- Selector de medidas MDF ---------- */
  var mdf = $("#prod-mdf");
  if (mdf) {
    var frame = $("#frameMdf"), tag = $("#tagMdf"), sel = $("#selMdf"), btn = $("#btnMdf");
    function updateMdf() {
      var inp = $('input[name="mdf"]:checked', mdf);
      if (!inp) return;
      frame.style.setProperty("--w", inp.getAttribute("data-w"));
      frame.style.setProperty("--h", inp.getAttribute("data-h"));
      tag.textContent = inp.value;
      sel.textContent = inp.value + " · " + inp.getAttribute("data-price");
      btn.setAttribute("data-material", mdf.getAttribute("data-material"));
      btn.setAttribute("data-size", inp.value);
      btn.setAttribute("data-price", inp.getAttribute("data-price"));
      refreshWa(btn);
    }
    $$('input[name="mdf"]', mdf).forEach(function (i) { i.addEventListener("change", updateMdf); });
    updateMdf();
  }

  /* ---------- FAQ (acordeón) ---------- */
  $$(".faq__item").forEach(function (item) {
    var q = $(".faq__q", item), a = $(".faq__a", item);
    q.addEventListener("click", function () {
      var open = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("is-open", !open);
      if (open) a.setAttribute("inert", ""); else a.removeAttribute("inert");
    });
  });

  /* ---------- Modal "Ver detalles" ---------- */
  var modal = $("#modal");
  if (modal && typeof modal.showModal === "function") {
    var mImg = $("#modalImg"), mTitle = $("#modalTitle"), mDesc = $("#modalDesc"), mWa = $("#modalWa"), mList = $("#modalList");
    function li(html) { var e = document.createElement("li"); e.innerHTML = html; return e; }
    $$("[data-detail]").forEach(function (b) {
      b.addEventListener("click", function () {
        var card = b.closest(".card");
        var mat = card.getAttribute("data-material"), size = card.getAttribute("data-size"), price = card.getAttribute("data-price");
        mImg.src = card.getAttribute("data-img");
        mImg.width = card.getAttribute("data-w"); mImg.height = card.getAttribute("data-h");
        mImg.alt = card.getAttribute("data-title");
        mTitle.textContent = card.getAttribute("data-title");
        mDesc.textContent = card.getAttribute("data-desc");
        mList.textContent = "";
        if (mat && size && price) {
          mList.appendChild(li("<strong>Material:</strong> " + mat + "."));
          mList.appendChild(li("<strong>Medida:</strong> " + size + "."));
          mList.appendChild(li("<strong>Precio:</strong> " + price + "."));
          mWa.setAttribute("data-wa-detail", mat + ", " + size + ", " + price);
        } else {
          mList.appendChild(li("<strong>MDF + vinilo adhesivo:</strong> 20 × 30, 30 × 40, 40 × 60 y 50 × 70 cm."));
          mList.appendChild(li("<strong>Poliestireno + vinilo adhesivo:</strong> 20 × 20 cm."));
          mList.appendChild(li("Disponibilidad de este diseño y precio final: se confirman por WhatsApp."));
          mWa.removeAttribute("data-wa-detail");
        }
        mWa.setAttribute("data-wa-name", card.getAttribute("data-title"));
        refreshWa(mWa);
        modal.showModal();
      });
    });
    function closeModal() { modal.close(); }
    $("#modalX").addEventListener("click", closeModal);
    $("#modalPrices").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  } else {
    $$("[data-detail]").forEach(function (b) { b.hidden = true; });
  }

  refreshAllWa();
})();
