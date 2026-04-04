
import { moveInstrumentation } from '../../scripts/scripts.js';

function getColumns(block) {
  const children = [...block.children];
  return children.length === 1 && children[0].children.length > 1
    ? [...children[0].children]
    : children;
}

function getCell(el) {
  const divs = el.querySelectorAll(':scope > div');
  return divs.length ? divs[divs.length - 1] : el;
}

export default function decorate(block) {
  const cols = getColumns(block);
  if (!cols.length) return;

  // ── LAYER 1: Data Extraction ─────────────────────────────────────────────
  // Block has 2 field columns: heading (text) + compare-link (aem-content)
  const BLOCK_FIELD_COUNT = 2;
  const fieldCols = cols.slice(0, BLOCK_FIELD_COUNT);
  const itemCols = cols.slice(BLOCK_FIELD_COUNT);

  // Block-level: heading (text)
  const headingCell = fieldCols[0] ? getCell(fieldCols[0]) : null;
  const headingText = headingCell ? headingCell.textContent.trim() : '';

  // Block-level: compare-link (aem-content → <a> element)
  const compareLinkCell = fieldCols[1] ? getCell(fieldCols[1]) : null;
  const compareLinkEl = compareLinkCell ? compareLinkCell.querySelector('a') : null;

  // Per-item data — row indices match model field order
  const items = itemCols.map((col) => {
    const rows = [...col.children];

    // row 0 → product-image (reference → <picture>)
    const picture = rows[0] ? rows[0].querySelector('picture') : null;

    // row 1 → badge-text (text)
    const badgeText = rows[1] ? rows[1].textContent.trim() : '';

    // row 2 → product-name (text)
    const productName = rows[2] ? rows[2].textContent.trim() : '';

    // row 3 → description (richtext — move child nodes)
    const descRow = rows[3] || null;

    // row 4 → price-primary (text)
    const pricePrimary = rows[4] ? rows[4].textContent.trim() : '';

    // row 5 → price-secondary (text)
    const priceSecondary = rows[5] ? rows[5].textContent.trim() : '';

    // row 6 → cta-primary (aem-content → <a>)
    const ctaPrimaryEl = rows[6] ? rows[6].querySelector('a') : null;

    // row 7 → cta-secondary (aem-content → <a>)
    const ctaSecondaryEl = rows[7] ? rows[7].querySelector('a') : null;

    // row 8 → color-swatches (text — comma-separated hex values)
    const swatchColors = rows[8]
      ? rows[8].textContent.trim().split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    return {
      _col: col,
      picture,
      badgeText,
      productName,
      descRow,
      pricePrimary,
      priceSecondary,
      ctaPrimaryEl,
      ctaSecondaryEl,
      swatchColors,
    };
  });

  // ── LAYER 2: Structure Building ──────────────────────────────────────────

  // Header row
  const header = document.createElement('div');
  header.className = 'product-carousel-header';
  moveInstrumentation(fieldCols[0], header);

  const h2 = document.createElement('h2');
  h2.className = 'product-carousel-heading';
  h2.textContent = headingText;
  header.appendChild(h2);

  if (compareLinkEl) {
    const compareWrapper = document.createElement('div');
    compareWrapper.className = 'product-carousel-compare';
    compareLinkEl.className = 'product-carousel-compare-link';
    compareWrapper.appendChild(compareLinkEl);
    header.appendChild(compareWrapper);
  }

  // Carousel viewport — clips overflow
  const viewport = document.createElement('div');
  viewport.className = 'product-carousel-viewport';

  // Track — the scrollable flex row
  const track = document.createElement('div');
  track.className = 'product-carousel-track';
  track.setAttribute('role', 'list');

  items.forEach(({
    _col,
    picture,
    badgeText,
    productName,
    descRow,
    pricePrimary,
    priceSecondary,
    ctaPrimaryEl,
    ctaSecondaryEl,
    swatchColors,
  }) => {
    const card = document.createElement('article');
    card.className = 'product-carousel-card';
    card.setAttribute('role', 'listitem');
    moveInstrumentation(_col, card);

    // Product image
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'product-carousel-card-image';
    if (picture) {
      const img = picture.querySelector('img');
      if (img) img.loading = 'lazy';
      imgWrapper.appendChild(picture);
    }
    card.appendChild(imgWrapper);

    // Color swatches
    if (swatchColors.length) {
      const swatchesEl = document.createElement('div');
      swatchesEl.className = 'product-carousel-swatches';
      swatchColors.forEach((color, i) => {
        const dot = document.createElement('button');
        dot.className = 'product-carousel-swatch';
        if (i === 0) dot.classList.add('active');
        dot.style.backgroundColor = color;
        dot.setAttribute('aria-label', `Color option ${i + 1}`);
        dot.setAttribute('type', 'button');
        swatchesEl.appendChild(dot);
      });
      card.appendChild(swatchesEl);
    }

    // Badge
    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = 'product-carousel-badge';
      badge.textContent = badgeText;
      card.appendChild(badge);
    }

    // Product name
    const nameEl = document.createElement('h3');
    nameEl.className = 'product-carousel-name';
    nameEl.textContent = productName;
    card.appendChild(nameEl);

    // Description (richtext — move all child nodes)
    if (descRow) {
      const descEl = document.createElement('div');
      descEl.className = 'product-carousel-desc';
      while (descRow.firstChild) descEl.appendChild(descRow.firstChild);
      card.appendChild(descEl);
    }

    // Pricing
    const pricingEl = document.createElement('div');
    pricingEl.className = 'product-carousel-pricing';
    if (pricePrimary) {
      const p1 = document.createElement('p');
      p1.className = 'product-carousel-price-primary';
      p1.textContent = pricePrimary;
      pricingEl.appendChild(p1);
    }
    if (priceSecondary) {
      const p2 = document.createElement('p');
      p2.className = 'product-carousel-price-secondary';
      p2.textContent = priceSecondary;
      pricingEl.appendChild(p2);
    }
    card.appendChild(pricingEl);

    // CTAs
    const ctaWrapper = document.createElement('div');
    ctaWrapper.className = 'product-carousel-ctas';
    if (ctaPrimaryEl) {
      ctaPrimaryEl.className = 'product-carousel-btn-primary';
      ctaWrapper.appendChild(ctaPrimaryEl);
    }
    if (ctaSecondaryEl) {
      ctaSecondaryEl.className = 'product-carousel-btn-secondary';
      ctaWrapper.appendChild(ctaSecondaryEl);
    }
    card.appendChild(ctaWrapper);

    track.appendChild(card);
  });

  viewport.appendChild(track);

  // Navigation arrows — placed OUTSIDE the viewport so they are never clipped
  const nav = document.createElement('div');
  nav.className = 'product-carousel-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'product-carousel-arrow product-carousel-arrow-prev';
  prevBtn.setAttribute('aria-label', 'Previous products');
  prevBtn.setAttribute('type', 'button');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'product-carousel-arrow product-carousel-arrow-next';
  nextBtn.setAttribute('aria-label', 'Next products');
  nextBtn.setAttribute('type', 'button');
  nextBtn.innerHTML = '&#8250;';

  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);

  // ── LAYER 3: DOM Swap ────────────────────────────────────────────────────
  const inner = document.createElement('div');
  inner.className = 'product-carousel-inner';
  inner.appendChild(header);
  inner.appendChild(viewport);
  inner.appendChild(nav);

  block.appendChild(inner);
  cols.forEach((col) => col.remove());

  // ── Interaction Logic ────────────────────────────────────────────────────

  /**
   * Returns the pixel width of one card + gap so arrows scroll exactly one card.
   */
  function getScrollAmount() {
    const card = track.querySelector('.product-carousel-card');
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    return card.offsetWidth + gap;
  }

  /**
   * Sync disabled state of both arrows based on current scroll position.
   */
  function updateArrows() {
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
    prevBtn.setAttribute('aria-disabled', String(atStart));
    nextBtn.setAttribute('aria-disabled', String(atEnd));
  }

  // Arrow click handlers — scroll the TRACK, not the viewport
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  // Update arrows whenever the track scrolls
  track.addEventListener('scroll', updateArrows, { passive: true });

  // Keyboard arrow support on the track
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    }
  });

  // Set initial arrow state after the browser has laid out the cards
  requestAnimationFrame(() => {
    requestAnimationFrame(updateArrows);
  });

  // Re-evaluate on resize (card widths change at breakpoints)
  const resizeObserver = new ResizeObserver(() => {
    updateArrows();
  });
  resizeObserver.observe(track);
}
  