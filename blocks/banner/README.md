
# Banner

A promotional banner block that highlights a key message with a subtitle, call-to-action button, and optional background image, styled to resemble the provided Tata Cards hero.

## Block Type
Structural

## Authoring (Universal Editor)
Add the **Banner** block to a section, then fill in the title, subtitle, and CTA text fields in the Properties panel. Optionally, provide a background image reference to display a hero image on the right side of the banner; if omitted, the block uses a gradient-only background. The CTA text is rendered as a button-shaped control; link behavior can be added later by wrapping the block in a link or wiring a click handler.

## Fields
| Field           | Type      | Description                                                                 |
|-----------------|-----------|-----------------------------------------------------------------------------|
| title           | richtext  | Main banner heading; supports basic formatting and line breaks.            |
| subtitle        | text      | Short supporting line displayed under the title.                           |
| ctaText         | text      | Visible label for the call-to-action button.                               |
| backgroundImage | reference | Optional background image shown on the right side of the banner layout.    |

## Block Items
No repeating items.

## Variants
No variants.

## Dependencies
| Utility            | Description                                      |
|--------------------|--------------------------------------------------|
| `moveInstrumentation` | Preserves authoring instrumentation on new semantic wrappers. |
  