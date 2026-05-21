// sanity/sanity.config.mjs
// EXTENDS your existing sanity.config.mjs
// Replace the contents of your current sanity/sanity.config.mjs with this file

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/index.js'

export default defineConfig({
  name: 'thebudgetaesthetic',
  title: 'TheBudget Aesthetic',

  // ✅ Replace with your actual project ID from your existing .env
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .id('post')
              .child(
                S.documentList()
                  .title('All Posts')
                  .filter('_type == "post"')
              ),
            S.listItem()
              .title('Categories')
              .id('category')
              .child(
                S.documentList()
                  .title('Categories')
                  .filter('_type == "category"')
              ),
            S.divider(),
            S.listItem()
              .title('Analytics: Post Views')
              .id('postView')
              .child(
                S.documentList()
                  .title('Post Views')
                  .filter('_type == "postView"')
              ),
            S.listItem()
              .title('Analytics: Affiliate Clicks')
              .id('analyticsClick')
              .child(
                S.documentList()
                  .title('Affiliate Clicks')
                  .filter('_type == "analyticsClick"')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
