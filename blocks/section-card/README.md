
# Section Card

A structural block that displays a main section heading followed by a grid of feature cards, each containing an icon, title, and description.

## Block Type
Structural

## Authoring (Universal Editor)
Authors can add a main title for the section, and then add multiple "Section Card Item" components. Each item allows uploading an icon (image or SVG), setting a title, and providing a short description.

## Fields
| Field | Type     | Description |
|-------|----------|-------------|
| title | richtext | Main heading for the section. Supports line breaks. |

## Block Items
**Section Card Item**
| Field       | Type      | Description |
|-------------|-----------|-------------|
| icon        | reference | Icon image or SVG for the feature. |
| iconAlt     | text      | Accessible description for the icon. |
| title       | text      | Title of the feature. |
| description | richtext  | Short description of the feature. |

## Variants
No variants.

## Dependencies
`moveInstrumentation` from `../../scripts/scripts.js`
