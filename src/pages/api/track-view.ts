// src/pages/api/track-view.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN,
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

    const country  = request.headers.get('x-vercel-ip-country') || 'Global'
    const referrer = request.headers.get('referer') || ''   // ← ADDED

    await sanityClient.create({
      _type: 'postView',
      postSlug,
      postTitle: postTitle || postSlug,
      country,
      referrer,                                              // ← ADDED
      viewedAt: new Date().toISOString(),
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Track view error:', err)
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 })
  }
}