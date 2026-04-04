
import { moveInstrumentation } from '../../scripts/scripts.js';

function getColumns(block) {
  const children = [...block.children];
  return children.length === 1 && children[0].children.length > 1
    ? [...children[0].children]
    : children;
}

const CHEVRON_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const CHEVRON_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`;

export default function decorate(block) {
  const cols = getColumns(block);
  if (!cols.length) return;

  // ── LAYER 1: Data Extraction ─────────────────────────────────────────────
  // Block has 1 block-level field (heading), remaining cols are items
  const BLOCK_FIELD_COUNT = 1;
  const headingCol = cols[0];
  const itemCols = cols.slice(BLOCK_FIELD_COUNT);

  // Read block-level heading (text field → textContent)
  const headingText = headingCol?.textContent?.trim() ?? '';

  // Read per-item data
  const items = itemCols.map((col) => {
    const rows = [...col.children];
    // row 0: item-title (text)
    // row 1: item-body (richtext)
    // row 2: item-image + item-imageAlt (reference, field-collapsed → <picture>)
    const titleRow = rows[0] ?? null;
    const bodyRow = rows[1] ?? null;
    const imageRow = rows[2] ?? null;

    return {
      title: titleRow?.textContent?.trim() ?? '',
      bodyRow,
      picture: imageRow?.querySelector('picture') ?? null,
      _col: col,
    };
  });

  // ── LAYER 2: Structure Building ──────────────────────────────────────────

  // Block heading (above card)
  const headingEl = document.createElement('h2');
  headingEl.className = 'accordion-heading';
  moveInstrumentation(headingCol, headingEl);
  headingEl.textContent = headingText;

  // Card container (holds accordion list + image panel side by side on desktop)
  const card = document.createElement('div');
  card.className = 'accordion-card';

  // Left: accordion list
  const accordionList = document.createElement('div');
  accordionList.className = 'accordion-list';
  accordionList.setAttribute('role', 'list');

  // Right: image panel
  const imagePanel = document.createElement('div');
  imagePanel.className = 'accordion-image-panel';
  imagePanel.setAttribute('aria-live', 'polite');

  // Track image slide wrappers for toggling active state
  const imageSlides = [];

  // Opening top divider
  const topDivider = document.createElement('hr');
  topDivider.className = 'accordion-divider';
  accordionList.appendChild(topDivider);

  items.forEach((item, index) => {
    const isFirst = index === 0;

    // Accordion item wrapper
    const itemEl = document.createElement('div');
    itemEl.className = 'accordion-item';
    if (isFirst) itemEl.classList.add('is-open');
    itemEl.setAttribute('role', 'listitem');
    moveInstrumentation(item._col, itemEl);

    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'accordion-trigger';
    trigger.setAttribute('type', 'button');
    trigger.setAttribute('aria-expanded', isFirst ? 'true' : 'false');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'accordion-trigger-title';
    titleSpan.textContent = item.title;

    const chevron = document.createElement('span');
    chevron.className = 'accordion-chevron';
    chevron.innerHTML = isFirst ? CHEVRON_UP : CHEVRON_DOWN;

    trigger.appendChild(titleSpan);
    trigger.appendChild(chevron);

    // Panel (collapsible body)
    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    if (!isFirst) panel.setAttribute('hidden', '');

    if (item.bodyRow) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'accordion-body';
      // richtext: move all child nodes (text nodes + inline elements)
      while (item.bodyRow.firstChild) bodyEl.append(item.bodyRow.firstChild);
      panel.appendChild(bodyEl);
    }

    itemEl.appendChild(trigger);
    itemEl.appendChild(panel);
    accordionList.appendChild(itemEl);

    // Divider after each item
    const divider = document.createElement('hr');
    divider.className = 'accordion-divider';
    accordionList.appendChild(divider);

    // Image slide for this item
    if (item.picture) {
      const slide = document.createElement('div');
      slide.className = 'accordion-image-slide';
      if (isFirst) slide.classList.add('is-active');
      slide.appendChild(item.picture);
      imagePanel.appendChild(slide);
      imageSlides.push(slide);
    } else {
      imageSlides.push(null);
    }
  });

  card.appendChild(accordionList);
  card.appendChild(imagePanel);

  // ── LAYER 3: DOM Swap ────────────────────────────────────────────────────
  block.append(headingEl, card);
  cols.forEach((col) => col.remove());

  // ── Interaction ──────────────────────────────────────────────────────────
  const allItems = [...accordionList.querySelectorAll('.accordion-item')];
  const allTriggers = [...accordionList.querySelectorAll('.accordion-trigger')];

  function openItem(idx) {
    // Close all items first
    allItems.forEach((el, i) => {
      el.classList.remove('is-open');
      allTriggers[i].setAttribute('aria-expanded', 'false');
      allTriggers[i].querySelector('.accordion-chevron').innerHTML = CHEVRON_DOWN;
      const panel = el.querySelector('.accordion-panel');
      if (panel) panel.setAttribute('hidden', '');
      if (imageSlides[i]) imageSlides[i].classList.remove('is-active');
    });

    // Open the target item
    allItems[idx].classList.add('is-open');
    allTriggers[idx].setAttribute('aria-expanded', 'true');
    allTriggers[idx].querySelector('.accordion-chevron').innerHTML = CHEVRON_UP;
    const targetPanel = allItems[idx].querySelector('.accordion-panel');
    if (targetPanel) targetPanel.removeAttribute('hidden');
    if (imageSlides[idx]) imageSlides[idx].classList.add('is-active');
  }

  allTriggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', () => {
      const isOpen = allItems[idx].classList.contains('is-open');
      // Toggle: if already open, close it; otherwise open it
      if (isOpen) {
        allItems[idx].classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.querySelector('.accordion-chevron').innerHTML = CHEVRON_DOWN;
        const panel = allItems[idx].querySelector('.accordion-panel');
        if (panel) panel.setAttribute('hidden', '');
        if (imageSlides[idx]) imageSlides[idx].classList.remove('is-active');
      } else {
        openItem(idx);
      }
    });
  });
}
