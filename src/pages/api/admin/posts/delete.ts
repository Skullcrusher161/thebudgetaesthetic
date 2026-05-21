// src/pages/api/admin/posts/delete.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData()
  const id = data.get('id')?.toString()

  if (!id) {
    return new Response('Missing post id', { status: 400 })
  }

  try {
    await sanity.delete(id)
    return redirect('/admin/posts?deleted=1')
  } catch (err) {
    console.error('Delete error:', err)
    return new Response('Failed to delete', { status: 500 })
  }
}
