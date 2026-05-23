export const prerender = false
import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'

export const GET: APIRoute = async () => {
  const token = import.meta.env.SANITY_WRITE_TOKEN
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

  try {
    const sanity = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false })
    // Try a minimal write operation
    const result = await sanity.fetch(`*[_type == "sanity.imageAsset"][0...1]`)
    return new Response(JSON.stringify({ ok: true, token: token ? `${token.slice(0,8)}...` : 'MISSING', projectId, result }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, token: token ? `${token.slice(0,8)}...` : 'MISSING', projectId }), { status: 500 })
  }
}