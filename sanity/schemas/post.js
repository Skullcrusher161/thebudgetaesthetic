// ─────────────────────────────────────────────────────────────────────────────
// sanity/schemas/post.js — Main blog post schema
// ─────────────────────────────────────────────────────────────────────────────
import { defineType, defineField, defineArrayMember } from "sanity";

export const postSchema = defineType({
  name:  "post",
  title: "Blog Post",
  type:  "document",

  // 🔒 RBAC — Only users with "editor" or "administrator" roles can create/edit.
  // Set this up in Sanity Manage > Access > Roles.
  // Dataset permissions: assign "Viewer" to public API token, "Editor" to admin token.
  __experimental_actions: ["create", "update", "delete", "publish"],

  groups: [
    { name: "content",   title: "Content",    default: true },
    { name: "products",  title: "Products"   },
    { name: "seo",       title: "SEO"        },
  ],

  fields: [
    // ── Core ────────────────────────────────────────────────────────────────
    defineField({
      name: "title", title: "Post Title", type: "string", group: "content",
      validation: (R) => R.required().min(10).max(100),
    }),
    defineField({
      name: "slug", title: "URL Slug", type: "slug", group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "publishedAt", title: "Publish Date", type: "datetime", group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: "updatedAt", title: "Last Updated", type: "datetime", group: "content",
    }),
    defineField({
      name: "excerpt", title: "Excerpt (for Pinterest/SEO)", type: "text", group: "content",
      rows: 3,
      validation: (R) => R.required().max(200),
    }),
    defineField({
      name: "categories", title: "Categories", type: "array", group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
    }),

    // ── Hero Image (Pinterest 2:3 optimised) ─────────────────────────────────
    defineField({
      name: "heroImage", title: "Hero Image (2:3 ratio — 1000×1500px recommended)",
      type: "image", group: "content",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string",
          validation: (R) => R.required() }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      validation: (R) => R.required(),
    }),

    // ── Rich Text Content ────────────────────────────────────────────────────
    defineField({
      name: "content", title: "Post Content", type: "array", group: "content",
      of: [
        defineArrayMember({ type: "block",
          styles: [
            { title: "Normal",     value: "normal"     },
            { title: "Heading 2",  value: "h2"         },
            { title: "Heading 3",  value: "h3"         },
            { title: "Quote",      value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold",      value: "strong" },
              { title: "Italic",    value: "em"     },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              { name: "link", type: "object", title: "Link",
                fields: [
                  { name: "href", type: "url", title: "URL",
                    validation: (R) => R.uri({ scheme: ["http", "https"] }) },
                  { name: "blank", type: "boolean", title: "Open in new tab",
                    initialValue: false },
                ],
              },
            ],
          },
        }),
        // Inline image block
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text", validation: (R) => R.required() },
            { name: "caption", type: "string", title: "Caption" },
          ],
        }),
        // Product Card insertion (renders affiliate widget inline)
        defineArrayMember({
          name: "productInline", type: "object", title: "Inline Product Card",
          fields: [
            { name: "productRef", type: "string", title: "Product Key (from Products tab)" },
          ],
        }),
      ],
    }),

    // ── Affiliate Products Array ──────────────────────────────────────────────
    defineField({
      name: "affiliateProducts", title: "Affiliate Products", type: "array", group: "products",
      of: [
        defineArrayMember({
          name: "product", type: "object", title: "Product",
          fields: [
            { name: "name",         type: "string",  title: "Product Name",
              validation: (R) => R.required() },
            { name: "productImage", type: "image",   title: "Product Image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string", title: "Alt Text", validation: (R) => R.required() }] },
            { name: "indiaLink",    type: "url",     title: "Amazon India Link (amazon.in)",
              validation: (R) => R.required().uri({ scheme: ["https"] }) },
            { name: "globalLink",   type: "url",     title: "Amazon Global Link (amazon.com)",
              validation: (R) => R.required().uri({ scheme: ["https"] }) },
            { name: "price",        type: "number",  title: "Price",
              validation: (R) => R.required().positive() },
            { name: "currency",     type: "string",  title: "Currency",
              options: { list: ["INR", "USD", "GBP"], layout: "radio" },
              initialValue: "INR" },
            { name: "rating",       type: "number",  title: "Rating (0–5)",
              validation: (R) => R.required().min(0).max(5).precision(1) },
            { name: "ratingCount",  type: "number",  title: "Number of Reviews" },
            { name: "badge",        type: "string",  title: "Badge (e.g. 'Best Seller', '#1 Pick')" },
          ],
          preview: {
            select: { title: "name", subtitle: "price", media: "productImage" },
            prepare: ({ title, subtitle, media }) => ({
              title, subtitle: subtitle ? `₹${subtitle}` : "", media,
            }),
          },
        }),
      ],
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "seo", title: "SEO Settings", type: "object", group: "seo",
      fields: [
        { name: "metaTitle",       type: "string", title: "Meta Title",
          validation: (R) => R.max(60) },
        { name: "metaDescription", type: "text",   title: "Meta Description",
          rows: 3, validation: (R) => R.max(160) },
        { name: "ogImage",         type: "image",  title: "Open Graph Image" },
        { name: "noIndex",         type: "boolean", title: "No Index", initialValue: false },
      ],
    }),
  ],

  preview: {
    select: { title: "title", media: "heroImage", subtitle: "publishedAt" },
    prepare: ({ title, media, subtitle }) => ({
      title,
      media,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString("en-IN") : "Draft",
    }),
  },

  orderings: [
    { title: "Newest First", name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Oldest First", name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc"  }] },
  ],
});
