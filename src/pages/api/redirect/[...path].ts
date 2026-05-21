// src/pages/api/redirect/[...path].ts
// REPLACES your existing src/pages/api/redirect/[...path].astro
// Tracks affiliate clicks THEN redirects — non-blocking

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

export const GET: APIRoute = async ({ url, request }) => {
  const targetUrl = url.searchParams.get('url')
  const itemName = url.searchParams.get('item') || 'unknown'
  const postSlug = url.searchParams.get('post') || 'unknown'

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 })
  }

  // Validate URL
  try {
    new URL(targetUrl)
  } catch {
    return new Response('Invalid URL', { status: 400 })
  }

  const country = request.headers.get('x-vercel-ip-country') || 'Global'

  // Fire-and-forget: log click without blocking redirect
  sanityClient
    .create({
      _type: 'analyticsClick',
      itemName,
      targetUrl,
      postSlug,
      country,
      clickedAt: new Date().toISOString(),
    })
    .catch((err) => console.error('Click tracking error:', err))

  // Immediate 307 redirect to affiliate URL
  return new Response(null, {
    status: 307,
    headers: { Location: targetUrl },
  })
}
