
import { moveInstrumentation } from '../../scripts/aem.js';

/**
 * Decoration logic
 *
 * Changes made vs previous implementation:
 * - Build semantic structure (content + media) in JS instead of styling raw SSR columns.
 * - Move instrumentation from SSR columns onto new semantic wrappers.
 * - Remove original SSR column/row divs after decoration so only the semantic tree remains.
 */
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

  // Block model has 4 fields: title, subtitle, ctaText, backgroundImage
  const [titleCol, subtitleCol, ctaCol, bgCol] = cols;

  // Root layout wrapper that mimics the inner container
  const inner = document.createElement('div');
  inner.className = 'banner-inner';
  moveInstrumentation(block, inner);

  // Content column
  const content = document.createElement('div');
  content.className = 'banner-content';

  // Title (richtext)
  if (titleCol) {
    const titleCell = getCell(titleCol);
    const heading = document.createElement('h2');
    heading.className = 'banner-title';
    while (titleCell.firstChild) {
      heading.append(titleCell.firstChild);
    }
    content.append(heading);
  }

  // Subtitle (text)
  if (subtitleCol) {
    const subtitleCell = getCell(subtitleCol);
    const subtitle = document.createElement('p');
    subtitle.className = 'banner-subtitle';
    subtitle.textContent = subtitleCell.textContent.trim();
    content.append(subtitle);
  }

  // CTA button (text)
  if (ctaCol) {
    const ctaCell = getCell(ctaCol);
    const ctaText = ctaCell.textContent.trim();
    if (ctaText) {
      const ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'banner-cta-wrapper';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'banner-cta';
      button.textContent = ctaText;

      ctaWrapper.append(button);
      content.append(ctaWrapper);
    }
  }

  inner.append(content);

  // Background image column (optional)
  if (bgCol) {
    const media = document.createElement('div');
    media.className = 'banner-media';
    moveInstrumentation(bgCol, media);

    const bgCell = getCell(bgCol);
    const picture = bgCell.querySelector('picture, img');
    if (picture) {
      media.append(picture);
    }

    inner.append(media);
  }

  // Replace original SSR structure with semantic structure
  block.textContent = '';
  block.append(inner);
}
  