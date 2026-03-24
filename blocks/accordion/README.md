
# Accordion

A collapsible content block that allows users to expand and collapse sections of content.

## Block Type
Interactive

## Authoring (Universal Editor)
Add an Accordion block to your section. Configure the section heading and add multiple Accordion Items. Each item has a title and rich text content. Use the "Expanded by Default" toggle to control initial state.

## Fields
| Field          | Type      | Description                                      |
|----------------|-----------|--------------------------------------------------|
| heading        | text      | Main heading for the accordion section           |
| style          | multiselect | Visual variant (Default, Minimal, Bordered)    |

## Block Items
**Accordion Item** - Repeating child items with these fields:
| Field          | Type      | Description                                      |
|----------------|-----------|--------------------------------------------------|
| item-title     | text      | Title for this accordion item                    |
| item-body      | richtext  | Content for this accordion item                  |
| item-expanded  | boolean   | Should this item be expanded when page loads?    |

## Variants
- **Default**: Standard accordion with subtle borders
- **Minimal**: Clean design with only bottom borders
- **Bordered**: Stronger borders for visual separation

## Dependencies
- `moveInstrumentation` from '../../scripts/scripts.js'
