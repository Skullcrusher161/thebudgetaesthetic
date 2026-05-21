// sanity/schemas/postView.js
// Tracks individual post page views
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
