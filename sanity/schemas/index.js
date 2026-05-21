// sanity/schemas/index.js
// EXTENDS your existing schemas — add new imports alongside your existing ones

import post from './post.js'
import category from './category.js'
import analyticsClick from './analyticsClick.js'
import postView from './postView.js'

export const schemaTypes = [
  // Your existing schemas
  post,
  category,
  // New schemas for analytics tracking
  analyticsClick,
  postView,
]
