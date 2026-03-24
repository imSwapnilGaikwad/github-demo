
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

  // Handle style variants (first column if present)
  const VARIANTS = ['default', 'minimal', 'bordered'];
  if (cols[0] && VARIANTS.some(v => cols[0].textContent.trim().includes(v))) {
    cols[0].textContent.trim().split(/[\s,]+/).forEach(token => {
      if (VARIANTS.includes(token)) block.classList.add(token);
    });
    cols.shift();
  }

  // Block has 1 field (heading) → first column is block-level field
  const BLOCK_FIELD_COUNT = 1;
  const [headingCol, ...itemCols] = cols;

  // Create accordion container
  const accordion = document.createElement('div');
  accordion.className = 'accordion';

  // Add heading if present
  if (headingCol) {
    const headingEl = document.createElement('h2');
    headingEl.className = 'accordion-heading';
    moveInstrumentation(headingCol, headingEl);
    headingEl.textContent = headingCol.textContent.trim();
    accordion.appendChild(headingEl);
  }

  // Process each accordion item
  itemCols.forEach((itemCol) => {
    const [titleRow, bodyRow, expandedRow] = [...itemCol.children];
    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(itemCol, item);

    const header = document.createElement('button');
    header.className = 'accordion-header';
    header.setAttribute('aria-expanded', 'false');

    const title = document.createElement('span');
    title.className = 'accordion-title';
    if (titleRow) {
      moveInstrumentation(titleRow, title);
      title.textContent = titleRow.textContent.trim();
    }

    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.textContent = '+';

    header.append(title, icon);
    item.appendChild(header);

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.setAttribute('aria-hidden', 'true');

    if (bodyRow) {
      const body = document.createElement('div');
      body.className = 'accordion-body';
      moveInstrumentation(bodyRow, body);
      while (bodyRow.firstChild) body.append(bodyRow.firstChild);
      content.appendChild(body);
    }

    item.appendChild(content);

    // Check if item should be expanded by default
    if (expandedRow && expandedRow.textContent.trim().toLowerCase() === 'true') {
      header.setAttribute('aria-expanded', 'true');
      content.setAttribute('aria-hidden', 'false');
      icon.textContent = '−';
    }

    accordion.appendChild(item);
  });

  // Add event listeners for interactivity
  accordion.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;

    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const icon = header.querySelector('.accordion-icon');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    header.setAttribute('aria-expanded', !isExpanded);
    content.setAttribute('aria-hidden', isExpanded);
    icon.textContent = isExpanded ? '+' : '−';

    // Close other items if needed (optional)
    if (!isExpanded) {
      const allItems = accordion.querySelectorAll('.accordion-item');
      allItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherContent = otherItem.querySelector('.accordion-content');
          const otherIcon = otherItem.querySelector('.accordion-icon');
          otherHeader.setAttribute('aria-expanded', 'false');
          otherContent.setAttribute('aria-hidden', 'true');
          otherIcon.textContent = '+';
        }
      });
    }
  });

  block.appendChild(accordion);
  cols.forEach(col => col.remove());
}
