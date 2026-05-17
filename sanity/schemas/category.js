import { defineType, defineField } from "sanity";

export const categorySchema = defineType({
  name: "category", title: "Category", type: "document",
  fields: [
    defineField({ name: "title", type: "string", title: "Category Name",
      validation: (R) => R.required() }),
    defineField({ name: "slug",  type: "slug",   title: "Slug",
      options: { source: "title" }, validation: (R) => R.required() }),
    defineField({ name: "description", type: "text", title: "Description", rows: 2 }),
    defineField({ name: "emoji", type: "string", title: "Emoji Icon", validation: (R) => R.max(2) }),
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
