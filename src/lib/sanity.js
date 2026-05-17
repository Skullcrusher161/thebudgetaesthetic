// ─────────────────────────────────────────────────────────────────────────────
// src/lib/sanity.js — Sanity client + image URL builder + GROQ helpers
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@sanity/client";
import imageUrlBuilder  from "@sanity/image-url";

const _projectId = import.meta.env?.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
if (!_projectId) throw new Error("PUBLIC_SANITY_PROJECT_ID missing from .env");

export const sanityClient = createClient({
  projectId:  _projectId,
  dataset:    import.meta.env?.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:     import.meta.env?.PROD ?? false,
  token:      import.meta.env?.SANITY_API_TOKEN ?? process.env.SANITY_API_TOKEN,
});

// ── Image URL builder ─────────────────────────────────────────────────────────
const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source) => builder.image(source);

// ── Pinterest-optimised hero: 2:3 ratio, WebP, quality 85 ────────────────────
export const heroImageUrl = (source, width = 800) =>
  urlFor(source)
    .width(width)
    .height(Math.round(width * 1.5))
    .fit("crop")
    .crop("center")
    .format("webp")
    .quality(85)
    .url();

// ── Product card thumbnail: square, sharp ────────────────────────────────────
export const productImageUrl = (source, size = 400) =>
  urlFor(source)
    .width(size)
    .height(size)
    .fit("crop")
    .format("webp")
    .quality(80)
    .url();

// ── GROQ Queries ──────────────────────────────────────────────────────────────

/** All published posts — list page */
export const ALL_POSTS_QUERY = groq`
  *[_type == "post" && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    heroImage,
    categories[]->{title, slug},
    "readTime": round(length(pt::text(content)) / 200)
  }
`;

/** Single post by slug — detail page */
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    publishedAt,
    updatedAt,
    excerpt,
    heroImage,
    content,
    seo,
    categories[]->{title, slug},
    affiliateProducts[] {
      _key,
      name,
      productImage,
      indiaLink,
      globalLink,
      price,
      currency,
      rating,
      ratingCount,
      badge
    },
    "readTime": round(length(pt::text(content)) / 200)
  }
`;

/** All slugs — used for getStaticPaths / ISR */
export const ALL_SLUGS_QUERY = groq`
  *[_type == "post" && !(_id in path("drafts.**"))].slug.current
`;

/** Posts by category */
export const POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "post" && $category in categories[]->slug.current && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, heroImage,
    "readTime": round(length(pt::text(content)) / 200)
  }
`;

// groq tagged template literal — purely cosmetic, enables IDE syntax highlighting
function groq(strings, ...values) {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
