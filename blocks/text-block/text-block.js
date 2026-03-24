import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Field row order (matches models[].fields order in _text-block.json):
 *   Row 0 — style     (multiselect; when present, variant classes applied to block)
 *   Row 1 — eyebrow   (text)
 *   Row 2 — heading   (text)
 *   Row 3 — body      (richtext)
 *   Row 4 — pullQuote (richtext)
 *
 * When no style row: 4 rows — eyebrow, heading, body, pullQuote.
 */
const VARIANT_CLASSES = new Set([
  'single-column', 'centered', 'two-column', 'drop-cap', 'pull-quote', 'large-display',
]);

function applyStyleRow(block, styleRow) {
  if (!styleRow) return;
  const cell = styleRow.querySelector('div:last-child') || styleRow;
  const raw = (cell?.textContent || '').trim();
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
  const rows = columnRows.length >= 4 ? columnRows : directRows;

  if (!rows.length) return;

  const hasStyleRow = rows.length >= 5;
  const styleRow = hasStyleRow ? rows[0] : null;
  const eyebrowRow = hasStyleRow ? rows[1] : rows[0];
  const headingRow = hasStyleRow ? rows[2] : rows[1];
  const bodyRow = hasStyleRow ? rows[3] : rows[2];
  const pullQuoteRow = hasStyleRow ? rows[4] : rows[3];

  if (styleRow) {
    applyStyleRow(block, styleRow);
    styleRow.remove();
  }

  // Content parent: column when nested, block when flat (rows as direct children)
  const contentParent = columnRows.length >= 4 ? column : block;

  // ── Eyebrow (Row 0) ──────────────────────────────────────────────
  // The eyebrow is plain text; wrap its content in a <span> so CSS
  // can style it independently without relying on bare tag selectors.
  if (eyebrowRow) {
    const eyebrowText = eyebrowRow.textContent.trim();

    if (eyebrowText) {
      const span = document.createElement('span');
      span.className = 'text-block-eyebrow';
      moveInstrumentation(eyebrowRow, span);
      span.textContent = eyebrowText;

      // Inject the eyebrow span above the heading so the DOM order
      // matches visual rendering — heading row becomes the natural anchor.
      if (headingRow) {
        headingRow.parentElement.insertBefore(span, headingRow);
      } else {
        // Fallback: no heading row present, prepend to content parent
        contentParent.prepend(span);
      }

      // Remove the original plain row — its content was moved to span
      eyebrowRow.remove();
    } else {
      // Empty eyebrow field — remove to avoid ghost spacing
      eyebrowRow.remove();
    }
  }

  // ── Heading (Row 1) ──────────────────────────────────────────────
  // Add a semantic class so CSS can scope heading styles without
  // relying on nth-child positional selectors (fragile after DOM edits).
  if (headingRow) {
    const hasContent = headingRow.textContent.trim() || headingRow.querySelector('h1, h2, h3, h4, h5, h6');
    if (hasContent) {
      headingRow.classList.add('text-block-heading');
    } else {
      // Empty heading field — remove to avoid layout gaps
      headingRow.remove();
    }
  }

  // ── Body (Row 2) ─────────────────────────────────────────────────
  // Add a semantic class required by the drop-cap CSS variant
  // (targets `.text-block-body > p:first-of-type::first-letter`).
  if (bodyRow) {
    const hasContent = bodyRow.textContent.trim() || bodyRow.querySelector('img, picture');
    if (hasContent) {
      bodyRow.classList.add('text-block-body');
    } else {
      bodyRow.remove();
    }
  }

  // ── Pull Quote (Row 3) ───────────────────────────────────────────
  // Promote the pull quote row into a styled <blockquote> so it
  // renders with the correct semantic element and CSS hook.
  if (pullQuoteRow) {
    const hasContent = pullQuoteRow.textContent.trim();
    if (hasContent) {
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'text-block-pull-quote';
      moveInstrumentation(pullQuoteRow, blockquote);

      // Move all child nodes (richtext may contain <p>, <strong>, etc.)
      while (pullQuoteRow.firstChild) {
        blockquote.append(pullQuoteRow.firstChild);
      }

      // Replace the raw row with the semantic blockquote
      pullQuoteRow.replaceWith(blockquote);
    } else {
      // Empty pull quote field — remove to avoid ghost spacing
      pullQuoteRow.remove();
    }
  }
}