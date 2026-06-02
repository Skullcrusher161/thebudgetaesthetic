// src/pages/api/admin/posts/save.ts
export const prerender = false

import type { APIRoute } from 'astro'
import { createClient } from '@sanity/client'
import { Buffer } from 'node:buffer'

const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: import.meta.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// ─── Parse product cards out of raw editor HTML ───────────────────────────
// The editor stores product cards as <div data-product-card='{"name":...}'> nodes.
// We extract them here and store as proper Sanity affiliate product objects.
function extractProductCards(html: string): Array<{
  name: string
  badge?: string
  priceInr?: number
  priceUsd?: number
  rating?: number
  ratingCount?: number
  indiaLink: string
  globalLink: string
  imageUrl?: string
  assetId?: string
}> {
  const cards: any[] = []
  // innerHTML serialises data attributes with double quotes and &quot; inside
  const re = /data-product-card="([^"]*)"/g
  let m
  while ((m = re.exec(html)) !== null) {
    try {
      cards.push(JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'")))
    } catch { /* skip malformed */ }
  }
  return cards
}

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

    // ── Upload cover image if provided ──
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
        alt: title,
      }
    }

    // ── Extract inline product cards from editor HTML ──
    const productCards = extractProductCards(content)

    // Build affiliateProducts array for Sanity
    // Images were already uploaded to Sanity by the modal's upload step,
    // so we just need to reference the assetId.
    const affiliateProducts = productCards.map((card, i) => {
      const product: any = {
        _key: `product_${Date.now()}_${i}`,
        name: card.name,
        indiaLink: card.indiaLink,
        globalLink: card.globalLink,
      }
      if (card.badge) product.badge = card.badge
      if (card.priceInr) { product.price = card.priceInr; product.currency = 'INR' }
      if (card.priceUsd && !card.priceInr) { product.price = card.priceUsd; product.currency = 'USD' }
      if (card.rating) product.rating = card.rating
      if (card.ratingCount) product.ratingCount = card.ratingCount
      if (card.assetId) {
        product.productImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: card.assetId },
          alt: card.name,
        }
      }
      return product
    })

    // ── Build post document ──
    const postDoc: any = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      content,           // raw HTML; used for display
      excerpt,
      published,
      publishedAt: new Date().toISOString(),
    }

    if (affiliateProducts.length > 0) {
      postDoc.affiliateProducts = affiliateProducts
    }

    if (categoryId) {
      postDoc.categories = [{ _type: 'reference', _ref: categoryId, _key: categoryId }]
    }

    if (coverImageAsset) {
      postDoc.heroImage = coverImageAsset
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