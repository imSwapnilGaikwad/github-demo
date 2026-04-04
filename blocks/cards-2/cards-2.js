
import { moveInstrumentation } from '../../scripts/scripts.js';

const WHATSAPP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path fill="#25D366" d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.428a.5.5 0 0 0 .609.61l5.627-1.476A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.878 9.878 0 0 1-5.031-1.374l-.36-.214-3.733.979.997-3.645-.235-.374A9.865 9.865 0 0 1 2.1 12C2.1 6.533 6.533 2.1 12 2.1c5.466 0 9.9 4.433 9.9 9.9 0 5.466-4.434 9.9-9.9 9.9z"/></svg>`;

const TWITTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#1DA1F2" d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723 9.99 9.99 0 0 1-3.127 1.195 4.929 4.929 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59l-.047-.02z"/></svg>`;

const FACEBOOK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`;

function getColumns(block) {
  const children = [...block.children];
  return children.length === 1 && children[0].children.length > 1
    ? [...children[0].children]
    : children;
}

function buildShareIcons(url) {
  const encodedUrl = encodeURIComponent(url || window.location.href);
  const icons = document.createElement('div');
  icons.className = 'cards-2-share';

  const platforms = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedUrl}`,
      svg: WHATSAPP_SVG,
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
      svg: TWITTER_SVG,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      svg: FACEBOOK_SVG,
    },
  ];

  platforms.forEach(({ name, href, svg }) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', `Share on ${name}`);
    a.innerHTML = svg;
    icons.appendChild(a);
  });

  return icons;
}

export default function decorate(block) {
  const cols = getColumns(block);
  if (!cols.length) return;

  // No block-level fields — all columns are item instances
  const BLOCK_FIELD_COUNT = 0;
  const itemCols = cols.slice(BLOCK_FIELD_COUNT);

  const grid = document.createElement('ul');
  grid.className = 'cards-2-grid';

  itemCols.forEach((col) => {
    const rows = [...col.children];

    // Row 0: card-image (reference, field-collapsed with card-imageAlt)
    const imageRow = rows[0];
    // Row 1: card-title (text)
    const titleRow = rows[1];
    // Row 2: card-body (richtext)
    const bodyRow = rows[2];
    // Row 3: card-link (aem-content, field-collapsed with card-linkText)
    const linkRow = rows[3];

    const li = document.createElement('li');
    li.className = 'cards-2-card';
    moveInstrumentation(col, li);

    // ── Image ──────────────────────────────────────────────────────────────
    const imageWrap = document.createElement('div');
    imageWrap.className = 'cards-2-image';
    const picture = imageRow?.querySelector('picture');
    if (picture) {
      imageWrap.appendChild(picture);
    }
    li.appendChild(imageWrap);

    // ── Card body wrapper ──────────────────────────────────────────────────
    const body = document.createElement('div');
    body.className = 'cards-2-body';

    // Title
    if (titleRow) {
      const h3 = document.createElement('h3');
      h3.className = 'cards-2-title';
      h3.textContent = titleRow.textContent.trim();
      body.appendChild(h3);
    }

    // Social share icons — derive URL from link row
    const anchor = linkRow?.querySelector('a');
    const href = anchor?.href || '';
    const shareIcons = buildShareIcons(href);
    body.appendChild(shareIcons);

    // Excerpt / body text
    if (bodyRow) {
      const excerpt = document.createElement('div');
      excerpt.className = 'cards-2-excerpt';
      while (bodyRow.firstChild) excerpt.appendChild(bodyRow.firstChild);
      body.appendChild(excerpt);
    }

    // READ MORE link
    if (href) {
      const readMore = document.createElement('a');
      readMore.className = 'cards-2-cta';
      readMore.href = href;
      readMore.textContent = anchor?.textContent?.trim() || 'READ MORE';
      body.appendChild(readMore);
    }

    li.appendChild(body);
    grid.appendChild(li);
  });

  // DOM swap — append new structure, then remove SSR columns
  block.appendChild(grid);
  cols.forEach((col) => col.remove());
}
