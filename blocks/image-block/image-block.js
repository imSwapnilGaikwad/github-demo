import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Field row order (matches models[].fields order in _image-block.json):
 *   Row 0 — style       (multiselect; variant class names applied to block, when present)
 *   Row 1 — image       (reference, field-collapsed with imageAlt → <picture><img>)
 *   Row 2 — caption     (text)
 *   Row 3 — overlayText (text)
 *
 * When no style field in content: 3 rows — image, caption, overlayText.
 * Note: imageAlt is collapsed into the <img alt=""> by EDS field-collapse.
 */

/**
 * Checks whether the block carries the lazy-loaded variant.
 * EDS lazy-loads all images by default; this variant explicitly sets
 * loading="lazy" and also uses IntersectionObserver for the
 * fade-in reveal effect on browsers that need it.
 * @param {HTMLElement} block
 * @returns {boolean}
 */
function isLazyLoaded(block) {
  return block.classList.contains('lazy-loaded');
}

/**
 * Sets up an IntersectionObserver fade-in reveal for lazy-loaded variant.
 * The image starts transparent and transitions to full opacity once it
 * enters the viewport — giving a smooth perceived-performance feel.
 * @param {HTMLElement} figure
 * @param {HTMLImageElement} img
 */
function setupLazyReveal(figure, img) {
  // Add the pre-reveal state class before the image is visible
  figure.classList.add('image-block-figure--pending');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Trigger the CSS transition to full opacity
        figure.classList.remove('image-block-figure--pending');
        figure.classList.add('image-block-figure--revealed');
        obs.disconnect();
      });
    },
    { rootMargin: '0px 0px 120px 0px' }
  );

  // Guard: observe the figure; fall back gracefully if already decoded
  if (img.complete) {
    figure.classList.remove('image-block-figure--pending');
    figure.classList.add('image-block-figure--revealed');
  } else {
    observer.observe(figure);
    // Ensure reveal fires even if IntersectionObserver misses the load event
    img.addEventListener('load', () => {
      figure.classList.remove('image-block-figure--pending');
      figure.classList.add('image-block-figure--revealed');
      observer.disconnect();
    }, { once: true });
  }
}

/**
 * Builds the overlay text element layered on top of the image.
 * @param {string} text
 * @returns {HTMLElement}
 */
function buildOverlay(text) {
  const overlay = document.createElement('div');
  overlay.className = 'image-block-overlay';

  const p = document.createElement('p');
  p.className = 'image-block-overlay-text';
  p.textContent = text;

  overlay.append(p);
  return overlay;
}

/** Variant class names from the style field (must match _image-block.json options). */
const VARIANT_CLASSES = new Set([
  'full-width', 'rounded-corners', 'lazy-loaded', 'zoom-on-hover',
]);

function applyStyleRow(block, styleRow) {
  if (!styleRow) return;
  const cell = styleRow.querySelector('div:last-child');
  const raw = cell?.textContent?.trim() || '';
  raw.split(/[\s,]+/).forEach((token) => {
    const cls = token.toLowerCase().replace(/\s+/g, '-');
    if (cls && VARIANT_CLASSES.has(cls)) block.classList.add(cls);
  });
}

export default function decorate(block) {
  const column = block.firstElementChild;
  if (!column) return;

  const columnRows = [...column.children];
  const directRows = [...block.children];
  const rows = columnRows.length >= 3 ? columnRows : directRows;

  if (!rows.length) return;

  const hasStyleRow = rows.length >= 4;
  const styleRow = hasStyleRow ? rows[0] : null;
  const imageRow = hasStyleRow ? rows[1] : rows[0];
  const captionRow = hasStyleRow ? rows[2] : rows[1];
  const overlayRow = hasStyleRow ? rows[3] : rows[2];

  if (styleRow) {
    applyStyleRow(block, styleRow);
    styleRow.remove();
  }

  // ── Image (Row 0) ────────────────────────────────────────────────
  // Guard: image row must exist and contain a <picture> element.
  // Without an image this block has no meaningful content to render.
  const picture = imageRow ? imageRow.querySelector('picture') : null;
  if (!picture) {
    // Remove the block entirely to avoid broken empty layout
    block.closest('.section')?.classList.add('image-block-section--empty');
    block.textContent = '';
    return;
  }

  const img = picture.querySelector('img');

  // Guard: img must exist inside picture before we try to optimize it
  if (!img) {
    block.textContent = '';
    return;
  }

  // Resolve responsive widths based on variant
  const isFullWidth = block.classList.contains('full-width');
  const widths = isFullWidth
    ? [{ media: '(min-width: 900px)', width: '1600' }, { width: '800' }]
    : [{ media: '(min-width: 900px)', width: '1200' }, { media: '(min-width: 600px)', width: '800' }, { width: '480' }];

  // createOptimizedPicture generates WebP <source> elements + fallback <img>
  const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, widths);
  const optimizedImg = optimizedPic.querySelector('img');

  // Migrate Universal Editor instrumentation from original img to optimized img
  moveInstrumentation(img, optimizedImg);

  // Apply loading strategy: lazy-loaded variant uses explicit lazy + fade reveal,
  // otherwise use eager for above-the-fold images (full-width hero treatment)
  if (isLazyLoaded(block)) {
    optimizedImg.setAttribute('loading', 'lazy');
  } else if (isFullWidth) {
    // Full-width images are typically above the fold — load eagerly
    optimizedImg.setAttribute('loading', 'eager');
    optimizedImg.setAttribute('fetchpriority', 'high');
  } else {
    optimizedImg.setAttribute('loading', 'lazy');
  }

  // ── Build <figure> ───────────────────────────────────────────────
  const figure = document.createElement('figure');
  figure.className = 'image-block-figure';
  const instrumentSource = columnRows.length >= 3 ? column : imageRow;
  if (instrumentSource) moveInstrumentation(instrumentSource, figure);

  // ── Image wrapper (handles zoom and overlay positioning) ─────────
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'image-block-image-wrapper';
  imageWrapper.append(optimizedPic);

  // ── Overlay Text (Row 2) ─────────────────────────────────────────
  // Overlay sits inside the image wrapper so it positions over the image
  if (overlayRow) {
    const overlayText = overlayRow.textContent.trim();
    if (overlayText) {
      const overlay = buildOverlay(overlayText);
      imageWrapper.append(overlay);
    }
    // Always remove the raw row — content moved or empty
    overlayRow.remove();
  }

  figure.append(imageWrapper);

  // ── Caption (Row 1) ──────────────────────────────────────────────
  if (captionRow) {
    const captionText = captionRow.textContent.trim();
    if (captionText) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'image-block-caption';
      figcaption.textContent = captionText;
      figure.append(figcaption);
    }
    // Always remove the raw row — content moved or field was empty
    captionRow.remove();
  }

  // ── Lazy reveal fade-in ──────────────────────────────────────────
  if (isLazyLoaded(block)) {
    setupLazyReveal(figure, optimizedImg);
  }

  // Replace all EDS-generated column content with the semantic figure
  block.replaceChildren(figure);
}