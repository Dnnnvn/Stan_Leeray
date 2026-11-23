/* ==========================================================
   STAN LEERAY (@s.leeray) — CDMX, México
   Intro SVG (2.5s) · Carrusel · Feed Dividido · Marcos SVG · Correo
   ========================================================== */

/* ==========================================================================
   ⚙️ CONFIGURACIÓN — edita solo este bloque
   ========================================================================== */
const CONFIG = {
  // --- Contacto del Estudio -------------------------------------------------
  email: "contacto@stanleeray.com",   // Correo real del estudio de Stan Leeray
  instagram: "s.leeray",
  whatsapp: "5210000000000",          // Opcional (respaldo en panel admin si el cliente deja teléfono)

  // --- Panel privado (ESTUDIO // PIN) ---------------------------------------
  // ⚠️ El PIN vive en el código del navegador: sirve para ocultar el panel a
  // curiosos, NO es seguridad real. Para datos sensibles usa Supabase con
  // autenticación real y no expongas la tabla en modo lectura.
  adminPin: "1234",

  // --- Intro & Visor Protagonista -------------------------------------------
  preloaderMs: 2500,                  // duración de la intro SVG (00 — 100)
  carouselAutoMs: 4000,               // rotación automática de dibujos (~4s)

  // --- ENVÍO REAL DEL FORMULARIO (opcional) ---------------------------------
  // Mientras estén vacíos, el sistema abre el correo prellenado (mailto:) y
  // guarda copia en IndexedDB local. Activa Formspree o Supabase para respaldo remoto.
  formspreeUrl: "",
  supabase: {
    url: "",
    anonKey: "",
    table: "cotizaciones",
    bucket: "referencias"
  }
};

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad2 = n => String(n).padStart(2, "0");

  const GALLERY = window.GALLERY || [];
  const CATEGORIES = window.GALLERY_CATEGORIES || { piel: "Piel", grafica: "Dibujo" };
  const catLabel = key => CATEGORIES[key] || key;
  const imgAttrs = p => (p.w && p.h ? ` width="${p.w}" height="${p.h}"` : "");

  // Conserva número de archivo (FIG. 01 .. FIG. 27) para cada pieza
  const INDEXED = GALLERY.map((p, idx) => ({ ...p, fig: pad2(idx + 1), idx }));

  /* ==========================================================
     1. INTRO INGENIOSA CON TRAZOS SVG + CONTADOR 00 — 100 (2.5 s)
     ========================================================== */
  const preloader = $("#preloader");
  const preCount = $("#preCount");
  let siteReady = false;

  function finishPreloader() {
    if (!preloader || preloader.classList.contains("is-done")) return;
    if (preCount) preCount.textContent = "100";
    preloader.classList.add("is-done");
    document.body.classList.add("is-ready");
    if (!siteReady) {
      siteReady = true;
      initReveal();
      Carousel.start();
    }
    setTimeout(() => preloader.remove(), 1200);
  }

  (function initPreloader() {
    if (!preloader) {
      siteReady = true;
      document.body.classList.add("is-ready");
      queueMicrotask(() => { initReveal(); Carousel.start(); });
      return;
    }
    const minMs = prefersReduced ? 320 : CONFIG.preloaderMs;

    if (preCount && !prefersReduced) {
      const t0 = performance.now();
      const tick = now => {
        if (preloader.classList.contains("is-done")) return;
        const p = Math.min(1, (now - t0) / (minMs * 0.92));
        const eased = 1 - Math.pow(1 - p, 3);
        preCount.textContent = pad2(Math.min(100, Math.round(eased * 100)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    } else if (preCount) {
      preCount.textContent = "100";
    }

    const minWait = new Promise(r => setTimeout(r, minMs));
    const loaded = new Promise(r => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", r, { once: true });
    });
    Promise.race([Promise.all([minWait, loaded]), new Promise(r => setTimeout(r, 4500))]).then(finishPreloader);
    preloader.addEventListener("click", finishPreloader);
  })();

  /* ==========================================================
     DIBUJOS DECORATIVOS DE ./img/fondo + EXPLOSIÓN DE 140 MICRO-SVGs
     + CONSTELACIÓN EN LA INTRO (SIN CALAVERA)
     ========================================================== */
  (function initInkCanvas() {
    const MOTIFS = {
      // Estrella afilada de 4 puntas + micro marcas
      star4: {
        vb: "0 0 36 36",
        under: "M 18 2 L 20 16 L 34 18 L 20 20 L 18 34 L 16 20 L 2 18 L 16 16 Z",
        paths: [
          "M 18 2 L 20 16 L 34 18 L 20 20 L 18 34 L 16 20 L 2 18 L 16 16 Z",
          "M 11 11 L 14 14 M 25 11 L 22 14 M 25 25 L 22 22 M 11 25 L 14 22"
        ]
      },
      // Estrella afilada de 8 puntas (grabado astral)
      star8: {
        vb: "0 0 36 36",
        under: "M 18 2 L 18 34 M 2 18 L 34 18 M 7 7 L 29 29 M 29 7 L 7 29",
        paths: [
          "M 18 2 L 18 34 M 2 18 L 34 18",
          "M 7 7 L 29 29 M 29 7 L 7 29 M 18 14 L 22 18 L 18 22 L 14 18 Z"
        ]
      },
      // Destello geométrico fino
      spark: {
        vb: "0 0 36 36",
        under: "M 18 4 L 24 18 L 18 32 L 12 18 Z",
        paths: [
          "M 18 4 L 24 18 L 18 32 L 12 18 Z",
          "M 4 18 L 10 18 M 26 18 L 32 18 M 18 11 L 18 25"
        ]
      },
      // Serpiente minimalista de una sola línea
      snake: {
        vb: "0 0 36 44",
        under: "M 18 5 C 27 8 27 15 17 19 C 8 23 8 30 19 34 C 25 36 24 40 16 41",
        paths: [
          "M 18 5 C 27 8 27 15 17 19 C 8 23 8 30 19 34 C 25 36 24 40 16 41",
          "M 15 5 L 18 3 L 21 6 L 17.5 8 Z M 18 3 L 18 0.5 M 18 1.5 L 16.5 0 M 18 1.5 L 19.5 0"
        ]
      },
      // Cuervo / ave abstracta en una sola línea
      raven: {
        vb: "0 0 42 30",
        under: "M 2 20 C 8 8 16 8 21 15 C 26 7 34 6 40 12",
        paths: [
          "M 2 20 C 8 8 16 8 21 15 C 26 7 34 6 40 12",
          "M 6 19 C 13 13 17 15 21 18 C 25 14 30 12 36 14 M 21 15 L 23 19 L 27 18"
        ]
      },
      // Polilla geométrica minimalista
      moth: {
        vb: "0 0 42 36",
        under: "M 21 11 L 6 5 C 4 13 8 20 17 21 L 11 29 C 16 30 19 26 21 23 C 23 26 26 30 31 29 L 25 21 C 34 20 38 13 36 5 L 21 11 Z",
        paths: [
          "M 21 11 L 6 5 C 4 13 8 20 17 21 L 11 29 C 16 30 19 26 21 23 C 23 26 26 30 31 29 L 25 21 C 34 20 38 13 36 5 L 21 11 Z",
          "M 21 8 L 21 27 M 19 9 C 17 5 15 4 13 5 M 23 9 C 25 5 27 4 29 5 M 13 13 L 15 15 M 29 13 L 27 15"
        ]
      },
      // Araña minimalista suspendida en hilo fino
      spider: {
        vb: "0 0 36 44",
        under: "M 18 0 L 18 19 M 18 19 C 22 19 23 25 18 27 C 13 25 14 19 18 19",
        paths: [
          "M 18 0 L 18 19 M 18 19 C 22 19 23 25 18 27 C 13 25 14 19 18 19 M 18 27 C 20 27 20 31 18 32 C 16 31 16 27 18 27",
          "M 15 22 L 8 17 L 5 22 M 14 25 L 7 25 L 4 31 M 15 28 L 9 33 L 7 38 M 21 22 L 28 17 L 31 22 M 22 25 L 29 25 L 32 31 M 21 28 L 27 33 L 29 38"
        ]
      },
      // Ojo surrealista de trazo suelto
      eye: {
        vb: "0 0 42 30",
        under: "M 3 15 C 12 4 30 4 39 15 C 30 26 12 26 3 15 Z",
        paths: [
          "M 3 15 C 12 4 30 4 39 15 C 30 26 12 26 3 15 Z",
          "M 21 10 C 25 10 27 13 26 17 C 25 20 20 21 17 19 C 15 17 16 13 19 12 C 21 11 23 14 21 16 M 21 2 L 21 5 M 21 25 L 21 29"
        ]
      },
      // Espiral / garabato orgánico de tinta
      scribble: {
        vb: "0 0 42 32",
        under: "M 4 18 C 8 4 28 3 35 12 C 40 20 28 30 16 26 C 7 23 8 10 20 9 C 30 8 36 18 28 24",
        paths: [
          "M 4 18 C 8 4 28 3 35 12 C 40 20 28 30 16 26 C 7 23 8 10 20 9 C 30 8 36 18 28 24",
          "M 3 25 C 14 17 28 23 39 10"
        ]
      },
      // Trazo de aguja / pluma estilizada
      needle: {
        vb: "0 0 38 38",
        under: "M 32 6 L 14 24 L 8 30 L 16 26 L 34 8 Z",
        paths: [
          "M 32 6 L 14 24 L 8 30 L 16 26 L 34 8 Z",
          "M 8 30 C 4 34 16 36 28 29 M 24 14 L 18 20"
        ]
      }
    };

    // 1) Constelación de 16 SVGs finos dibujándose alrededor de la Intro (sin calavera · capas de profundidad)
    const preSwarm = $("#preSwarm");
    if (preSwarm) {
      const PRE_ITEMS = [
        { t: "14%", x: "left:18%",  m: "star4",    sz: 20, op: .86, d: 1.2, del: .10 },
        { t: "18%", x: "right:20%", m: "raven",    sz: 28, op: .34, d: 1.5, del: .22 },
        { t: "24%", x: "left:8%",   m: "snake",    sz: 26, op: .78, d: 1.6, del: .30 },
        { t: "26%", x: "right:10%", m: "star8",    sz: 22, op: .88, d: 1.3, del: .15 },
        { t: "36%", x: "left:15%",  m: "eye",      sz: 28, op: .28, d: 1.5, del: .40 },
        { t: "38%", x: "right:16%", m: "moth",     sz: 28, op: .80, d: 1.6, del: .35 },
        { t: "48%", x: "left:7%",   m: "spark",    sz: 19, op: .40, d: 1.2, del: .25 },
        { t: "52%", x: "right:7%",  m: "needle",   sz: 24, op: .84, d: 1.4, del: .45 },
        { t: "62%", x: "left:16%",  m: "scribble", sz: 28, op: .26, d: 1.6, del: .50 },
        { t: "64%", x: "right:15%", m: "spider",   sz: 26, op: .76, d: 1.5, del: .32 },
        { t: "74%", x: "left:10%",  m: "star8",    sz: 22, op: .82, d: 1.3, del: .58 },
        { t: "76%", x: "right:11%", m: "star4",    sz: 20, op: .32, d: 1.2, del: .28 },
        { t: "82%", x: "left:24%",  m: "raven",    sz: 26, op: .38, d: 1.5, del: .42 },
        { t: "84%", x: "right:23%", m: "snake",    sz: 26, op: .80, d: 1.6, del: .48 },
        { t: "12%", x: "left:48%",  m: "spark",    sz: 18, op: .30, d: 1.2, del: .18 },
        { t: "88%", x: "left:49%",  m: "eye",      sz: 26, op: .76, d: 1.5, del: .55 }
      ];
      preSwarm.innerHTML = PRE_ITEMS.map(it => {
        const m = MOTIFS[it.m];
        const paths = m.paths.map((d, j) =>
          `<path d="${d}" pathLength="100" style="--pdur:${it.d}s;--pdel:${(it.del + j * 0.28).toFixed(2)}s"/>`
        ).join("");
        return `<svg class="pre__mini" viewBox="${m.vb}" style="top:${it.t};${it.x};--sz:${it.sz}px;--op:${it.op}">${paths}</svg>`;
      }).join("");
    }

    // 2) Todos los dibujos de ./img/fondo dispersos en capas de profundidad (icn1 vive en el Hero)
    //    Sin grayscale: conserva colores originales (icn12, icn13, icn15) fundidos con mix-blend-mode: multiply
    //    Profundidad intencional: primer plano (0.76–0.90) y segundo plano tenue (0.26–0.42)
    const fondosField = $("#fondosField");
    if (fondosField) {
      const FONDOS_PLACES = [
        { src: "img/fondo/icn8.png",  w: 709, h: 734, t: "14.5%", x: "left:-1.5vw",  fw: "clamp(155px, 19vw, 275px)", op: .80, p: 0.11,  rot: -5, dur: 24, del: -2 },
        { src: "img/fondo/icn13.png", w: 685, h: 930, t: "20.2%", x: "right:-1vw",   fw: "clamp(155px, 18vw, 265px)", op: .86, p: -0.11, rot: 4,  dur: 27, del: -5 },
        { src: "img/fondo/icn7.png",  w: 699, h: 929, t: "26.2%", x: "left:-1.5vw",  fw: "clamp(150px, 18vw, 255px)", op: .34, p: 0.05,  rot: 3,  dur: 29, del: -9 },
        { src: "img/fondo/icn14.png", w: 701, h: 939, t: "31.8%", x: "right:-1.5vw", fw: "clamp(160px, 19vw, 270px)", op: .28, p: -0.05, rot: -3, dur: 31, del: -4 },
        { src: "img/fondo/icn12.png", w: 697, h: 927, t: "37.4%", x: "left:-1vw",    fw: "clamp(160px, 19vw, 270px)", op: .88, p: 0.12,  rot: -4, dur: 25, del: -7 },
        { src: "img/fondo/icn5.png",  w: 689, h: 918, t: "43.0%", x: "right:-2vw",   fw: "clamp(155px, 18vw, 265px)", op: .32, p: -0.05, rot: 3,  dur: 30, del: -11 },
        { src: "img/fondo/icn18.png", w: 672, h: 722, t: "48.6%", x: "left:-1vw",    fw: "clamp(165px, 19vw, 280px)", op: .78, p: 0.10,  rot: -2, dur: 24, del: -3 },
        { src: "img/fondo/icn9.png",  w: 698, h: 927, t: "54.2%", x: "right:-1vw",   fw: "clamp(150px, 17vw, 250px)", op: .26, p: -0.04, rot: -4, dur: 28, del: -6 },
        { src: "img/fondo/icn6.png",  w: 694, h: 937, t: "59.8%", x: "left:-1.5vw",  fw: "clamp(160px, 19vw, 270px)", op: .42, p: 0.06,  rot: 2,  dur: 29, del: -10 },
        { src: "img/fondo/icn16.png", w: 694, h: 926, t: "65.2%", x: "right:-1.5vw", fw: "clamp(160px, 19vw, 275px)", op: .30, p: -0.05, rot: 3,  dur: 32, del: -8 },
        { src: "img/fondo/icn15.png", w: 677, h: 913, t: "70.6%", x: "left:1vw",     fw: "clamp(165px, 19vw, 280px)", op: .90, p: 0.12,  rot: -3, dur: 25, del: -1 },
        { src: "img/fondo/icn4.png",  w: 698, h: 694, t: "75.6%", x: "right:1.5vw",  fw: "clamp(165px, 19vw, 275px)", op: .82, p: -0.10, rot: -2, dur: 26, del: -6 },
        { src: "img/fondo/icn3.png",  w: 748, h: 894, t: "80.6%", x: "left:-1vw",    fw: "clamp(160px, 19vw, 275px)", op: .34, p: 0.05,  rot: 2,  dur: 29, del: -4 },
        { src: "img/fondo/icn17.png", w: 696, h: 926, t: "85.2%", x: "right:1vw",    fw: "clamp(160px, 18vw, 265px)", op: .84, p: -0.11, rot: -2, dur: 24, del: -9 },
        { src: "img/fondo/icn2.png",  w: 694, h: 938, t: "89.6%", x: "left:2vw",     fw: "clamp(145px, 16vw, 235px)", op: .76, p: 0.09,  rot: 5,  dur: 25, del: -7 },
        { src: "img/fondo/icn10.png", w: 687, h: 916, t: "93.6%", x: "right:1vw",    fw: "clamp(140px, 16vw, 225px)", op: .28, p: -0.05, rot: 4,  dur: 28, del: -3 }
      ];
      fondosField.innerHTML = FONDOS_PLACES.map(f => `
        <div class="fondo-item" data-parallax="${f.p}" style="top:${f.t};${f.x};--fw:${f.fw};--fop:${f.op};--frot:${f.rot}deg;--fdur:${f.dur}s;--fdel:${f.del}s">
          <img src="${f.src}" width="${f.w}" height="${f.h}" loading="lazy" decoding="async" alt="">
        </div>`).join("");
    }

    // 3) Explosión de 140 micro-SVGs (16px a 30px) + 52 líneas finas con capas de profundidad
    //    Zona libre garantizada en esquina inferior derecha del Hero para icn1.png
    const field = $("#inkField");
    if (!field) return;

    const MOTIF_KEYS = Object.keys(MOTIFS);
    const DRIFTS = ["a", "b", "c", "d"];
    const X_SLOTS = [
      "left:1.2vw", "right:1.5vw", "left:6vw", "right:6.5vw", "left:13vw", "right:14vw",
      "left:21vw", "right:22vw", "left:30vw", "right:31vw", "left:39vw", "right:40vw",
      "left:48vw", "left:3vw", "right:3.5vw", "left:10vw", "right:10.5vw",
      "left:18vw", "right:18.5vw", "left:26vw", "right:27vw", "left:35vw", "right:36vw"
    ];
    // Reubicación limpia en zonas abiertas del Hero (lado izquierdo y esquina superior derecha)
    const HERO_SAFE_MICRO = [
      { t: 1.55, x: "right:6vw" },
      { t: 2.35, x: "right:19vw" },
      { t: 5.20, x: "left:4.5vw" },
      { t: 7.40, x: "left:11vw" },
      { t: 9.40, x: "left:2.2vw" },
      { t: 11.40, x: "left:15vw" }
    ];
    let heroMicroSwap = 0;

    const MICRO_PLACES = Array.from({ length: 140 }, (_, i) => {
      let topNum = 0.5 + (i * 98.6) / 139 + ((i % 3) - 1) * 0.22;
      let x = X_SLOTS[(i * 7 + (i % 5)) % X_SLOTS.length];
      let numVw = parseFloat(x.split(":")[1]) || 0;

      // Si cae en la esquina inferior derecha del Hero (donde vive icn1.png), mover a zona libre del Hero
      if (topNum >= 3.0 && topNum <= 14.0 && x.startsWith("right:") && numVw <= 32) {
        const slot = HERO_SAFE_MICRO[heroMicroSwap % HERO_SAFE_MICRO.length];
        heroMicroSwap++;
        topNum = slot.t;
        x = slot.x;
        numVw = parseFloat(x.split(":")[1]) || 0;
      }

      const topPct = topNum.toFixed(2) + "%";
      const isCenter = numVw >= 18;
      const m = MOTIF_KEYS[(i * 3 + Math.floor(i / 4)) % MOTIF_KEYS.length];

      // Capas de profundidad intencionales: primer plano (0.76–0.92), plano medio (0.46–0.62) y fondo tenue (0.22–0.40)
      const tier = i % 7;
      let op, sz, pRate;
      if (tier === 0 || tier === 3) {
        // Primer plano marcado y oscuro
        op = +(isCenter ? (0.72 + (i % 3) * 0.05) : (0.78 + (i % 4) * 0.045)).toFixed(3);
        sz = 22 + ((i * 3) % 9); // 22px..30px
        pRate = 0.095 + (i % 4) * 0.012;
      } else if (tier === 1 || tier === 5) {
        // Plano medio equilibrado
        op = +(isCenter ? (0.44 + (i % 3) * 0.05) : (0.50 + (i % 4) * 0.045)).toFixed(3);
        sz = 19 + ((i * 5) % 9); // 19px..27px
        pRate = 0.065 + (i % 4) * 0.01;
      } else {
        // Segundo plano suave y distante
        op = +(isCenter ? (0.22 + (i % 4) * 0.04) : (0.26 + (i % 5) * 0.042)).toFixed(3);
        sz = 16 + ((i * 5) % 8); // 16px..23px
        pRate = 0.036 + (i % 3) * 0.009;
      }

      const d = DRIFTS[i % 4];
      const p = +(((i % 2 === 0 ? 1 : -1) * pRate)).toFixed(3);
      const md = 12 + (i % 13);
      const mdel = -((i * 1.67) % md).toFixed(2);
      const td = 7.8 + (i % 8) * 0.9;
      const tdel = -((i * 2.09) % td).toFixed(2);
      return { t: topPct, x, m, sz, op, d, p, md, mdel, td: +td.toFixed(2), tdel };
    });

    const LINE_SHAPES = [
      { w: "28vw", h: 12,  vb: "0 0 280 12", d: "M 0 6 L 280 6" },
      { w: "14px", h: 185, vb: "0 0 14 185", d: "M 7 0 L 7 185 M 2 92 L 12 92" },
      { w: "20vw", h: 14,  vb: "0 0 220 14", d: "M 0 7 L 220 7 M 110 2 L 110 12" },
      { w: "14px", h: 145, vb: "0 0 14 145", d: "M 7 0 L 7 145 M 3 36 L 11 36" },
      { w: "92px", h: 92,  vb: "0 0 92 92",  d: "M 8 84 L 84 8 M 36 36 L 56 56" },
      { w: "24vw", h: 14,  vb: "0 0 240 14", d: "M 0 7 L 240 7 M 64 2 L 64 12 M 184 2 L 184 12" },
      { w: "80px", h: 80,  vb: "0 0 80 80",  d: "M 6 6 L 74 74 M 48 20 L 62 20" },
      { w: "16px", h: 210, vb: "0 0 16 210", d: "M 8 0 L 8 210 M 2 135 L 14 135" }
    ];
    const LINE_X = [
      "left:0", "right:3.5vw", "left:4vw", "right:0", "left:16vw", "right:16vw",
      "left:32vw", "right:32vw", "left:2vw", "right:2vw", "left:10vw", "right:11vw"
    ];
    const HERO_SAFE_LINES = [
      { t: 2.05, x: "right:7vw" },
      { t: 6.15, x: "left:3vw" },
      { t: 9.85, x: "left:12vw" }
    ];
    let heroLineSwap = 0;

    const ARCH_LINES = Array.from({ length: 52 }, (_, i) => {
      const sh = LINE_SHAPES[i % LINE_SHAPES.length];
      let tNum = 1.2 + (i * 97.4) / 51;
      let x = LINE_X[(i * 5 + 1) % LINE_X.length];
      const numVw = parseFloat(x.split(":")[1]) || 0;

      // Despeja esquina inferior derecha del Hero para que nada cruce sobre icn1.png
      if (tNum >= 3.0 && tNum <= 14.0 && x.startsWith("right:") && numVw <= 32) {
        const slot = HERO_SAFE_LINES[heroLineSwap % HERO_SAFE_LINES.length];
        heroLineSwap++;
        tNum = slot.t;
        x = slot.x;
      }

      const t = tNum.toFixed(2) + "%";
      const tier = i % 4;
      const sw = +(tier === 0 ? 0.85 : tier === 2 ? 0.65 : 0.55).toFixed(2);
      const op = +(tier === 0 ? (0.64 + (i % 3) * 0.07) : tier === 2 ? (0.38 + (i % 3) * 0.05) : (0.20 + (i % 3) * 0.05)).toFixed(3);
      const p = +(((i % 2 === 0 ? -1 : 1) * (tier === 0 ? 0.085 : 0.045))).toFixed(3);
      const td = 10.0 + (i % 7) * 1.1;
      const tdel = -((i * 2.29) % td).toFixed(2);
      const dx = (i % 2 === 0 ? 1 : -1) * (3 + (i % 5));
      const dy = (i % 3 === 0 ? -1 : 1) * (3 + (i % 5));
      return { t, x, ...sh, sw, op, p, td: +td.toFixed(1), tdel, dx, dy };
    });

    const microHTML = MICRO_PLACES.map(item => {
      const m = MOTIFS[item.m];
      const draws = m.paths.map((d, idx) =>
        `<path class="micro-draw${idx ? " micro-draw--alt" : ""}" d="${d}" pathLength="100"/>`
      ).join("");
      return `
        <div class="micro-pos" data-parallax="${item.p}" style="top:${item.t};${item.x};--op:${item.op}">
          <span class="micro-drift micro-drift--${item.d}" style="--mdur:${item.md}s;--mdel:${item.mdel}s;--sz:${item.sz}px;--tdur:${item.td}s;--tdel:${item.tdel}s">
            <svg class="micro-svg" viewBox="${m.vb}">
              <path class="micro-under" d="${m.under}" pathLength="100"/>
              ${draws}
            </svg>
          </span>
        </div>`;
    }).join("");

    const lineHTML = ARCH_LINES.map(l => `
      <div class="arch-pos" data-parallax="${l.p}" style="top:${l.t};${l.x};--op:${l.op};--sw:${l.sw};--tdur:${l.td}s;--tdel:${l.tdel}s;--mdur:${l.td + 6}s;--mdel:${l.tdel}s;--dx:${l.dx}px;--dy:${l.dy}px">
        <span class="arch-drift">
          <svg class="arch-svg" style="width:${l.w};height:${l.h}px" viewBox="${l.vb}" preserveAspectRatio="none">
            <path class="arch-ghost" d="${l.d}"/>
            <path class="arch-live" d="${l.d}" pathLength="100"/>
          </svg>
        </span>
      </div>`).join("");

    field.innerHTML = lineHTML + microHTML;

    // 4) Composición dedicada en la esquina superior derecha del Hero (junto a STAN LEERAY)
    //    Líneas finas animadas en múltiples direcciones + micro-SVGs con profundidad, despejando icn1.png abajo
    const heroTr = $("#heroTrArt");
    if (heroTr) {
      const TR_LINES = [
        // Horizontal fina con marcas de registro (arriba)
        { t: "8%",  x: "right:4%",  w: "68%",   h: 14,  vb: "0 0 260 14",  d: "M 0 7 L 260 7 M 82 2 L 82 12 M 196 3 L 196 11", sw: .75, op: .68, p: -0.05, td: 9.5,  tdel: -1.4, dx: 5,  dy: -3 },
        // Diagonal ascendente 45° (centro-derecha)
        { t: "14%", x: "right:12%", w: "130px", h: 130, vb: "0 0 130 130", d: "M 10 120 L 120 10 M 54 54 L 76 76",             sw: .65, op: .38, p: 0.04,  td: 11.2, tdel: -4.2, dx: -4, dy: 4  },
        // Vertical fina de plomada (extremo derecho superior)
        { t: "4%",  x: "right:7%",  w: "14px",  h: 155, vb: "0 0 14 155",  d: "M 7 0 L 7 155 M 2 52 L 12 52 M 3 118 L 11 118", sw: .85, op: .76, p: -0.07, td: 10.4, tdel: -2.8, dx: 3,  dy: 5  },
        // Diagonal descendente amplia (zona izquierda-media del cuadrante, junto a STAN)
        { t: "36%", x: "left:6%",   w: "165px", h: 96,  vb: "0 0 165 96",  d: "M 6 14 L 159 84 M 72 34 L 84 60",               sw: .60, op: .32, p: 0.05,  td: 12.0, tdel: -6.1, dx: 5,  dy: 3  },
        // Curva orgánica de tinta flotando hacia la derecha
        { t: "24%", x: "left:24%",  w: "190px", h: 64,  vb: "0 0 190 64",  d: "M 6 48 C 58 6 128 58 184 14",                   sw: .70, op: .54, p: -0.04, td: 10.8, tdel: -3.5, dx: -5, dy: -4 },
        // Trazo cruzado corto en primer plano (zona baja izquierda del cuadrante, libre de icn1)
        { t: "72%", x: "left:14%",  w: "110px", h: 48,  vb: "0 0 110 48",  d: "M 4 24 L 106 24 M 44 6 L 66 42",                sw: .80, op: .72, p: 0.06,  td: 9.2,  tdel: -5.0, dx: 4,  dy: -4 }
      ];
      const TR_MICROS = [
        { t: "6%",  x: "left:18%",  m: "star8",    sz: 24, op: .86, d: "a", p: -0.08, md: 14, mdel: -2.1, td: 8.6,  tdel: -1.2 },
        { t: "10%", x: "right:28%", m: "raven",    sz: 28, op: .40, d: "b", p: 0.04,  md: 17, mdel: -5.4, td: 10.4, tdel: -3.8 },
        { t: "18%", x: "right:10%", m: "star4",    sz: 20, op: .82, d: "c", p: -0.07, md: 13, mdel: -3.2, td: 8.2,  tdel: -2.5 },
        { t: "34%", x: "left:8%",   m: "spark",    sz: 18, op: .30, d: "d", p: 0.04,  md: 16, mdel: -6.0, td: 9.8,  tdel: -4.6 },
        { t: "38%", x: "left:40%",  m: "moth",     sz: 26, op: .78, d: "b", p: -0.09, md: 15, mdel: -1.8, td: 9.2,  tdel: -0.9 },
        { t: "44%", x: "right:18%", m: "needle",   sz: 22, op: .54, d: "a", p: 0.06,  md: 18, mdel: -7.1, td: 10.8, tdel: -5.2 },
        { t: "56%", x: "left:22%",  m: "eye",      sz: 26, op: .88, d: "c", p: -0.08, md: 14, mdel: -4.5, td: 8.8,  tdel: -2.1 },
        { t: "66%", x: "left:48%",  m: "scribble", sz: 24, op: .28, d: "d", p: 0.04,  md: 19, mdel: -8.3, td: 11.4, tdel: -6.4 },
        { t: "78%", x: "left:8%",   m: "snake",    sz: 25, op: .62, d: "a", p: -0.06, md: 16, mdel: -3.9, td: 9.6,  tdel: -1.7 }
      ];

      const trLinesHTML = TR_LINES.map(l => `
        <div class="arch-pos" data-parallax="${l.p}" style="top:${l.t};${l.x};--op:${l.op};--sw:${l.sw};--tdur:${l.td}s;--tdel:${l.tdel}s;--mdur:${l.td + 6}s;--mdel:${l.tdel}s;--dx:${l.dx}px;--dy:${l.dy}px">
          <span class="arch-drift">
            <svg class="arch-svg" style="width:${l.w};height:${l.h}px" viewBox="${l.vb}" preserveAspectRatio="none">
              <path class="arch-ghost" d="${l.d}"/>
              <path class="arch-live" d="${l.d}" pathLength="100"/>
            </svg>
          </span>
        </div>`).join("");

      const trMicrosHTML = TR_MICROS.map(item => {
        const m = MOTIFS[item.m];
        const draws = m.paths.map((d, idx) =>
          `<path class="micro-draw${idx ? " micro-draw--alt" : ""}" d="${d}" pathLength="100"/>`
        ).join("");
        return `
          <div class="micro-pos" data-parallax="${item.p}" style="top:${item.t};${item.x};--op:${item.op}">
            <span class="micro-drift micro-drift--${item.d}" style="--mdur:${item.md}s;--mdel:${item.mdel}s;--sz:${item.sz}px;--tdur:${item.td}s;--tdel:${item.tdel}s">
              <svg class="micro-svg" viewBox="${m.vb}">
                <path class="micro-under" d="${m.under}" pathLength="100"/>
                ${draws}
              </svg>
            </span>
          </div>`;
      }).join("");

      heroTr.innerHTML = trLinesHTML + trMicrosHTML;
    }
  })();

  /* ==========================================================
     BÁSICOS: año, enlaces, topbar y parallax suave de vectores
     ========================================================== */
  $("#year").textContent = new Date().getFullYear();
  $('[data-link="email"]').href = "mailto:" + CONFIG.email;
  $("[data-email-label]").textContent = CONFIG.email;
  $$("[data-email-inline]").forEach(el => { el.textContent = CONFIG.email; });
  $$('[data-link="instagram"]').forEach(a => { a.href = "https://instagram.com/" + CONFIG.instagram; });

  const topbar = $("#topbar");
  const parallaxEls = $$("[data-parallax]");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    topbar.classList.toggle("is-solid", y > 36);

    if (!prefersReduced && parallaxEls.length) {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const rate = parseFloat(el.dataset.parallax) || 0;
        const rect = el.getBoundingClientRect();
        const delta = (rect.top + rect.height * 0.5 - vh * 0.5) * rate;
        el.style.setProperty("--py", delta.toFixed(1) + "px");
      });
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener("resize", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ==========================================================
     SCROLL REVEAL + ANIMACIÓN DE MARCOS SVG AL ENTRAR EN PANTALLA
     ========================================================== */
  let revealObserver = null;
  let frameObserver = null;

  function revealEl(el) {
    if (el.classList.contains("is-visible")) return;
    el.classList.add("is-visible");
    if (revealObserver) revealObserver.unobserve(el);
    const d = parseFloat(el.style.getPropertyValue("--d")) || 0;
    setTimeout(() => { el.removeAttribute("data-reveal"); el.style.removeProperty("--d"); }, (d + 1.0) * 1000);
  }

  function initReveal() {
    if ("IntersectionObserver" in window && !prefersReduced) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { if (entry.isIntersecting) revealEl(entry.target); });
      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

      frameObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-framed");
            frameObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16 });
    }

    $$("[data-reveal]").forEach(el => {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add("is-visible");
    });

    $$(".art-card").forEach(card => {
      if (frameObserver) frameObserver.observe(card);
      else card.classList.add("is-framed");
    });

    requestAnimationFrame(() => $$("[data-reveal]").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95 && r.bottom > 0) revealEl(el);
    }));
  }

  /* ==========================================================
     LIGHTBOX LIMPIO SOBRE PAPEL BLANCO
     ========================================================== */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  let lbList = [], lbIndex = 0, lbFocus = null, lbRaw = false;

  function lbShow(i) {
    if (!lbList.length) return;
    lbIndex = (i + lbList.length) % lbList.length;
    const p = lbList[lbIndex];
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbImg.classList.toggle("is-raw", lbRaw || p.cat === "grafica");
    const kind = catLabel(p.cat).toUpperCase();
    const fig = p.fig || pad2(lbIndex + 1);
    lbCaption.textContent = `FIG. ${fig} · ${kind} (${pad2(lbIndex + 1)} / ${pad2(lbList.length)}) — ${p.alt}`;
    [lbIndex - 1, lbIndex + 1].forEach(n => { new Image().src = lbList[(n + lbList.length) % lbList.length].src; });
  }

  function lbOpen(list, index, raw = false) {
    lbFocus = document.activeElement;
    lbList = list;
    lbRaw = raw;
    lb.hidden = false;
    document.body.classList.add("no-scroll");
    lbShow(index);
    requestAnimationFrame(() => lb.classList.add("is-open"));
    $("#lbClose").focus();
  }

  function lbClose() {
    lb.classList.remove("is-open");
    if (!anyModalOpen(true)) document.body.classList.remove("no-scroll");
    setTimeout(() => { lb.hidden = true; lbImg.removeAttribute("src"); }, 300);
    if (lbFocus) lbFocus.focus();
  }

  $("#lbClose").addEventListener("click", lbClose);
  $("#lbPrev").addEventListener("click", () => lbShow(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => lbShow(lbIndex + 1));
  lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox__figure")) lbClose(); });

  let sx = 0, sy = 0;
  lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) lbShow(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---- Hero Collage -> Lightbox ---- */
  $$("[data-hero-src]").forEach(fig => {
    const btn = $(".art-card__btn", fig);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const idx = INDEXED.findIndex(p => p.src === fig.dataset.heroSrc);
      lbOpen(INDEXED, idx >= 0 ? idx : 0);
    });
  });

  /* ==========================================================
     4. MARCO SVG DE BOCETO ARQUITECTÓNICO (ESQUINAS SOBRESALIENTES ~10px)
     ========================================================== */
  const SVG_FRAME_HTML = `
    <svg class="art-frame" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true">
      <path class="frame-corners" d="M -12 0 L 28 0 M 0 -12 L 0 28 M 372 0 L 412 0 M 400 -12 L 400 28 M 372 500 L 412 500 M 400 472 L 400 512 M -12 500 L 28 500 M 0 472 L 0 512" pathLength="100"/>
      <path class="frame-trace" d="M 0 0 L 400 0 L 400 500 L 0 500 Z" pathLength="100"/>
    </svg>`;

  /* ==========================================================
     3. LENGUAJE DEL ESTUDIO: VISOR PROTAGONISTA DE DIBUJOS (SIN FILTRO)
     5 ilustraciones originales (cat === "grafica") + 6.ª diapositiva editorial a Instagram
     ========================================================== */
  const Carousel = (() => {
    const wrap = $("#drawingShowcase");
    const stage = $("#showcaseStage");
    const counter = $("#showCounter");
    const caption = $("#showCaption");
    const dotsEl = $("#showDots");
    const bar = $("#showProgress");
    const prevBtn = $("#carPrev");
    const nextBtn = $("#carNext");
    const drawings = INDEXED.filter(p => p.cat === "grafica");
    const totalSlides = drawings.length ? drawings.length + 1 : 0;

    let idx = 0, timer = null, paused = false, inView = false, started = false;
    let slides = [], dots = [];

    if (bar) bar.style.setProperty("--show-ms", CONFIG.carouselAutoMs + "ms");

    if (stage && drawings.length) {
      const drawingSlidesHTML = drawings.map((p, i) => `
        <button class="showcase__slide${i === 0 ? " is-active" : ""}" type="button" data-i="${i}" aria-label="Ampliar dibujo FIG. ${p.fig}: ${esc(p.alt)}">
          <img class="showcase__img" src="${esc(p.src)}"${imgAttrs(p)} decoding="async" alt="${esc(p.alt)}" draggable="false">
          <svg class="showcase__frame" viewBox="0 0 800 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -12 0 L 34 0 M 0 -12 L 0 34 M 766 0 L 812 0 M 800 -12 L 800 34 M 766 560 L 812 560 M 800 526 L 800 572 M -12 560 L 34 560 M 0 526 L 0 572" />
          </svg>
        </button>`).join("");

      const igSlideHTML = `
        <div class="showcase__slide showcase__slide--cta" data-i="${drawings.length}" role="group" aria-label="Más en nuestro Instagram @s.leeray">
          <div class="showcase__cta">
            <div class="showcase__cta-marks" aria-hidden="true">
              <svg class="showcase__cta-star" viewBox="0 0 36 36">
                <path d="M 18 2 L 20 16 L 34 18 L 20 20 L 18 34 L 16 20 L 2 18 L 16 16 Z" pathLength="100"/>
                <path d="M 10 10 L 26 26 M 26 10 L 10 26" pathLength="100"/>
              </svg>
              <span class="showcase__cta-rule"></span>
              <span class="mono">ARCHIVO VIVO // ${pad2(totalSlides)}</span>
              <span class="showcase__cta-rule"></span>
              <svg class="showcase__cta-star showcase__cta-star--sm" viewBox="0 0 36 36">
                <path d="M 18 4 L 24 18 L 18 32 L 12 18 Z" pathLength="100"/>
              </svg>
            </div>
            <h3 class="showcase__cta-title">Más en nuestro <em>Instagram</em></h3>
            <p class="showcase__cta-handle">@s.leeray</p>
            <p class="showcase__cta-sub">Bocetos inéditos, procesos en tinta y nuevas piezas publicadas cada semana.</p>
            <a class="ink-link ink-link--solid showcase__cta-btn" href="https://www.instagram.com/s.leeray/" target="_blank" rel="noopener noreferrer">
              <span>Seguir a @s.leeray</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <svg class="showcase__frame" viewBox="0 0 800 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M -12 0 L 34 0 M 0 -12 L 0 34 M 766 0 L 812 0 M 800 -12 L 800 34 M 766 560 L 812 560 M 800 526 L 800 572 M -12 560 L 34 560 M 0 526 L 0 572" />
          </svg>
        </div>`;

      stage.innerHTML = drawingSlidesHTML + igSlideHTML;

      slides = $$(".showcase__slide", stage);
      stage.addEventListener("click", e => {
        const s = e.target.closest(".showcase__slide.is-active");
        if (s && !s.classList.contains("showcase__slide--cta")) lbOpen(drawings, +s.dataset.i, true);
      });

      if (dotsEl) {
        dotsEl.innerHTML = Array.from({ length: totalSlides }, (_, i) => {
          const label = i < drawings.length ? `Ver dibujo ${pad2(i + 1)}` : "Más en nuestro Instagram";
          return `<button type="button" class="showcase__dot${i === 0 ? " is-active" : ""}" data-i="${i}" role="tab" aria-selected="${i === 0}" aria-label="${label}"><span></span></button>`;
        }).join("");
        dots = $$(".showcase__dot", dotsEl);
        dots.forEach(d => d.addEventListener("click", () => { go(+d.dataset.i); resetAuto(); }));
      }
      updateMeta(0);
    }

    function updateMeta(i) {
      if (counter) counter.textContent = `${pad2(i + 1)} / ${pad2(totalSlides)}`;
      if (caption) {
        const p = drawings[i];
        caption.textContent = p
          ? `FIG. ${p.fig} — ${p.alt}`
          : "INSTAGRAM // @s.leeray — Explora más bocetos y trazos originales";
      }
      dots.forEach((d, di) => {
        const on = di === i;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-selected", on);
      });
    }

    function restartBar() {
      if (!bar || prefersReduced || totalSlides < 2) return;
      bar.classList.remove("is-running");
      void bar.offsetWidth;
      bar.classList.add("is-running");
    }

    function go(nextIdx) {
      if (!slides.length) return;
      const target = (nextIdx + totalSlides) % totalSlides;
      if (target === idx) return;
      const out = slides[idx];
      const inc = slides[target];
      out.classList.remove("is-active");
      out.classList.add("is-leaving");
      inc.classList.remove("is-leaving");
      inc.classList.add("is-active");
      idx = target;
      updateMeta(idx);
      restartBar();
      setTimeout(() => out.classList.remove("is-leaving"), 1000);
    }

    if (prevBtn) prevBtn.addEventListener("click", () => { go(idx - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { go(idx + 1); resetAuto(); });

    function resetAuto() {
      if (timer) { clearInterval(timer); timer = null; }
      const shouldRun = started && !prefersReduced && totalSlides > 1 && !paused && inView && !document.hidden;
      if (wrap) wrap.classList.toggle("is-paused", !shouldRun);
      if (!shouldRun) return;
      restartBar();
      timer = setInterval(() => go(idx + 1), CONFIG.carouselAutoMs);
    }

    function start() {
      if (!wrap || !totalSlides || started) return;
      started = true;
      wrap.addEventListener("pointerenter", () => { paused = true; resetAuto(); });
      wrap.addEventListener("pointerleave", () => { paused = false; resetAuto(); });
      wrap.addEventListener("focusin", () => { paused = true; resetAuto(); });
      wrap.addEventListener("focusout", () => { paused = false; resetAuto(); });
      document.addEventListener("visibilitychange", resetAuto);
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(([e]) => { inView = e.isIntersecting; resetAuto(); }, { threshold: 0.15 }).observe(wrap);
      } else {
        inView = true;
        resetAuto();
      }
    }

    return { start };
  })();

  /* ==========================================================
     OBRA EN PIEL (TATUAJES) — SIN REPETICIÓN DE OBRA GRÁFICA
     ========================================================== */
  const gridPiel = $("#galleryPiel");
  const metaPiel = $("#metaPiel");
  const pielItems = INDEXED.filter(p => p.cat === "piel");

  if (gridPiel) {
    gridPiel.innerHTML = pielItems.map((p, i) => `
      <li class="art-card" data-i="${i}" style="--fdel:${((i % 7) * -1.15).toFixed(2)}s">
        <button class="art-card__btn" type="button" aria-label="Abrir FIG. ${p.fig}: ${esc(p.alt)}">
          <span class="art-stage">
            <span class="art-media">
              <img src="${esc(p.src)}"${imgAttrs(p)} loading="lazy" decoding="async" alt="${esc(p.alt)}">
            </span>
            ${SVG_FRAME_HTML}
          </span>
          <span class="piece-cap">
            <span>FIG. ${p.fig}</span>
            <span>${esc(catLabel(p.cat))}</span>
          </span>
        </button>
      </li>`).join("");

    gridPiel.addEventListener("click", e => {
      const card = e.target.closest(".art-card");
      if (card) lbOpen(pielItems, +card.dataset.i, false);
    });
  }
  if (metaPiel) metaPiel.textContent = `${pad2(pielItems.length)} PIEZAS EN PIEL`;

  /* ==========================================================
     BASE DE DATOS LOCAL (IndexedDB + respaldo localStorage)
     ========================================================== */
  const DB = (() => {
    const NAME = "leeray-db", STORE = "cotizaciones", LS_KEY = "leeray_cotizaciones";
    let dbPromise = null;

    const open = () => dbPromise || (dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) return reject(new Error("IndexedDB no disponible"));
      const r = indexedDB.open(NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    }));

    const run = (mode, fn) => open().then(db => new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(req && req.result);
      t.onerror = t.onabort = () => reject(t.error);
    }));

    const lsRead = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
    const lsWrite = arr => localStorage.setItem(LS_KEY, JSON.stringify(arr));

    async function safe(idb, ls) {
      try { return await idb(); } catch (err) { console.warn("IndexedDB falló, usando localStorage:", err); return ls(); }
    }

    return {
      add: rec => safe(
        () => run("readwrite", s => s.add(rec)),
        () => { const a = lsRead(); rec.id = Date.now(); a.push(rec); lsWrite(a); return rec.id; }
      ),
      put: rec => safe(
        () => run("readwrite", s => s.put(rec)),
        () => { lsWrite(lsRead().map(r => r.id === rec.id ? rec : r)); }
      ),
      all: () => safe(
        () => run("readonly", s => s.getAll()),
        () => lsRead()
      ),
      remove: id => safe(
        () => run("readwrite", s => s.delete(id)),
        () => { lsWrite(lsRead().filter(r => r.id !== id)); }
      )
    };
  })();

  /* ==========================================================
     5. AGENDAMIENTO ESTRUCTURADO DIRECTO AL CORREO DEL ESTUDIO
     ========================================================== */
  const form = $("#quoteForm");
  const fileInput = $("#referencia");
  const uploadBox = $("#uploadBox");
  const preview = $("#uploadPreview");
  const uploadText = $("#uploadText");
  const statusEl = $("#formStatus");
  const zonaSelect = $("#zona");
  let objectUrl = null;
  let lastStructuredMessage = "";

  const remoteConfigured = {
    supabase: !!(CONFIG.supabase.url && CONFIG.supabase.anonKey),
    formspree: !!CONFIG.formspreeUrl
  };
  if (remoteConfigured.supabase || remoteConfigured.formspree) {
    $("#uploadHint").textContent = "Tu solicitud y referencia se envían también al respaldo en línea del estudio.";
  }

  const ILLUSTRATION_OPT = "Papel / formato digital (Ilustración)";
  $$('input[name="tipo"]', form).forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value.includes("Ilustración") && !zonaSelect.value) {
        zonaSelect.value = ILLUSTRATION_OPT;
        zonaSelect.dispatchEvent(new Event("change"));
      } else if (!radio.value.includes("Ilustración") && zonaSelect.value === ILLUSTRATION_OPT) {
        zonaSelect.value = "";
      }
    });
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (!file) {
      preview.hidden = true; preview.removeAttribute("src");
      uploadBox.classList.remove("has-file");
      uploadText.lastChild.textContent = "Adjuntar imagen o boceto de referencia";
      return;
    }
    objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
    preview.hidden = false;
    uploadBox.classList.add("has-file");
    uploadText.lastChild.textContent = file.name + " · cambiar";
  });

  const rules = {
    nombre: v => v.trim().length >= 2 || "Escribe tu nombre.",
    idea: v => v.trim().length >= 10 || "Describe brevemente tu concepto (mín. 10 caracteres).",
    zona: v => v !== "" || "Selecciona la zona del cuerpo o formato.",
    tamano: v => (Number(v) >= 1 && Number(v) <= 200) || "Indica un tamaño aproximado en cm."
  };

  function validate() {
    let firstBad = null;
    Object.keys(rules).forEach(name => {
      const el = form.elements[name];
      const res = rules[name](el.value);
      const ok = res === true;
      el.closest(".field").classList.toggle("has-error", !ok);
      $(`[data-error-for="${name}"]`).textContent = ok ? "" : res;
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  Object.keys(rules).forEach(name => {
    const el = form.elements[name];
    ["input", "change"].forEach(evt => el.addEventListener(evt, () => {
      if (rules[name](el.value) === true) {
        el.closest(".field").classList.remove("has-error");
        $(`[data-error-for="${name}"]`).textContent = "";
      }
    }));
  });

  function fileToDataUrl(file, max = 1200, quality = 0.82) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }

  function buildEmailBody(r) {
    const projectType = r.tipo || r.estilo || "Tatuaje personalizado";
    return [
      "Hola Stan Leeray (@s.leeray),",
      "",
      "Envío mi solicitud estructurada de proyecto:",
      "--------------------------------------------------",
      `NOMBRE:           ${r.nombre}`,
      `TIPO DE PROYECTO: ${projectType}`,
      `ZONA / FORMATO:   ${r.zona}`,
      `TAMAÑO APROX.:    ${r.tamano} cm`,
      `SEDE:             ${r.ciudad || "CDMX"}`,
      r.telefono ? `CONTACTO:         ${r.telefono}` : null,
      "--------------------------------------------------",
      "CONCEPTO / IDEA:",
      r.idea,
      "",
      r.referenciaUrl
        ? `REFERENCIA VISUAL: ${r.referenciaUrl}`
        : r.imagenNombre
          ? `REFERENCIA VISUAL: Adjunto el archivo (${r.imagenNombre}) en este correo.`
          : "REFERENCIA VISUAL: Sin referencia previa (abierto a la propuesta del estudio).",
      "",
      "Quedo atento a disponibilidad y cotización. Gracias."
    ].filter(l => l !== null).join("\n");
  }

  const mailtoUrl = (r, body) => {
    const type = r.tipo || "Proyecto";
    const subject = `Solicitud ${type} · ${r.nombre} (CDMX)`;
    return `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  async function fetchTimeout(url, opts, ms = 20000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
    finally { clearTimeout(t); }
  }

  async function sendToSupabase(record, file) {
    const { url, anonKey, table, bucket } = CONFIG.supabase;
    const base = url.replace(/\/$/, "");
    const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };

    if (file) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const up = await fetchTimeout(`${base}/storage/v1/object/${bucket}/${path}`, {
        method: "POST",
        headers: { ...headers, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
        body: file
      });
      if (!up.ok) throw new Error("Supabase Storage: " + up.status);
      record.referenciaUrl = `${base}/storage/v1/object/public/${bucket}/${path}`;
    }

    const ideaPayload = record.tipo ? `[${record.tipo}] ${record.idea}` : record.idea;
    const res = await fetchTimeout(`${base}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        nombre: record.nombre, idea: ideaPayload, zona: record.zona,
        tamano_cm: Number(record.tamano), ciudad: record.ciudad,
        telefono: record.telefono || null, referencia_url: record.referenciaUrl || null,
        estado: "Pendiente"
      })
    });
    if (!res.ok) throw new Error("Supabase DB: " + res.status);
  }

  async function sendToFormspree(record, file, message) {
    const fd = new FormData();
    fd.append("nombre", record.nombre);
    if (record.tipo) fd.append("tipo_proyecto", record.tipo);
    fd.append("idea", record.idea);
    fd.append("zona", record.zona);
    fd.append("tamano_cm", record.tamano);
    fd.append("ciudad", record.ciudad);
    fd.append("contacto", record.telefono || "");
    if (record.referenciaUrl) fd.append("referencia_url", record.referenciaUrl);
    fd.append("mensaje", message);
    if (file) fd.append("referencia", file, file.name);
    const res = await fetchTimeout(CONFIG.formspreeUrl, { method: "POST", body: fd, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("Formspree: " + res.status);
  }

  async function sendRemote(record, file, message) {
    const result = { attempted: false, ok: true, errors: [] };
    if (remoteConfigured.supabase) {
      result.attempted = true;
      try { await sendToSupabase(record, file); } catch (e) { result.ok = false; result.errors.push(e.message); }
    }
    if (remoteConfigured.formspree) {
      result.attempted = true;
      try { await sendToFormspree(record, file, message); } catch (e) { result.ok = false; result.errors.push(e.message); }
    }
    return result;
  }

  let channel = "email";
  const submitBtns = $$('button[type="submit"]', form);
  submitBtns.forEach(b => b.addEventListener("click", () => { channel = b.dataset.channel; }));

  function setStatus(msg, isError) {
    statusEl.hidden = !msg;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("is-error", !!isError);
  }

  function setBusy(busy) {
    submitBtns.forEach(b => {
      b.disabled = busy;
      const label = $("span", b) || b;
      if (busy && b.dataset.channel === channel) { b.dataset.label = label.textContent; label.textContent = "Preparando…"; }
      else if (!busy && b.dataset.label) { label.textContent = b.dataset.label; delete b.dataset.label; }
    });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("");
    setBusy(true);

    try {
      const d = new FormData(form);
      const file = fileInput.files[0] || null;
      const record = {
        fecha: new Date().toISOString(),
        nombre: d.get("nombre").trim(),
        tipo: d.get("tipo") || "Tatuaje personalizado",
        idea: d.get("idea").trim(),
        zona: d.get("zona"),
        tamano: Number(d.get("tamano")),
        ciudad: "CDMX",
        telefono: d.get("telefono").trim(),
        canal: channel,
        estado: "Pendiente",
        imagen: file ? await fileToDataUrl(file) : null,
        imagenNombre: file ? file.name : "",
        referenciaUrl: "",
        sync: "local"
      };

      const message0 = buildEmailBody(record);
      const remote = await sendRemote(record, file, message0);
      record.sync = !remote.attempted ? "local" : remote.ok ? "remoto" : "error";

      try { await DB.add(record); } catch (err) { console.warn("No se pudo guardar localmente", err); }

      const body = buildEmailBody(record);
      lastStructuredMessage = body;
      showSuccess(record, body, remote);

      if (channel === "copy") {
        try { await navigator.clipboard.writeText(body); $("#copySummary").textContent = "Texto copiado ✓"; } catch {}
      } else {
        window.location.href = mailtoUrl(record, body);
      }
    } catch (err) {
      console.error(err);
      setStatus("Ocurrió un error al procesar tu solicitud. Intenta de nuevo.", true);
    } finally {
      setBusy(false);
    }
  });

  const success = $("#quoteSuccess");
  function showSuccess(record, body, remote) {
    $("#successMail").href = mailtoUrl(record, body);
    $("#successPreview").textContent = body;
    $("#copySummary").textContent = "Copiar texto del correo";
    $("#successMsg").textContent = remote.attempted && remote.ok
      ? `Tu solicitud fue recibida por el estudio y también preparada para enviar a ${CONFIG.email}.`
      : `Tu ficha quedó estructurada y guardada. Si tu app de correo no se abrió automáticamente, ábrela abajo o copia el texto para enviarlo a ${CONFIG.email}.`;
    const warn = $("#successWarn");
    warn.hidden = !(remote.attempted && !remote.ok);
    if (!warn.hidden) warn.textContent = "No pudimos sincronizar en línea, pero tu correo prellenado sigue listo para enviarse.";
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("#copySummary").addEventListener("click", async () => {
    if (!lastStructuredMessage) return;
    try {
      await navigator.clipboard.writeText(lastStructuredMessage);
      $("#copySummary").textContent = "Texto copiado ✓";
    } catch {
      $("#copySummary").textContent = "Selecciona y copia el bloque";
    }
  });

  $("#newQuote").addEventListener("click", () => {
    form.reset();
    fileInput.dispatchEvent(new Event("change"));
    success.hidden = true;
    form.hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ==========================================================
     MODALES + PANEL DE ADMINISTRACIÓN ("ESTUDIO // PIN")
     ========================================================== */
  const pinModal = $("#pinModal");
  const adminModal = $("#adminModal");
  const zoom = $("#zoom");
  let modalFocus = null;

  function anyModalOpen(ignoreLightbox) {
    return [pinModal, adminModal].some(m => !m.hidden) || (!ignoreLightbox && !lb.hidden);
  }

  function openModal(m) {
    modalFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(() => m.classList.add("is-open"));
  }
  function closeModal(m) {
    m.classList.remove("is-open");
    setTimeout(() => { m.hidden = true; if (!anyModalOpen()) document.body.classList.remove("no-scroll"); }, 300);
    if (modalFocus) modalFocus.focus();
  }

  [pinModal, adminModal].forEach(m => {
    m.addEventListener("click", e => { if (e.target === m || e.target.hasAttribute("data-close")) closeModal(m); });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (!zoom.hidden) zoom.hidden = true;
      else if (!adminModal.hidden) closeModal(adminModal);
      else if (!pinModal.hidden) closeModal(pinModal);
      else if (!lb.hidden) lbClose();
    }
    if (!lb.hidden && modalsClosed()) {
      if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      if (e.key === "ArrowRight") lbShow(lbIndex + 1);
    }
  });
  const modalsClosed = () => pinModal.hidden && adminModal.hidden;

  zoom.addEventListener("click", () => { zoom.hidden = true; });

  const pinForm = $("#pinForm");
  const pinInput = $("#pinInput");
  const pinError = $("#pinError");
  let unlocked = false, fails = 0, lockedUntil = 0;

  $("#adminOpen").addEventListener("click", () => {
    if (unlocked) { openAdmin(); return; }
    pinInput.value = ""; pinError.textContent = "";
    openModal(pinModal);
    setTimeout(() => pinInput.focus(), 120);
  });

  pinForm.addEventListener("submit", e => {
    e.preventDefault();
    const now = Date.now();
    if (now < lockedUntil) {
      pinError.textContent = `Demasiados intentos. Espera ${Math.ceil((lockedUntil - now) / 1000)} s.`;
      return;
    }
    if (pinInput.value === String(CONFIG.adminPin)) {
      unlocked = true; fails = 0;
      closeModal(pinModal);
      setTimeout(openAdmin, 320);
    } else {
      fails++;
      pinError.textContent = "PIN incorrecto.";
      pinInput.value = "";
      const panel = pinModal.firstElementChild;
      panel.classList.remove("shake"); void panel.offsetWidth; panel.classList.add("shake");
      if (fails >= 5) { lockedUntil = Date.now() + 30000; fails = 0; pinError.textContent = "Demasiados intentos. Espera 30 s."; }
    }
  });

  const adminBody = $("#adminBody");
  const adminEmpty = $("#adminEmpty");
  const adminSummary = $("#adminSummary");
  let adminRecords = [];
  let adminFilter = "all";
  const STATUSES = ["Pendiente", "Cotizada", "Agendada"];

  async function openAdmin() {
    $("#adminNote").textContent = (remoteConfigured.supabase || remoteConfigured.formspree)
      ? "Mostrando solicitudes guardadas en este navegador. Las remotas se consultan en tu Formspree / Supabase."
      : "Modo local: las solicitudes se guardan en IndexedDB de este navegador. Configura Formspree o Supabase en CONFIG para respaldo en línea.";
    openModal(adminModal);
    await loadAdmin();
  }

  async function loadAdmin() {
    adminRecords = (await DB.all()).sort((a, b) => b.fecha.localeCompare(a.fecha));
    renderAdmin();
  }

  const fmtDate = iso => new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

  function replyAction(r) {
    const contact = String(r.telefono || "").trim();
    const subj = `Re: Solicitud de proyecto · Stan Leeray (@${CONFIG.instagram})`;
    const text = `Hola ${r.nombre},\n\nGracias por escribir al estudio de Stan Leeray (@${CONFIG.instagram}) respecto a tu proyecto (${r.tipo || "obra a medida"} · ${r.zona} · ${r.tamano} cm).\n\n`;
    if (contact.includes("@")) {
      return `<a class="iconbtn iconbtn--mail" href="mailto:${encodeURIComponent(contact)}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(text)}">Responder</a>`;
    }
    const digits = contact.replace(/\D/g, "");
    if (digits.length >= 10) {
      const phone = digits.length === 10 ? "52" + digits : digits;
      return `<a class="iconbtn iconbtn--mail" href="https://wa.me/${phone}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">WhatsApp</a>`;
    }
    return `<a class="iconbtn iconbtn--mail" href="mailto:${CONFIG.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(buildEmailBody(r))}">Reenviar</a>`;
  }

  function renderAdmin() {
    const counts = STATUSES.reduce((o, s) => (o[s] = adminRecords.filter(r => r.estado === s).length, o), {});
    adminSummary.textContent = `${adminRecords.length} en total · ${counts.Pendiente} pendientes · ${counts.Cotizada} cotizadas · ${counts.Agendada} agendadas`;
    const list = adminRecords.filter(r => adminFilter === "all" || r.estado === adminFilter);
    adminEmpty.hidden = list.length > 0;
    adminEmpty.textContent = adminRecords.length ? "No hay solicitudes con este estado." : "Aún no hay solicitudes en este navegador.";

    adminBody.innerHTML = list.map(r => {
      const projectType = r.tipo || r.estilo || "";
      return `
      <tr data-id="${r.id}">
        <td data-label="Fecha"><span class="admin__sub">${esc(fmtDate(r.fecha))}</span></td>
        <td data-label="Cliente">
          <div class="admin__name">${esc(r.nombre)}</div>
          <div class="admin__sub">${esc(r.ciudad)}${r.telefono ? " · " + esc(r.telefono) : ""}</div>
        </td>
        <td data-label="Proyecto">
          ${projectType ? `<div class="admin__style">${esc(projectType)}</div>` : ""}
          <div class="admin__idea">${esc(r.idea)}</div>
          <div class="admin__sub">${esc(r.zona)} · ${esc(r.tamano)} cm</div>
        </td>
        <td data-label="Referencia">
          ${r.imagen
            ? `<img class="admin__thumb" src="${r.imagen}" alt="Referencia de ${esc(r.nombre)}" data-zoom>`
            : r.referenciaUrl
              ? `<a class="iconbtn" href="${esc(r.referenciaUrl)}" target="_blank" rel="noopener">Ver imagen</a>`
              : `<span class="admin__none">—</span>`}
        </td>
        <td data-label="Estado">
          <select class="status" data-v="${esc(r.estado)}" data-status aria-label="Estado de la solicitud">
            ${STATUSES.map(s => `<option${s === r.estado ? " selected" : ""}>${s}</option>`).join("")}
          </select>
        </td>
        <td data-label="Acciones">
          <div class="admin__actions">
            ${replyAction(r)}
            <button class="iconbtn iconbtn--del" type="button" data-del>Eliminar</button>
          </div>
        </td>
      </tr>`;
    }).join("");
  }

  adminBody.addEventListener("change", async e => {
    const sel = e.target.closest("[data-status]");
    if (!sel) return;
    const id = +sel.closest("tr").dataset.id;
    const rec = adminRecords.find(r => r.id === id);
    if (!rec) return;
    rec.estado = sel.value;
    sel.dataset.v = sel.value;
    await DB.put(rec);
    renderAdmin();
  });

  adminBody.addEventListener("click", async e => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    const id = +tr.dataset.id;
    if (e.target.closest("[data-zoom]")) {
      $("#zoomImg").src = e.target.closest("[data-zoom]").src;
      zoom.hidden = false;
    }
    if (e.target.closest("[data-del]")) {
      const rec = adminRecords.find(r => r.id === id);
      if (rec && confirm(`¿Eliminar la solicitud de ${rec.nombre}? Esta acción no se puede deshacer.`)) {
        await DB.remove(id);
        await loadAdmin();
      }
    }
  });

  $$("#adminFilters .chip").forEach(chip => chip.addEventListener("click", () => {
    adminFilter = chip.dataset.status;
    $$("#adminFilters .chip").forEach(c => c.classList.toggle("is-active", c === chip));
    renderAdmin();
  }));

  $("#adminExport").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(adminRecords, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `solicitudes-stan-leeray-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $("#adminLock").addEventListener("click", () => { unlocked = false; closeModal(adminModal); });
})();
