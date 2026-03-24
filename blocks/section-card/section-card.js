
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // The first row is the block-level field (title).
  // The remaining rows are repeating items.
  const [titleRow, ...itemRows] = rows;

  const container = document.createElement('div');
  container.className = 'section-card__container';

  // 1. Build Header
  if (titleRow) {
    const header = document.createElement('header');
    header.className = 'section-card__header';
    moveInstrumentation(titleRow, header);

    const h2 = document.createElement('h2');
    h2.className = 'section-card__title';
    
    const titleCell = titleRow.firstElementChild || titleRow;
    // Move all richtext content (including <br> tags) into the h2
    while (titleCell.firstChild) {
      h2.append(titleCell.firstChild);
    }
    
    header.append(h2);
    container.append(header);
  }

  // 2. Build Feature List
  if (itemRows.length) {
    const ul = document.createElement('ul');
    ul.className = 'section-card__list';

    itemRows.forEach((row) => {
      const li = document.createElement('li');
      li.className = 'section-card-feature';
      moveInstrumentation(row, li);

      // Item fields in model order: icon (reference), title (text), description (richtext)
      const [iconCell, itemTitleCell, descCell] = [...row.children];

      // Icon
      if (iconCell) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'section-card-feature__icon';
        const pic = iconCell.querySelector('picture');
        if (pic) {
          iconDiv.append(pic);
        }
        li.append(iconDiv);
      }

      // Title
      if (itemTitleCell) {
        const h3 = document.createElement('h3');
        h3.className = 'section-card-feature__title';
        h3.textContent = itemTitleCell.textContent.trim();
        li.append(h3);
      }

      // Description
      if (descCell) {
        const descDiv = document.createElement('div');
        descDiv.className = 'section-card-feature__desc';
        // Move all richtext content into the description div
        while (descCell.firstChild) {
          descDiv.append(descCell.firstChild);
        }
        li.append(descDiv);
      }

      ul.append(li);
    });

    container.append(ul);
  }

  // Replace the lean SSR structure with the decorated semantic DOM
  block.replaceChildren(container);
}
