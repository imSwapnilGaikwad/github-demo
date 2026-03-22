
import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const VARIANTS = ['fade', 'slide'];

function getColumns(block) {
  const children = [...block.children];
  return children.length === 1 && children[0].children.length > 1
    ? [...children[0].children]
    : children;
}

function animateCards(ul, variant) {
  const cards = ul.querySelectorAll('.cards-card');
  if (!cards.length) return;

  if (variant === 'slide') {
    // Slide animation: scroll behavior
    ul.style.scrollBehavior = 'smooth';
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 100);
    });
  } else {
    // Fade animation: sequential reveal
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, index * 200);
    });
  }
}

export default function decorate(block) {
  const cols = getColumns(block);
  if (!cols.length) return;

  // Handle style (variant) column
  let variant = '';
  if (cols[0] && VARIANTS.some(v => cols[0].textContent.trim().includes(v))) {
    cols[0].textContent.trim().split(/[\s,]+/).forEach(token => {
      if (VARIANTS.includes(token)) {
        block.classList.add(token);
        variant = token;
      }
    });
    cols.shift();
  }

  const ul = document.createElement('ul');
  ul.className = 'cards-list';

  cols.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-card';
    moveInstrumentation(row, li);

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);

  // Trigger animation after DOM is ready
  setTimeout(() => animateCards(ul, variant), 100);
}
