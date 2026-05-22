// sanity/schemas/postView.js
export default {
  name: 'postView',
  title: 'Post View',
  type: 'document',
  fields: [
    {
      name: 'postSlug',
      title: 'Post Slug',
      type: 'string',
    },
    {
      name: 'postTitle',
      title: 'Post Title',
      type: 'string',
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Global',
    },
    {
      name: 'referrer',         // ← ADDED
      title: 'Referrer URL',
      type: 'string',
      initialValue: '',
      validation: Rule => Rule.max(500),
    },
    {
      name: 'viewedAt',
      title: 'Viewed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'postTitle',
      subtitle: 'viewedAt',
    },
  },
}