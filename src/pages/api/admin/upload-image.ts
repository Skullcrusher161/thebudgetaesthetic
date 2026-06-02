// src/pages/api/admin/upload-image.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'
import { Readable } from 'node:stream'

const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN,   // needs write/editor token
  useCdn: false,
})

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image too large — max 5 MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File must be an image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const stream = Readable.from(buffer)
    const asset = await sanity.assets.upload('image', stream, {
      filename: file.name,
      contentType: file.type,
    })

    // Return the CDN URL + asset ID so the editor can insert the image
    // and the post-save handler can store a proper Sanity reference
    return new Response(
      JSON.stringify({
        url: asset.url,
        assetId: asset._id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('upload-image error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Upload failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}