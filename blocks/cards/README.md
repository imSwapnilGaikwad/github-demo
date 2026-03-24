
# Cards

Display a collection of cards with optional animation effects.

## Block Type
Interactive

## Authoring (Universal Editor)
Add the Cards block to a section. Each card can contain an image and rich text. Use the Variant field to apply animation styles (Fade or Slide).

## Fields
| Field     | Type       | Description                          |
|-----------|------------|--------------------------------------|
| style     | multiselect | Animation variant (Fade, Slide)      |

## Block Items
Repeating child items of type "Card". Each card has:
- Image (reference)
- Text (richtext)

## Variants
- **Fade Animation**: Cards fade in sequentially
- **Slide Animation**: Cards slide in from the right with horizontal scrolling

## Dependencies
- `createOptimizedPicture` from '../../scripts/aem.js'
- `moveInstrumentation` from '../../scripts/scripts.js'
