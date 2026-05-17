# TheBudgetAesthetic — Production Affiliate Marketing Blog

A production-ready affiliate marketing blog built with **Astro 4 (SSR)**, **Sanity CMS**, **Tailwind CSS**, and deployed to **Vercel Edge**.

---

## Architecture Overview

```
thebudgetaesthetic/
├── astro.config.mjs              # Astro + Vercel adapter + Sanity integration
├── tailwind.config.mjs           # Design tokens, glassmorphism utilities
├── vercel.json                   # Deployment + caching headers
├── .env.example                  # All required environment variables
│
├── src/
│   ├── middleware.js             # ★ Edge Middleware: Geo-routing + security headers
│   ├── styles/global.css         # Tailwind + Google Fonts + custom utilities
│   │
│   ├── lib/
│   │   ├── sanity.js             # Sanity client, imageUrlBuilder, GROQ queries
│   │   └── affiliateUrl.js       # Geo-aware affiliate URL builder
│   │
│   ├── components/
│   │   ├── Navbar.astro          # Sticky glassmorphic nav + mobile hamburger
│   │   ├── PostCard.astro        # Pinterest 2:3 blog card
│   │   └── ProductCard.astro     # ★ High-converting affiliate product card
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro      # HTML shell + SEO meta + JSON-LD + footer
│   │
│   └── pages/
│       ├── index.astro           # Homepage: featured hero + masonry grid
│       ├── blog/
│       │   ├── index.astro       # Blog listing (masonry Pinterest layout)
│       │   └── [slug].astro      # ★ Dynamic blog post + products + share
│       ├── category/
│       │   └── [category].astro  # Category filtering
│       ├── disclosure.astro      # Affiliate disclosure (FTC compliance)
│       ├── 404.astro             # Custom 404
│       └── api/
│           └── sitemap.ts        # Dynamic XML sitemap
│
└── sanity/
    ├── sanity.config.js          # Embedded Studio config + RBAC
    └── schemas/
        ├── post.js               # ★ Full post schema with affiliate products
        ├── category.js           # Category schema
        └── index.js              # Schema barrel export
```

---

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd thebudgetaesthetic
npm install
```

### 2. Set up Sanity
```bash
# Create a new Sanity project at https://www.sanity.io/manage
# Then note your Project ID

cd sanity
npm install -g @sanity/cli
sanity login
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Fill in all values in .env
```

Required variables:
| Variable | Description |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID |
| `PUBLIC_SANITY_DATASET` | Usually `production` |
| `SANITY_API_TOKEN` | Read-only viewer token (from Sanity Manage > API) |
| `AMAZON_ASSOCIATE_ID_IN` | Your Amazon India affiliate tag (e.g. `store-in-21`) |
| `AMAZON_ASSOCIATE_ID_GLOBAL` | Your Amazon US/Global affiliate tag (e.g. `store-20`) |
| `PUBLIC_SITE_URL` | Your production URL |

### 4. Run Development Server
```bash
npm run dev
# App: http://localhost:4321
# Sanity Studio: http://localhost:4321/studio
```

---

## Security & Access Control

### Sanity RBAC Setup
1. Go to **Sanity Manage > Access > Roles**
2. Create a **Viewer** token → use as `SANITY_API_TOKEN` (public reads, never writes)
3. Create an **Editor** token → use only in Sanity Studio login (never exposed publicly)
4. In Studio, only authenticated Google accounts you invite can create/edit/delete posts

### Affiliate Link Security
- All `/go?url=...` redirects validate that the destination is an `amazon.*` domain
- Geo detection uses Vercel's `x-vercel-ip-country` header (injected at Edge, cannot be spoofed by client)
- Affiliate tags are server-side environment variables — never exposed in client JS

### Security Headers (applied by middleware.js)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Geo-Routing Flow

```
Visitor clicks "Check Price on Amazon"
        │
        ▼
GET /go?url=<encoded_amazon_url>
        │
        ▼
middleware.js (Vercel Edge — 0ms cold start)
        │
        ├── reads x-vercel-ip-country header
        │
        ├── country === "IN"?
        │     YES → inject tag = AMAZON_ASSOCIATE_ID_IN → redirect amazon.in
        │     NO  → inject tag = AMAZON_ASSOCIATE_ID_GLOBAL → redirect amazon.com
        │
        └── 302 Redirect to final Amazon URL with correct affiliate tag
```

The `tba_region` cookie also enables a client-side JS swap on product cards for instant UX without waiting for a network round-trip.

---

## Sanity Schema: `post`

```
post {
  title          String   (required, 10–100 chars)
  slug           Slug     (auto-generated from title)
  publishedAt    DateTime (required)
  updatedAt      DateTime
  excerpt        Text     (required, max 200 chars — used for Pinterest/SEO)
  heroImage      Image    (required, 2:3 ratio, with alt text + caption)
  categories     Reference[] → category
  content        PortableText (blocks + images + inline product cards)
  affiliateProducts[] {
    name          String
    productImage  Image (with alt)
    indiaLink     URL   (amazon.in — required)
    globalLink    URL   (amazon.com — required)
    price         Number
    currency      "INR" | "USD" | "GBP"
    rating        Number (0–5, 1 decimal)
    ratingCount   Number
    badge         String (e.g. "Best Seller", "#1 Pick")
  }
  seo {
    metaTitle       String (max 60 chars)
    metaDescription Text   (max 160 chars)
    ogImage         Image
    noIndex         Boolean
  }
}
```

---

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard:
# Project Settings > Environment Variables
# Add all variables from .env.example
```

### Vercel Environment Variables Checklist
- [ ] `PUBLIC_SANITY_PROJECT_ID`
- [ ] `PUBLIC_SANITY_DATASET`
- [ ] `SANITY_API_TOKEN`
- [ ] `AMAZON_ASSOCIATE_ID_IN`
- [ ] `AMAZON_ASSOCIATE_ID_GLOBAL`
- [ ] `PUBLIC_SITE_URL`

---

## Pinterest Optimisation

- Hero images rendered at **1000×1500px (2:3 ratio)** — the native Pinterest pin format
- All product images are **WebP** with quality 85 for fast load
- Blog listing uses **CSS columns masonry** (Pinterest-style grid)
- Rich Pin meta tags enabled via `<meta name="pinterest-rich-pin" content="true">`
- Each post has a **Pin It** share button pre-loaded with the hero image URL
- Open Graph images are 1200px wide for Pinterest's large card format

---

## FTC Compliance

- Affiliate disclosure banner on every blog post (auto-injected)
- `/disclosure` page with full Amazon Associates statement
- Product cards include micro-disclosure text
- `rel="sponsored"` on all affiliate links

---

## Performance Targets

| Metric | Target |
|---|---|
| LCP (hero image) | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| Edge middleware latency | < 5ms |
| Sanity CDN cache | 60s (production) |

---

## License
MIT — © TheBudgetAesthetic
