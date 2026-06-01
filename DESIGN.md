# The Budget Aesthetic — Design System (Deep Dark Mode)

This document maps the official visual styling guidelines, layout structures, and Tailwind v4 theme mapping tokens for "The Budget Aesthetic" affiliate blogging platform.

---

## 1. Color Palette System

The design uses a high-contrast **Deep Dark Mode** layout featuring vibrant neon accents to highlight pricing information, affiliate buttons, and categories.

| Token | CSS Variable | Hex Value | Primary Purpose |
|---|---|---|---|
| **Base Background** | `--color-bg-base` | `#000000` | Full viewport body canvas |
| **Panel Surface** | `--color-bg-panel` | `#09090b` | Cards, sidebars, dashboard panels, and modals |
| **Primary Text (Ink)** | `--color-text-ink` | `#f7f5f0` | Dominant text color (bone white) |
| **Secondary Text (Slate)**| `--color-text-slate`| `#8a8f98` | Muted descriptions, metadata, and dates |
| **Neon Teal Accent** | `--color-neon-teal` | `#00f0ff` | Action hovering, code elements, electric highlights |
| **Neon Pink Accent** | `--color-neon-pink` | `#ff007f` | Visual alerts, brand contrast overlays |
| **Neon Green Accent** | `--color-neon-green`| `#00ff66` | Conversion rate increases, analytics green lights |
| **Warm Gold/Amber** | `--color-amber` | `#e8a842` | Star ratings, badges, premium borders |

---

## 2. Typography Scales

| Family Type | Font Name | Font Stack | Usage |
|---|---|---|---|
| **Display** | `Syne` | `'Syne', sans-serif` | Headers, page titles, prices, hero text |
| **Body / Technical**| `DM Mono` | `'DM Mono', monospace` | Excerpts, post metadata, product tags, legal links |
| **Editorial** | `Instrument Serif`| `'Instrument Serif', Georgia, serif` | Quote blocks, post-intro commentary (italicized) |

---

## 3. Layout, Paddings & Borders

- **Border Radius Standards**:
  - Small Elements (Badges, Tags): `4px` / `8px`
  - Medium Elements (Buttons, Inputs): `999px` (fully round pills)
  - Cards / Content Blocks: `16px` (`2xl`) / `32px` (`4xl`) / `40px` (`5xl`)
- **Spacing Constants**:
  - Masonry Column Gap: `1.5rem` (`6` tailwind spacing units)
  - Card Inner Padding: `1rem` (`4` tailwind spacing units)
  - Section Spacing: `3rem` to `6rem`
