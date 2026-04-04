
# Social Media Cards

A responsive 4-up card grid displaying article or post previews with a thumbnail image, bold title, social sharing icons (WhatsApp, Twitter, Facebook), a body excerpt, and a READ MORE link.

## Block Type
Structural

## Authoring (Universal Editor)

Add the **Social Media Cards** block to a section. Insert one **Social Media Card Item** child per card. Each item requires a thumbnail image, title, body excerpt, and a destination link. Social share URLs are auto-generated from the card link in JavaScript — no separate share URL fields are needed.

## Fields

### Item-level fields (one item per card)
| Field | Type | Description |
|-------|------|-------------|
| card-image | reference | Thumbnail image shown at the top of the card |
| card-imageAlt | text | Accessible alt text for the thumbnail (field-collapsed with card-image) |
| card-title | text | Bold article or post title (truncated at 2 lines via CSS) |
| card-body | richtext | Short excerpt shown below the social share icons (truncated at 4 lines) |
| card-link | aem-content | Destination URL for the READ MORE link and social share base |
| card-linkText | text | Visible label for the READ MORE link (defaults to "READ MORE") |

## Block Items

Repeating `cards-2-item` children — one per card. Each item contains an image, title, body text, and a link. Social share icons (WhatsApp, Twitter, Facebook) are rendered automatically using the card link as the share URL.

## Variants

No variants.

## Dependencies

- `moveInstrumentation` from `../../scripts/scripts.js`

## Image Analysis

# Social Media Cards Block — Developer Analysis

---

## Layout Blueprint

- **Overall layout pattern:** CSS Grid — 4 equal columns, horizontal row
- **Number of visual sections/rows:** 1 row of 4 cards
- **Alignment:** Cards are top-aligned, content left-aligned within each card
- **Spacing rhythm:** ~16–20px gap between cards; ~16px internal padding per card
- **Responsive behavior:** Stack to 2 columns on tablet, 1 column on mobile (standard card collapse)

---

## Component Identification

- **Block type:** `cards` (social-media-cards variant)
- **Sub-components per card:**
  - Thumbnail image (top, rounded corners, light blue background)
  - Card title (bold, dark blue, 2–3 lines, truncated with ellipsis)
  - Social share icons row (WhatsApp, Twitter/X, Facebook — colored icons)
  - Body text / excerpt (gray, 3–4 lines, truncated with ellipsis)
  - "READ MORE" CTA link (blue, centered, uppercase)
- **Number of repeating items:** 4 cards

---

## Authoring Model (Field Suggestions)

### Block-level fields
| Field | Type | Description |
|-------|------|-------------|
| `heading` | `text` | Optional section heading above the card grid |

### Item-level fields
| Field | Type | Description |
|-------|------|-------------|
| `card-image` | `reference` | Thumbnail image displayed at the top of the card |
| `card-image-alt` | `text` | Alt text for the thumbnail image |
| `card-title` | `text` | Bold title of the article/post (truncated at ~2 lines) |
| `card-body` | `richtext` | Short excerpt/description text below social icons |
| `card-link` | `aem-content` | URL the card (and READ MORE) links to |
| `whatsapp-share-url` | `text` | WhatsApp share URL (auto-generated or authored) |
| `twitter-share-url` | `text` | Twitter/X share URL |
| `facebook-share-url` | `text` | Facebook share URL |

---

## Column Map

EDS authored table (each row = one card):

```
Column 0 → card-image (reference)
Column 1 → card-title (text)
Column 2 → card-body (richtext)
Column 3 → card-link (aem-content)
```

> Social share URLs are auto-generated from `card-link` in JS (no separate authored column needed).

---

## OCR Content Inventory

### Card 1
- **Title:** "Buying Your First Vehicle? Here's How a Two-Wheeler Loa…"
- **Body:** "Purchasing your first two-wheeler offers practical benefits such as improved mobility, the flexibility to travel at your convenience, and…"
- **CTA:** READ MORE

### Card 2
- **Title:** "Loan Against Property: Access More Funds at Lower Rates"
- **Body:** "When you need a significant amount of money for personal or business needs, finding the right financing option can make all the…"
- **CTA:** READ MORE

### Card 3
- **Title:** "Unlock the Value of Your Land: Loan Against Property & Land…"
- **Body:** "If you are a land owner who is considering converting the land into capital, then you don't have to stress."
- **CTA:** READ MORE

