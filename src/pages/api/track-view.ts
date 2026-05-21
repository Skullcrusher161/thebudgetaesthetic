// src/pages/api/track-view.ts
// Called client-side on every blog post page load
// Logs a postView document to Sanity (non-blocking, fire-and-forget)

export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN, // needs write token
  useCdn: false,
})

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    const { postSlug, postTitle } = body

    if (!postSlug) {
      return new Response(JSON.stringify({ error: 'Missing postSlug' }), {
        status: 400,
      })
    }

    // Get country from Vercel edge header
    const country = request.headers.get('x-vercel-ip-country') || 'Global'

    await sanityClient.create({
      _type: 'postView',
      postSlug,
      postTitle: postTitle || postSlug,
      country,
      viewedAt: new Date().toISOString(),
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Track view error:', err)
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 })
  }
}
