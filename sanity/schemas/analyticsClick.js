// sanity/schemas/analyticsClick.js
// Tracks affiliate link clicks with metadata
export default {
  name: 'analyticsClick',
  title: 'Affiliate Click',
  type: 'document',
  fields: [
    {
      name: 'itemName',
      title: 'Item Name',
      type: 'string',
      description: 'Name of the affiliate product clicked',
    },
    {
      name: 'targetUrl',
      title: 'Target URL',
      type: 'url',
      description: 'The affiliate destination URL',
    },
    {
      name: 'postSlug',
      title: 'Source Post Slug',
      type: 'string',
      description: 'Slug of the blog post where the click originated',
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'Global',
    },
    {
      name: 'clickedAt',
      title: 'Clicked At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  preview: {
    select: {
      title: 'itemName',
      subtitle: 'clickedAt',
    },
  },
}
