# Landing Page Architect Skill

This local capability manages the visual layout, typography structure, and information hierarchy across the core landing page, single article routes, and compliance pages.

## Layout Architecture & Guidelines

### 1. Mobile-First Masonry Grid (`index.astro`)
- **Pinterest Referrals**: To optimize for vertical Pinterest referral cards, the home feed must implement a CSS column masonry or a responsive grid layout.
- **Card Constraints**: Every blog post card must render an eye-catching vertical cover (2:3 aspect ratio), category tag, title, published date, and description excerpt.
- **Glassmorphism**: Use semi-transparent dark panels (`rgba(9,9,11,0.65)`) with precise borders (`1px solid rgba(255,255,255,0.08)`) and high-performance blur filters to fit the premium dark style.

### 2. Single Article Structure (`blog/[slug].astro`)
- **Cover Visuals**: Render the large vertical `heroImage` with subtle overlays and rounded corners.
- **Editorial Typography**: Balance reading experience using `Syne` for headings, `DM Mono` for metadata, and highly readable fonts for post content body.
- **Sanity Integrations**: Query via structured GROQ, resolving references for categories, internal product arrays, and parsing block content with custom PortableText renders.
- **Inline Products**: Dynamically inject `ProductCard.astro` elements inside the post body query when referencing recommended affiliate items.

### 3. Compliance and Footer Links
- **Compliance Nodes**: Create `privacy.astro` and `terms.astro` using a clean, dark-themed structure with high-contrast text.
- **Global Footer**: Construct `Footer.astro` as a reusable component at the bottom of the page layout. Include navigation rows, branding, copyright statements, and links to terms, privacy, and disclosure pages.
