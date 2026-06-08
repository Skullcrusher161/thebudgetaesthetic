// src/pages/api/track-click.ts
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
    const { itemName, targetUrl, postSlug } = body

    if (!itemName || !targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing itemName or targetUrl' }), {
        status: 400,
      })
    }

    const country = request.headers.get('x-vercel-ip-country') || 'Global'

    await sanityClient.create({
      _type: 'analyticsClick',
      itemName,
      targetUrl,
      postSlug: postSlug || 'unknown',
      country,
      clickedAt: new Date().toISOString(),
    })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (err) {
    console.error('Track click error:', err)
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 })
  }
}
