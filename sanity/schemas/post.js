// sanity/schemas/post.js
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
        { name: 'caption', title: 'Caption', type: 'string' },
      ],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    },
    {
      name: 'content',
      title: 'Content',
      type: 'string',
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'affiliateProducts',
      title: 'Affiliate Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Product Name', type: 'string' },
            {
              name: 'productImage',
              title: 'Product Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
            },
            { name: 'indiaLink', title: 'India Link (Amazon.in)', type: 'url' },
            { name: 'globalLink', title: 'Global Link (Amazon.com)', type: 'url' },
            { name: 'price', title: 'Price', type: 'number' },
            {
              name: 'currency',
              title: 'Currency',
              type: 'string',
              options: { list: ['INR', 'USD', 'GBP'] },
            },
            {
              name: 'rating',
              title: 'Rating (0–5)',
              type: 'number',
              validation: (Rule) => Rule.min(0).max(5),
            },
            { name: 'ratingCount', title: 'Rating Count', type: 'number' },
            { name: 'badge', title: 'Badge', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string', validation: (Rule) => Rule.max(60) },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', validation: (Rule) => Rule.max(160) },
        { name: 'ogImage', title: 'OG Image', type: 'image' },
        { name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false },
      ],
    },
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
    prepare({ title, media }) {
      return { title, media }
    },
  },
}
