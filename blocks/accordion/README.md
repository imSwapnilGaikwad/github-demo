
# Accordion Image

A two-column interactive block featuring a stacked accordion list on the left and a contextual image panel on the right that updates when each accordion item is activated.

## Block Type
Interactive

## Authoring (Universal Editor)

Add the **Accordion Image** block to a section and set the block-level **Heading** field. Then add one **Accordion Item** child for each topic, providing a title, body description, and a panel image. The first item is expanded by default on load. Clicking an open item will collapse it; clicking a closed item will open it and swap the image panel.

## Fields

### Block-level fields
| Field | Type | Description |
|-------|------|-------------|
| heading | text | Large heading displayed above the accordion card |

### Item-level fields
| Field | Type | Description |
|-------|------|-------------|
| item-title | text | Accordion trigger label shown in the collapsed/expanded row |
| item-body | richtext | Expanded description text shown when this item is open |
| item-image | reference | Image displayed in the right panel when this accordion item is active |
| item-imageAlt | text | Accessible alt text for the panel image (field-collapsed with item-image) |

## Block Items

Repeating `accordion-item` children — one per topic. Each item has a title, body text, and an associated panel image. Only one item can be open at a time (single-select accordion). The first item is open by default. Clicking an already-open item will collapse it.

## Variants

No variants.

## Dependencies

- `moveInstrumentation` from `../../scripts/scripts.js`

## Content

```json
{
  "heading": "Significant others.",
  "_itemCount": 3,
  "_items": [
    {
      "item-title": "iPhone and Mac",
      "item-body": "<p>With iPhone Mirroring, you can view your iPhone screen on your Mac and control it without picking up your phone. Continuity features also let you answer calls or messages right from your Mac. You can even copy images, video or text from your iPhone and paste it all into a different app on your Mac. And with iCloud, you can access your files from either device.</p>",
      "item-image": "/assets/accordion/iphone-mac.jpg",
      "item-imageAlt": "iPhone and MacBook showing iPhone Mirroring feature"
    },
    {
      "item-title": "iPhone and Apple Watch",
      "item-body": "<p>iPhone and Apple Watch work together seamlessly, keeping you connected and informed throughout your day. Unlock your Mac with your Apple Watch, or use it to approve app requests without typing your password.</p>",
      "item-image": "/assets/accordion/iphone-watch.jpg",
      "item-imageAlt": "iPhone and Apple Watch side by side"
    },
    {
      "item-title": "iPhone and AirPods",
      "item-body": "<p>AirPods connect instantly to your iPhone and deliver an immersive listening experience. Adaptive Audio continuously tailors noise control to your environment so you always hear what matters most.</p>",
      "item-image": "/assets/accordion/iphone-airpods.jpg",
      "item-imageAlt": "iPhone and AirPods Pro on a surface"
    }
  ]
}
```