### Card 4
- **Title:** "Loan Against Property From HDBFS: Eligibility, Rates &…"
- **Body:** "Did you know the global real estate loan market is forecasted to grow from around USD 11.4 trillion in 2024 to USD 35.4 trillion by 2034…"
- **CTA:** READ MORE

### Social Icons (all cards)
- WhatsApp icon (green)
- Twitter/X icon (blue)
- Facebook icon (blue)

---

## Visual Design Tokens

| Token | Value |
|-------|-------|
| Card background | `#FFFFFF` |
| Page/section background | `#F0F4FF` (very light blue-gray) |
| Card border | `1px solid #D6E4F7` or subtle shadow |
| Card border-radius | `12px` |
| Box shadow | `0 2px 8px rgba(0,0,0,0.08)` |
| Image area background | `#C8DEFF` (light blue) |
| Image border-radius (top) | `10px 10px 0 0` |
| Title color | `#1A3C6E` (dark navy blue) |
| Title font size | `~15px` / `0.94rem` |
| Title font weight | `700` (bold) |
| Body text color | `#555555` / `#666666` |
| Body font size | `~13px` / `0.81rem` |
| Body font weight | `400` (regular) |
| CTA "READ MORE" color | `#1A6FD4` (medium blue) |
| CTA font size | `~13px` |
| CTA font weight | `600` (semibold) |
| CTA alignment | `center` |
| WhatsApp icon color | `#25D366` (green) |
| Twitter icon color | `#1DA1F2` (blue) |
| Facebook icon color | `#1877F2` (blue) |
| Social icon size | `~24px` |
| Social icons gap | `~8px` |
| Card internal padding | `~16px` |
| Grid gap | `~16–20px` |
| Card image height | `~160px` |

---

## Interaction Hints

- **Static layout** with hover states expected on cards (subtle shadow lift or border highlight)
- **Social share icons** open platform share dialogs on click (new tab)
- **"READ MORE"** navigates to the full article page
- **Title truncation:** CSS `line-clamp: 2` with ellipsis
- **Body truncation:** CSS `line-clamp: 3–4` with ellipsis
- No carousel/slider behavior visible — static 4-up grid
- Possible hover: card shadow deepens, title color shifts slightly

## Content

```json
{
  "_itemCount": 4,
  "_items": [
    {
      "card-image": "/assets/cards-2/two-wheeler-loan.jpg",
      "card-imageAlt": "Salesperson showing a red motorcycle to a customer",
      "card-title": "Buying Your First Vehicle? Here's How a Two-Wheeler Loan Can Help",
      "card-body": "<p>Purchasing your first two-wheeler offers practical benefits such as improved mobility, the flexibility to travel at your convenience, and more.</p>",
      "card-link": "https://example.com/two-wheeler-loan",
      "card-linkText": "READ MORE"
    },
    {
      "card-image": "/assets/cards-2/loan-against-property.jpg",
      "card-imageAlt": "Hand holding a house model with coins",
      "card-title": "Loan Against Property: Access More Funds at Lower Rates",
      "card-body": "<p>When you need a significant amount of money for personal or business needs, finding the right financing option can make all the difference.</p>",
      "card-link": "https://example.com/loan-against-property",
      "card-linkText": "READ MORE"
    },
    {
      "card-image": "/assets/cards-2/land-loan.jpg",
      "card-imageAlt": "House with percentage sign and coins representing property value",
      "card-title": "Unlock the Value of Your Land: Loan Against Property & Land",
      "card-body": "<p>If you are a land owner who is considering converting the land into capital, then you don't have to stress.</p>",
      "card-link": "https://example.com/land-loan",
      "card-linkText": "READ MORE"
    },
    {
      "card-image": "/assets/cards-2/hdbfs-lap.jpg",
      "card-imageAlt": "Person holding a money bag next to miniature house models",
      "card-title": "Loan Against Property From HDBFS: Eligibility, Rates & More",
      "card-body": "<p>Did you know the global real estate loan market is forecasted to grow from around USD 11.4 trillion in 2024 to USD 35.4 trillion by 2034?</p>",
      "card-link": "https://example.com/hdbfs-lap",
      "card-linkText": "READ MORE"
    }
  ]
}
```
