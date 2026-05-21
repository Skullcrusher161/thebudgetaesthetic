// src/pages/api/admin/posts/update.ts
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
    const id = formData.get('id')?.toString()
    const title = formData.get('title')?.toString()
    const slug = formData.get('slug')?.toString()
    const content = formData.get('content')?.toString() || ''
    const excerpt = formData.get('excerpt')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString()
    const published = formData.get('published') === 'on'
    const coverImageFile = formData.get('coverImage') as File | null

    if (!id || !title || !slug) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const patch: any = {
      title,
      slug: { _type: 'slug', current: slug },
      body: content,
      excerpt,
      published,
    }

    if (categoryId) {
      patch.category = { _type: 'reference', _ref: categoryId }
    } else {
      patch.category = undefined
    }

    // Upload new cover image if provided
    if (coverImageFile && coverImageFile.size > 0) {
      const buffer = await coverImageFile.arrayBuffer()
      const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
        filename: coverImageFile.name,
        contentType: coverImageFile.type,
      })
      patch.coverImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      }
    }

    await sanity.patch(id).set(patch).commit()

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Update post error:', err)
    return new Response(JSON.stringify({ error: err.message || 'Failed to update' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
