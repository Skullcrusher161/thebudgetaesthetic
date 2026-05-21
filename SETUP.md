# TheBudget Aesthetic — Admin Panel Setup Guide

## What's Been Built

| File | Purpose |
|------|---------|
| `src/pages/admin/login.astro` | Login page (Google OAuth + email/password) |
| `src/pages/admin/dashboard.astro` | Dashboard with post stats |
| `src/pages/admin/posts/index.astro` | All posts list with search + delete |
| `src/pages/admin/posts/new.astro` | New post editor with rich text |
| `src/pages/admin/posts/edit/[id].astro` | Edit existing post |
| `src/pages/admin/analytics.astro` | Post views + affiliate click analytics |
| `src/components/admin/AdminLayout.astro` | Shared admin sidebar layout |
| `src/components/CookieBanner.astro` | GDPR/DPDPA cookie consent banner |
| `src/components/PostViewTracker.astro` | Post view tracking snippet |
| `src/pages/api/admin/auth/login.ts` | Email/password login handler |
| `src/pages/api/admin/auth/google.ts` | Google OAuth initiator |
| `src/pages/api/admin/auth/callback.ts` | Google OAuth callback |
| `src/pages/api/admin/auth/logout.ts` | Logout handler |
| `src/pages/api/admin/posts/save.ts` | Create new post |
| `src/pages/api/admin/posts/update.ts` | Update existing post |
| `src/pages/api/admin/posts/delete.ts` | Delete post |
| `src/pages/api/track-view.ts` | Track post page views |
| `src/pages/api/redirect/[...path].ts` | Affiliate redirect with click tracking |
| `middleware.js` | Auth guard for all /admin routes |
| `sanity/schemas/analyticsClick.js` | New Sanity schema: click tracking |
| `sanity/schemas/postView.js` | New Sanity schema: view tracking |
| `sanity/schemas/index.js` | Updated schema index |
| `sanity/sanity.config.mjs` | Updated Sanity Studio config |

---

## Step 1 — Copy Files Into Your Project

Copy each file from this package into your existing project, maintaining the same paths relative to your project root (`thebudgetaesthetic/`).

**REPLACE these existing files:**
- `middleware.js` (your existing one is replaced)
- `src/pages/api/redirect/[...path].astro` → replace with `.ts` version (delete the old `.astro`)
- `sanity/schemas/index.js` (extended version)
- `sanity/sanity.config.mjs` (extended version)

---

## Step 2 — Install Dependencies

```bash
npm install @sanity/client
```

Your project likely already has this. If not, run the above.

---

## Step 3 — Set Up Environment Variables

1. Open your root `.env` file
2. Add all variables from `.env.example`
3. Also add to `sanity/.env`:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

---

## Step 4 — Create Sanity Write Token

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Name: `Admin Write Token`
6. Permissions: **Editor**
7. Copy the token → paste into `SANITY_WRITE_TOKEN` in your `.env`

---

## Step 5 — Set Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:4321/api/admin/auth/callback`
   - `https://thebudgetaesthetic.vercel.app/api/admin/auth/callback`
7. Copy **Client ID** → `GOOGLE_CLIENT_ID` in `.env`
8. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET` in `.env`

---

## Step 6 — Add Cookie Banner to BaseLayout

Open `src/layouts/BaseLayout.astro` and add:

```astro
---
import CookieBanner from '../components/CookieBanner.astro'
---

<!-- At the bottom of your layout, just before </body> -->
<CookieBanner />
```

---

## Step 7 — Add View Tracker to Blog Post Pages

Open `src/pages/blog/[slug].astro` and add:

```astro
---
import PostViewTracker from '../../components/PostViewTracker.astro'
---

<!-- Anywhere in the page template, e.g. bottom of content -->
<PostViewTracker postSlug={post.slug.current} postTitle={post.title} />
```

---

## Step 8 — Update Affiliate Links

Your existing affiliate links need to use the new tracked redirect format:

**Before:**
```html
<a href="https://amazon.in/dp/B0XXXXX">Buy on Amazon</a>
```

**After:**
```html
<a href="/api/redirect?url=https://amazon.in/dp/B0XXXXX&item=Keychron+K2&post=best-keyboards">
  Buy on Amazon
</a>
```

Parameters:
- `url` — the affiliate destination URL (required)
- `item` — product name for tracking (optional but recommended)
- `post` — the post slug where the link appears (optional)

---

## Step 9 — Check Post Schema Field Names

The admin uses `body` as the content field name. Open your existing `sanity/schemas/post.js` and check what your content field is named. If it's different (e.g. `content`, `description`), update these two files:

- `src/pages/api/admin/posts/save.ts` — line: `body: content`
- `src/pages/api/admin/posts/update.ts` — line: `body: content`

Also update the edit page query in `src/pages/admin/posts/edit/[id].astro`.

---

## Step 10 — Deploy to Vercel

Add all your environment variables to Vercel:
1. Go to your Vercel project → **Settings → Environment Variables**
2. Add every variable from `.env.example` with production values
3. For `GOOGLE_REDIRECT_URI` use: `https://thebudgetaesthetic.vercel.app/api/admin/auth/callback`

---

## Accessing the Admin Panel

- **Local:** `http://localhost:4321/admin/login`
- **Production:** `https://thebudgetaesthetic.vercel.app/admin/login`

The `/admin` route is protected — any unauthenticated visit redirects to `/admin/login`.

---

## Security Notes

- The `admin_session` cookie is `httpOnly` (not accessible via JS) and `secure` in production
- Only your `ADMIN_EMAIL` can log in via Google OAuth
- The Sanity write token is server-side only and never exposed to the browser
- All `/admin` and `/api/admin` routes are protected by middleware
