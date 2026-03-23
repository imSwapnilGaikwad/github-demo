
import { moveInstrumentation } from '../../scripts/scripts.js';

const VARIANTS = ['dark', 'compact'];

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

  // Apply variants (style field)
  if (cols[0] && VARIANTS.some(v => cols[0].textContent.trim().includes(v))) {
    cols[0].textContent.trim().split(/[\s,]+/).forEach(token => {
      if (VARIANTS.includes(token)) block.classList.add(token);
    });
    cols.shift();
  }

  // Block-level fields: section-label, section-heading, section-subtitle
  const [labelCol, headingCol, subtitleCol, ...itemCols] = cols;
  const headerEl = document.createElement('header');
  headerEl.className = 'banefits-card-header';
  moveInstrumentation(labelCol, headerEl);

  // Section label
  if (labelCol) {
    const labelEl = document.createElement('div');
    labelEl.className = 'banefits-card-label';
    labelEl.textContent = labelCol.textContent.trim();
    headerEl.appendChild(labelEl);
  }

  // Section heading (richtext)
  if (headingCol) {
    const headingEl = document.createElement('h2');
    headingEl.className = 'banefits-card-heading';
    const headingCell = getCell(headingCol);
    while (headingCell.firstChild) headingEl.append(headingCell.firstChild);
    headerEl.appendChild(headingEl);
  }

  // Section subtitle (richtext)
  if (subtitleCol) {
    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'banefits-card-subtitle';
    const subtitleCell = getCell(subtitleCol);
    while (subtitleCell.firstChild) subtitleEl.append(subtitleCell.firstChild);
    headerEl.appendChild(subtitleEl);
  }

  // Grid for benefit cards
  const gridEl = document.createElement('div');
  gridEl.className = 'banefits-card-grid';
  moveInstrumentation(itemCols[0], gridEl);

  // Process each benefit card item
  itemCols.forEach((itemCol, index) => {
    const cardEl = document.createElement('article');
    cardEl.className = 'banefits-card';
    moveInstrumentation(itemCol, cardEl);

    const cardInner = document.createElement('div');
    cardInner.className = 'banefits-card-inner';

    // Item fields: [icon, title, body]
    const [iconRow, titleRow, bodyRow] = [...itemCol.children];

    // Icon (reference field)
    if (iconRow?.querySelector('picture, svg')) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'banefits-card-icon';
      const iconEl = iconRow.querySelector('picture, svg');
      if (iconEl) {
        moveInstrumentation(iconEl, iconWrapper);
        iconWrapper.appendChild(iconEl);
      }
      cardInner.appendChild(iconWrapper);
    }

    // Number (auto-generated from index)
    const numEl = document.createElement('div');
    numEl.className = 'banefits-card-num';
    numEl.textContent = String(index + 1).padStart(2, '0');
    cardInner.appendChild(numEl);

    // Title (text field)
    if (titleRow) {
      const titleEl = document.createElement('h3');
      titleEl.className = 'banefits-card-title';
      moveInstrumentation(titleRow, titleEl);
      titleEl.textContent = titleRow.textContent.trim();
      cardInner.appendChild(titleEl);
    }

    // Body (richtext field)
    if (bodyRow) {
      const bodyEl = document.createElement('div');
      bodyEl.className = 'banefits-card-body';
      moveInstrumentation(bodyRow, bodyEl);
      while (bodyRow.firstChild) bodyEl.append(bodyRow.firstChild);
      cardInner.appendChild(bodyEl);
    }

    cardEl.appendChild(cardInner);
    gridEl.appendChild(cardEl);
  });

  // Append new structure and remove old columns
  block.append(headerEl, gridEl);
  cols.forEach(col => col.remove());
}
