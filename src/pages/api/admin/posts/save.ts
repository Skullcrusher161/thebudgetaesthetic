// src/pages/api/admin/posts/save.ts
// Creates a new post in Sanity, uploads cover image if provided
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

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()

    const title = formData.get('title')?.toString()
    const slug = formData.get('slug')?.toString()
    const content = formData.get('content')?.toString() || ''
    const excerpt = formData.get('excerpt')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString()
    const published = formData.get('published') === 'on'
    const coverImageFile = formData.get('coverImage') as File | null

    if (!title || !slug) {
      return new Response(JSON.stringify({ error: 'Title and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Upload cover image to Sanity if provided
    let coverImageAsset = null
    if (coverImageFile && coverImageFile.size > 0) {
      const buffer = await coverImageFile.arrayBuffer()
      const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
        filename: coverImageFile.name,
        contentType: coverImageFile.type,
      })
      coverImageAsset = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      }
    }

    // Build post document
    const postDoc: any = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      // Store HTML content as a simple text field
      // (your existing post schema may use body/content — adjust field name if needed)
      body: content,
      excerpt,
      published,
    }

    if (categoryId) {
      postDoc.category = { _type: 'reference', _ref: categoryId }
    }

    if (coverImageAsset) {
      postDoc.coverImage = coverImageAsset
    }

    const created = await sanity.create(postDoc)

    return new Response(JSON.stringify({ ok: true, id: created._id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Save post error:', err)
    return new Response(JSON.stringify({ error: err.message || 'Failed to save' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
