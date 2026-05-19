import { defineConfig, StudioProvider, StudioLayout } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

// Inline minimal schemas to avoid cross-package @sanity/types conflicts
import { defineType, defineField, defineArrayMember } from "sanity";

const postSchema = defineType({
  name: "post", title: "Blog Post", type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "products", title: "Products" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Post Title", type: "string", group: "content", validation: (R) => R.required().min(10).max(100) }),
    defineField({ name: "slug", title: "URL Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: "publishedAt", title: "Publish Date", type: "datetime", group: "content", initialValue: () => new Date().toISOString(), validation: (R) => R.required() }),
    defineField({ name: "updatedAt", title: "Last Updated", type: "datetime", group: "content" }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", group: "content", rows: 3, validation: (R) => R.required().max(200) }),
    defineField({ name: "categories", title: "Categories", type: "array", group: "content", of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })] }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", group: "content", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string", validation: (R) => R.required() }), defineField({ name: "caption", title: "Caption", type: "string" })], validation: (R) => R.required() }),
    defineField({
      name: "content", title: "Post Content", type: "array", group: "content",
      of: [
        defineArrayMember({ type: "block", marks: { annotations: [{ name: "link", type: "object", title: "Link", fields: [{ name: "href", type: "url", title: "URL" }, { name: "blank", type: "boolean", title: "Open in new tab", initialValue: false }] }] } }),
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt Text" }, { name: "caption", type: "string", title: "Caption" }] }),
      ],
    }),
    defineField({
      name: "affiliateProducts", title: "Affiliate Products", type: "array", group: "products",
      of: [defineArrayMember({
        name: "product", type: "object", title: "Product",
        fields: [
          { name: "name", type: "string", title: "Product Name" },
          { name: "productImage", type: "image", title: "Product Image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt Text" }] },
          { name: "indiaLink", type: "url", title: "Amazon India Link" },
          { name: "globalLink", type: "url", title: "Amazon Global Link" },
          { name: "price", type: "number", title: "Price" },
          { name: "currency", type: "string", title: "Currency", options: { list: ["INR", "USD", "GBP"], layout: "radio" }, initialValue: "INR" },
          { name: "rating", type: "number", title: "Rating (0–5)" },
          { name: "ratingCount", type: "number", title: "Number of Reviews" },
          { name: "badge", type: "string", title: "Badge" },
        ],
      })],
    }),
    defineField({ name: "seo", title: "SEO Settings", type: "object", group: "seo", fields: [{ name: "metaTitle", type: "string", title: "Meta Title" }, { name: "metaDescription", type: "text", title: "Meta Description", rows: 3 }, { name: "ogImage", type: "image", title: "OG Image" }, { name: "noIndex", type: "boolean", title: "No Index", initialValue: false }] }),
  ],
  preview: { select: { title: "title", media: "heroImage", subtitle: "publishedAt" } },
});

const categorySchema = defineType({
  name: "category", title: "Category", type: "document",
  fields: [
    defineField({ name: "title", type: "string", title: "Category Name", validation: (R) => R.required() }),
    defineField({ name: "slug", type: "slug", title: "Slug", options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "description", type: "text", title: "Description", rows: 2 }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});

const config = defineConfig({
  name:      "thebudgetaesthetic-studio",
  title:     "TheBudgetAesthetic CMS",
  projectId: "ukujp5z5",
  dataset:   "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title("TheBudgetAesthetic").items([
          S.listItem().title("✍️ Blog Posts").child(S.documentTypeList("post").title("All Posts")),
          S.divider(),
          S.listItem().title("🏷️ Categories").child(S.documentTypeList("category").title("Categories")),
        ]),
    }),
    visionTool(),
  ],
  schema: { types: [postSchema, categorySchema] },
});

export default function Studio() {
  return (
    <div style={{ height: "100vh" }}>
      <StudioProvider config={config}>
        <StudioLayout />
      </StudioProvider>
    </div>
  );
}
