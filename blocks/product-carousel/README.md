
# Product Carousel

A horizontally scrollable product showcase carousel with color swatches, pricing, and CTA buttons — styled after Apple's product line-up layout.

## Block Type
Interactive

## Authoring (Universal Editor)

Add the **Product Carousel** block to any section. Fill in the block-level heading and compare link, then add one **Product Carousel Item** per product. Each item accepts a product image, optional badge, name, description, pricing, CTA links, and comma-separated hex color values for the swatch dots.

## Fields

### Block-level fields
| Field            | Type        | Description                                   |
|------------------|-------------|-----------------------------------------------|
| heading          | text        | Main heading displayed above the carousel     |
| compare-link     | aem-content | URL for the "Compare all models" link         |
| compare-linkText | text        | Visible label for the compare link            |

### Item-level fields
| Field             | Type        | Description                                              |
|-------------------|-------------|----------------------------------------------------------|
| product-image     | reference   | Hero image for the product card                          |
| badge-text        | text        | Optional badge label (e.g. "New"); leave empty if none   |
| product-name      | text        | Product name (e.g. iPhone 17 Pro)                        |
| description       | richtext    | Short tagline or description                             |
| price-primary     | text        | Main price line (e.g. From ₹134900.00‡)                 |
| price-secondary   | text        | Monthly price line (e.g. or ₹21650.00/mo. for 6 mo.‡‡) |
| cta-primary       | aem-content | URL for the primary CTA button                           |
| cta-primaryText   | text        | Label for the primary CTA button (e.g. Learn more)       |
| cta-secondary     | aem-content | URL for the secondary CTA link                           |
| cta-secondaryText | text        | Label for the secondary CTA link (e.g. Buy)              |
| color-swatches    | text        | Comma-separated hex values for color dots                |

## Block Items
Each **Product Carousel Item** represents one product card in the carousel. Items repeat horizontally and are scrollable. Authors can add as many items as needed.

## Variants
No variants.

## Dependencies
- `../../scripts/scripts.js` → `moveInstrumentation`

## Content

```json
{
  "heading": "Explore the line-up.",
  "compare-link": "https://www.apple.com/in/shop/buy-iphone/compare",
  "compare-linkText": "Compare all models ›",
  "_itemCount": 4,
  "_items": [
    {
      "product-image": "iPhone 17 Pro product hero image",
      "badge-text": "",
      "product-name": "iPhone 17 Pro",
      "description": "<p>Innovative design for ultimate performance and battery life.</p>",
      "price-primary": "From ₹134900.00‡",
      "price-secondary": "or ₹21650.00/mo. for 6 mo.‡‡",
      "cta-primary": "https://www.apple.com/in/iphone-17-pro/",
      "cta-primaryText": "Learn more",
      "cta-secondary": "https://www.apple.com/in/shop/buy-iphone/iphone-17-pro",
      "cta-secondaryText": "Buy ›",
      "color-swatches": "#e8a87c,#3a3a3c,#f5f5f7"
    },
    {
      "product-image": "iPhone Air product hero image",
      "badge-text": "",
      "product-name": "iPhone Air",
      "description": "<p>The thinnest iPhone ever. With the power of pro inside.</p>",
      "price-primary": "From ₹119900.00‡",
      "price-secondary": "or ₹19150.00/mo. for 6 mo.‡‡",
      "cta-primary": "https://www.apple.com/in/iphone-air/",
      "cta-primaryText": "Learn more",
      "cta-secondary": "https://www.apple.com/in/shop/buy-iphone/iphone-air",
      "cta-secondaryText": "Buy ›",
      "color-swatches": "#f5f5f7,#f5e642,#b8d4e8,#4a7fb5,#1d1d1f"
    },
    {
      "product-image": "iPhone 17 product hero image",
      "badge-text": "",
      "product-name": "iPhone 17",
      "description": "<p>Even more delightful. Even more durable.</p>",
      "price-primary": "From ₹82900.00‡",
      "price-secondary": "or ₹14468.00/mo. for 6 mo.‡‡",
      "cta-primary": "https://www.apple.com/in/iphone-17/",
      "cta-primaryText": "Learn more",
      "cta-secondary": "https://www.apple.com/in/shop/buy-iphone/iphone-17",
      "cta-secondaryText": "Buy ›",
      "color-swatches": "#c8b8d8,#8a9a5b,#4a9a8a,#4a7fb5,#2d2d2d"
    },
    {
      "product-image": "iPhone 17e product hero image",
      "badge-text": "New",
      "product-name": "iPhone 17e",
      "description": "<p>Feature stacked. Value packed.</p>",
      "price-primary": "From ₹64900.00‡",
      "price-secondary": "or ₹11327.00/mo. for 6 mo.‡‡",
      "cta-primary": "https://www.apple.com/in/iphone-17e/",
      "cta-primaryText": "Learn more",
      "cta-secondary": "https://www.apple.com/in/shop/buy-iphone/iphone-17e",
      "cta-secondaryText": "Buy ›",
      "color-swatches": "#f4a7b9,#f5f5f7,#1d1d1f"
    }
  ]
}
```
  