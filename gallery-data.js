/* ==========================================================================
   ARCHIVO CURATORIAL · Estudio Stan Leeray (@s.leeray) — CDMX, México
   --------------------------------------------------------------------------
   Obra mixta de autor: Tinta sobre piel e Ilustración original.

   PARA AGREGAR UNA PIEZA NUEVA:
     1. Copia la imagen a la carpeta ./img (ej. img/T28.png)
     2. Ejecuta .\scan-img.ps1 para obtener sus dimensiones exactas (w, h).
     3. Añade un bloque en GALLERY indicando si es "piel" o "grafica".

   Campos de cada pieza:
     src      → ruta de la imagen
     w, h     → ancho y alto exactos en píxeles (evita saltos de diseño)
     cat      → "piel" (tatuaje ejecutado) o "grafica" (dibujo / boceto original)
     label    → ficha técnica del soporte ("Tinta sobre piel" / "Ilustración original")
     alt      → descripción curatorial de la pieza (accesibilidad + lightbox)
     featured → false para excluirla del visor del hero y la cinta viva (opcional)
     hero     → true en la pieza con la que abre la rotación editorial del hero
   ========================================================================== */

window.GALLERY_CATEGORIES = {
  piel: "Piel",
  grafica: "Dibujo"
};

window.GALLERY = [
  /* Alternancia inicial curada entre piel y obra gráfica para el visor del Hero */
  {
    src: "img/T4.png", w: 676, h: 932, cat: "piel", label: "Tinta sobre piel", hero: true,
    alt: "Ajolote esquelético trazado en línea nerviosa y tinta negra sobre brazo"
  },

  {
    src: "img/T6.png", w: 713, h: 937, cat: "grafica", label: "Ilustración original",
    alt: "Estudio original en tinta sobre papel: figura esquelética envuelta en espirales continuas"
  },

  {
    src: "img/T13.png", w: 663, h: 908, cat: "piel", label: "Tinta sobre piel",
    alt: "Díptico simétrico Memento Mori y Memento Amare con cráneo y corazón floral en líneas orbitales"
  },

  {
    src: "img/T16.png", w: 696, h: 920, cat: "grafica", label: "Ilustración original",
    alt: "Boceto original en tinta negra: silueta temerosa proyectando una sombra monstruosa de trazo libre"
  },

  {
    src: "img/T26.png", w: 688, h: 826, cat: "piel", label: "Tinta sobre piel",
    alt: "Interpretación autoral de El Ángel Caído en espalda alta mediante líneas frenéticas de boceto"
  },

  {
    src: "img/T3.png", w: 691, h: 940, cat: "grafica", label: "Ilustración original",
    alt: "Estudio gráfico en tinta negra con acento cian y líneas estructurales de boceto"
  },

  {
    src: "img/T1.png", w: 686, h: 932, cat: "piel", label: "Tinta sobre piel",
    alt: "Perfil femenino entre botánica contenido en bucles orgánicos de línea continua sobre antebrazo"
  },

  {
    src: "img/T21.png", w: 695, h: 925, cat: "grafica", label: "Ilustración original",
    alt: "Composición ilustrada en tinta cruda con destellos en púrpura y carmesí sobre papel"
  },

  {
    src: "img/T22.png", w: 689, h: 909, cat: "piel", label: "Tinta sobre piel",
    alt: "Cráneo anatómico de T-Rex sobre pecho combinando líneas de construcción rojas y tinta negra"
  },

  {
    src: "img/T10.png", w: 703, h: 494, cat: "grafica", label: "Ilustración original",
    alt: "Boceto coral en tinta negra y garabato expresivo de múltiples figuras en perspectiva aérea"
  },

  {
    src: "img/T9.png", w: 644, h: 938, cat: "piel", label: "Tinta sobre piel",
    alt: "Escena urbana surrealista en antebrazo: figura de espaldas cargando una máscara entre líneas arquitectónicas"
  },

  {
    src: "img/T12.png", w: 668, h: 921, cat: "piel", label: "Tinta sobre piel",
    alt: "Pulpo de trazo fluido y líneas sueltas de alto contraste sobre brazo"
  },

  {
    src: "img/T8.png", w: 690, h: 898, cat: "piel", label: "Tinta sobre piel",
    alt: "Esqueleto alargado y composición de ojos oníricos en antebrazo con líneas nerviosas"
  },

  {
    src: "img/T20.png", w: 689, h: 882, cat: "piel", label: "Tinta sobre piel",
    alt: "Deidad barbada junto a un águila ejecutados en lenguaje de grabado y línea expresiva en hombro"
  },

  {
    src: "img/T23.png", w: 699, h: 869, cat: "piel", label: "Tinta sobre piel",
    alt: "Mirada de camaleón con achurado radial hipnótico en cara interna del brazo"
  },

  {
    src: "img/T27.png", w: 680, h: 879, cat: "piel", label: "Tinta sobre piel",
    alt: "Figura y lobo sobre pecho dejando visibles las líneas guía de boceto en rojo bajo la tinta negra"
  },

  {
    src: "img/T17.png", w: 668, h: 895, cat: "piel", label: "Tinta sobre piel",
    alt: "Bestia cornuda de trazo visceral y contraste denso sobre espalda"
  },

  {
    src: "img/T25.png", w: 671, h: 860, cat: "piel", label: "Tinta sobre piel",
    alt: "Catrina floral construida con trazo de grabado y línea libre sobre antebrazo"
  },

  {
    src: "img/T11.png", w: 674, h: 886, cat: "piel", label: "Tinta sobre piel",
    alt: "Cráneo orgánico descompuesto en filamentos anatómicos sobre pantorrilla"
  },

  {
    src: "img/T2.png", w: 688, h: 939, cat: "piel", label: "Tinta sobre piel",
    alt: "Querubín alado ejecutado en tinta carmesí con achurado crudo sobre brazo"
  },

  {
    src: "img/T5.png", w: 674, h: 922, cat: "piel", label: "Tinta sobre piel",
    alt: "Cordero ilustrativo atravesado por líneas radiales y trazo de boceto en antebrazo"
  },

  {
    src: "img/T15.png", w: 677, h: 896, cat: "piel", label: "Tinta sobre piel",
    alt: "Silueta con aguja y trazos orbitales minimalistas sobre pierna"
  },

  {
    src: "img/T14.png", w: 693, h: 919, cat: "piel", label: "Tinta sobre piel",
    alt: "Zorro de nueve colas con caligrafía en tinta negra y acentos rojos sobre antebrazo"
  },

  {
    src: "img/T18.png", w: 690, h: 895, cat: "piel", label: "Tinta sobre piel",
    alt: "Dragón enroscado trabajado en líneas continuas de boceto sobre muslo"
  },

  {
    src: "img/T7.png", w: 665, h: 877, cat: "piel", label: "Tinta sobre piel",
    alt: "Casco clásico en trazo abierto con líneas de encaje a mano alzada sobre brazo"
  },

  { src: "img/T24.png", w: 702, h: 881, cat: "piel",    label: "Tinta sobre piel",
    alt: "Criatura insectoide de trazos angulares agresivos y alto contraste sobre brazo" }
];
