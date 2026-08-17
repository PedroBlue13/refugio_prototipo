/* ============================================================
   REFÚGIO BARBER — comportamento da página
   Sem dependências. Tudo degrada bem: se este arquivo não
   carregar, o site continua legível, navegável e agendável.
   ============================================================ */
(function () {
  "use strict";

  /* ── ponto único de verdade do agendamento ───────────────── */
  const BOOKING_URL =
    "https://sites.appbarber.com.br/refugiobarbearc-dvas?service=1281308&employee=27419782&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaffGb9dE6893ZQ_sh4Te4q2iMYJodb_MzeCq7g02xXq2ptiTLrUNn1JylzZjw_aem_cPV9B8HXw7BL1TCbA5Ta6Q";

  document.querySelectorAll("[data-book]").forEach((el) => {
    el.href = BOOKING_URL;
  });

  /* ── preferências e helpers ──────────────────────────────── */
  const root = document.documentElement;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  /* O atributo data-motion já foi resolvido no <head>; ele é a fonte
     de verdade, para que a escolha manual vença a do sistema. */
  const reduced = () => root.getAttribute("data-motion") === "reduced";
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* quem precisa reagir quando o modo de movimento muda */
  const motionListeners = [];

  /* Um único listener de scroll alimenta tudo que depende de scroll. */
  const scrollTasks = [];
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      for (const task of scrollTasks) task();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ============================================================
     1. Header: fundo, blur e altura após sair do topo
     ============================================================ */
  const header = $("[data-header]");
  if (header) {
    scrollTasks.push(() => {
      header.classList.toggle("is-stuck", window.scrollY > 40);
    });
  }

  /* ============================================================
     2. Barra de progresso do scroll
     ============================================================ */
  const progress = $("[data-progress]");
  if (progress) {
    scrollTasks.push(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.transform = "scaleX(" + pct + ")";
    });
  }

  /* ============================================================
     3. Reveals no scroll
        Um observer serve reveals, máscaras, linhas e a pincelada.
        Cada elemento anima uma vez só.
     ============================================================ */
  const revealTargets = [
    ...$$("[data-reveal]"),
    ...$$(".mask"),
    ...$$("[data-rule]"),
    ...$$(".hero__brush"),
  ];

  // o atraso vira custom property para o CSS escalonar a entrada
  $$("[data-reveal]").forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });

  let pending = revealTargets.slice();

  /* Rede de segurança.
     O observer dá o tempo bonito da entrada, mas não pode ser a única
     garantia: scroll muito rápido, aba em segundo plano, salto por
     âncora ou restauração de posição podem fazê-lo perder elementos —
     e um bloco preso em opacity:0 é a pior falha possível aqui.
     Esta varredura roda no mesmo listener de scroll já existente e a
     lista encolhe a cada revelação, então o custo tende a zero. */
  function sweep() {
    if (!pending.length) return;
    const limit = window.innerHeight * 0.92;
    pending = pending.filter((el) => {
      if (el.classList.contains("is-in")) return false;
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add("is-in");
        return false;
      }
      return true;
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* A varredura NÃO entra na fila de scrollTasks de propósito: aquela
     fila é limitada por requestAnimationFrame, que pode não disparar
     (aba em segundo plano, economia de energia) — justamente quando o
     observer também falha. Aqui o limitador é o relógio, não o frame. */
  let lastSweep = 0;
  function sweepThrottled() {
    const now = Date.now();
    if (now - lastSweep < 100) return;
    lastSweep = now;
    sweep();
  }
  window.addEventListener("scroll", sweepThrottled, { passive: true });
  window.addEventListener("resize", sweepThrottled, { passive: true });
  window.addEventListener("load", sweep);
  sweep();

  /* ============================================================
     4. Clube Refúgio: sequência de entrada + contadores
     ============================================================ */
  $$("[data-club-step]").forEach((el) => {
    el.style.setProperty("--step", el.getAttribute("data-club-step"));
  });

  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-count-suffix") || "";
    if (!Number.isFinite(target)) return;

    if (reduced()) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();
    // easeOutExpo: acelera rápido e assenta com calma no número final
    const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * ease(t)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const club = $("[data-club]");
  if (club) {
    let clubStarted = false;

    function startClub() {
      if (clubStarted) return;
      clubStarted = true;
      club.classList.add("is-in");
      // o preço entra junto com o passo 3; a economia, com o passo 10
      setTimeout(() => $$("[data-count]", club).forEach(animateCount), 380);
    }

    if ("IntersectionObserver" in window) {
      const clubObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            startClub();
            obs.disconnect();
          });
        },
        { threshold: 0.15 }
      );
      clubObserver.observe(club);

      // mesma rede de segurança dos reveals, também livre de rAF
      const clubGuard = () => {
        if (clubStarted) return;
        if (club.getBoundingClientRect().top < window.innerHeight * 0.9) startClub();
      };
      window.addEventListener("scroll", clubGuard, { passive: true });
      window.addEventListener("load", clubGuard);
    } else {
      startClub();
    }
  }

  /* ============================================================
     5. Seção ativa no menu
        A seção que cruza o meio da tela marca o link.
     ============================================================ */
  const navLinks = $$(".nav__list a");
  if (navLinks.length && "IntersectionObserver" in window) {
    const linkFor = new Map();
    navLinks.forEach((a) => {
      const id = a.getAttribute("href");
      const section = id && id.startsWith("#") ? $(id) : null;
      if (section) linkFor.set(section, a);
    });

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = linkFor.get(entry.target);
          if (!link) return;
          navLinks.forEach((a) => a.classList.remove("is-active"));
          link.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    linkFor.forEach((_link, section) => activeObserver.observe(section));
  }

  /* ============================================================
     6. Menu mobile: abrir, fechar, Esc, foco preso
     ============================================================ */
  const menu = $("[data-menu]");
  const menuToggle = $("[data-menu-toggle]");

  if (menu && menuToggle) {
    const label = $(".sr-only", menuToggle);
    let closeTimer = null;

    const focusables = () =>
      [menuToggle, ...$$("a[href], button:not([disabled])", menu)].filter(
        (el) => el.offsetParent !== null || el === menuToggle
      );

    function openMenu() {
      clearTimeout(closeTimer);
      menu.hidden = false;
      document.body.classList.add("is-locked");
      menuToggle.setAttribute("aria-expanded", "true");
      if (label) label.textContent = "Fechar menu";
      // um frame para o browser registrar o estado inicial antes da transição
      requestAnimationFrame(() => menu.classList.add("is-open"));
      const first = $(".menu__list a", menu);
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 60);
    }

    function closeMenu(returnFocus) {
      menu.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      menuToggle.setAttribute("aria-expanded", "false");
      if (label) label.textContent = "Abrir menu";
      closeTimer = setTimeout(() => {
        menu.hidden = true;
      }, reduced() ? 0 : 350);
      if (returnFocus) menuToggle.focus({ preventScroll: true });
    }

    const isOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.addEventListener("click", () => {
      isOpen() ? closeMenu(false) : openMenu();
    });

    // navegar fecha o menu; o scroll suave do browser cuida do resto
    $$("a[href^='#']", menu).forEach((a) => {
      a.addEventListener("click", () => closeMenu(false));
    });

    document.addEventListener("keydown", (e) => {
      if (!isOpen()) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu(true);
        return;
      }

      if (e.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // voltar ao desktop com o menu aberto não pode travar a página
    window.addEventListener("resize", () => {
      if (isOpen() && window.innerWidth > 1100) closeMenu(false);
    });
  }

  /* ============================================================
     7. FAQ em accordion
     ============================================================ */
  $$(".acc__btn").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";

      if (open) {
        btn.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        const hide = () => {
          if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true;
        };
        if (reduced()) hide();
        else panel.addEventListener("transitionend", hide, { once: true });
      } else {
        btn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add("is-open"));
      }
    });
  });

  /* ============================================================
     8. Parallax leve
        Só no desktop e só em duas imagens — o suficiente para dar
        profundidade sem transformar a página em um carrossel.
     ============================================================ */
  const parallaxItems = $$("[data-parallax]");
  if (parallaxItems.length) {
    let parallaxOn = false;

    function updateParallax() {
      if (!parallaxOn) return;
      const vh = window.innerHeight;
      parallaxItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const amount = parseFloat(el.getAttribute("data-parallax")) || 0;
        // -1 (abaixo da tela) → 1 (acima da tela)
        const p = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.transform =
          "translate3d(0," + (p * amount).toFixed(2) + "px,0)";
      });
    }

    function syncParallax() {
      const shouldRun = window.innerWidth >= 960 && !reduced();
      if (shouldRun === parallaxOn) return;
      parallaxOn = shouldRun;
      if (shouldRun) {
        parallaxItems.forEach((el) => (el.style.willChange = "transform"));
        updateParallax();
      } else {
        parallaxItems.forEach((el) => {
          el.style.transform = "";
          el.style.willChange = "";
        });
      }
    }

    scrollTasks.push(updateParallax);
    window.addEventListener("resize", syncParallax);
    motionListeners.push(syncParallax);
    syncParallax();
  }

  /* ============================================================
     9. Botão flutuante some sobre o CTA final
        Dois "agendar" na mesma dobra competem entre si.
     ============================================================ */
  const dock = $("[data-dock]");
  const finalCta = $("[data-final]");
  if (dock && finalCta && "IntersectionObserver" in window) {
    const dockObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          dock.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );
    dockObserver.observe(finalCta);
  }

  /* ============================================================
     10. Controle de movimento
         O sistema define o padrão; aqui o visitante pode discordar.
         Sem isso, quem tem "efeitos de animação" desligados no
         Windows nunca veria o site em movimento — nem o dono.
     ============================================================ */
  const motionBtn = $("[data-motion-toggle]");

  /* persist=false na carga: só espelhar o estado no botão. Gravar aqui
     salvaria uma escolha que o visitante nunca fez, e o site pararia
     de acompanhar a preferência do sistema. */
  function applyMotion(mode, persist) {
    root.setAttribute("data-motion", mode);
    if (persist) {
      try {
        localStorage.setItem("refugio-motion", mode);
      } catch (e) {
        /* modo privado ou file:// restrito: vale só nesta sessão */
      }
    }
    if (motionBtn) {
      const full = mode === "full";
      motionBtn.setAttribute("aria-pressed", String(full));
      const label = $("[data-motion-label]", motionBtn);
      if (label) label.textContent = full ? "Animações ativas" : "Animações reduzidas";
    }
    motionListeners.forEach((fn) => fn());
  }

  if (motionBtn) {
    applyMotion(root.getAttribute("data-motion") || "full", false);
    motionBtn.addEventListener("click", () => {
      applyMotion(reduced() ? "full" : "reduced", true);
    });
  }

  // se o visitante nunca escolheu, mudanças no sistema continuam valendo
  motionQuery.addEventListener?.("change", (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem("refugio-motion");
    } catch (err) {}
    if (!saved) applyMotion(e.matches ? "reduced" : "full", false);
  });

  /* ============================================================
     11. Ano do rodapé
     ============================================================ */
  const year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // primeiro cálculo, para quem chega com a página já rolada
  onScroll();
})();
