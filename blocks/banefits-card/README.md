
# Banefits Card

A structured benefits grid block that displays key features or advantages in animated, styled cards. Ideal for product pages, feature highlights, or comparison sections.

## Block Type
Structural

## Authoring (Universal Editor)
1. Add the **Banefits Card** block to a section.
2. Configure the **Section Label**, **Section Heading**, and **Section Subtitle** in the block properties.
3. Add **Banefits Card Item** components for each benefit. Each item includes an icon, title, and description.
4. Apply variants (e.g., Dark, Compact) via the **Variant** multiselect field.

## Fields

| Field             | Type      | Description                                                                 |
|-------------------|-----------|-----------------------------------------------------------------------------|
| section-label     | text      | Small label above the heading (e.g., "What you get").                       |
| section-heading   | richtext  | Main heading for the section (supports inline formatting like `<em>`).      |
| section-subtitle  | richtext  | Supporting text below the heading.                                          |
| style             | multiselect | Apply visual variants (Dark, Compact).                                    |

## Block Items

**Banefits Card Item** (repeating):
- **benefit-icon**: SVG or image icon for the benefit card.
- **benefit-title**: Short title for the benefit (e.g., "Financial Protection").
- **benefit-body**: Detailed description of the benefit.

## Variants

- **dark**: Dark background with light text.
- **compact**: Reduced padding and font sizes for denser layouts.

## Dependencies

- `moveInstrumentation` from `../../scripts/scripts.js`

## Hover Behavior

When a user hovers over a card:
- The icon disappears with a fade-out and upward motion
- The title text changes color to highlight it
- The number indicator also changes color for visual consistency
