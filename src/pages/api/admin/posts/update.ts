// src/pages/api/admin/posts/update.ts
// Updates an existing post in Sanity, re-uploads cover if changed,
// and re-extracts inline product cards from editor HTML.
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

// Same parser as save.ts — extract product cards from editor HTML
function extractProductCards(html: string): any[] {
  const cards: any[] = []
  const re = /data-product-card='([^']+)'/g
  let m
  while ((m = re.exec(html)) !== null) {
    try { cards.push(JSON.parse(m[1])) } catch { /* skip */ }
  }
  const re2 = /data-product-card="([^"]+)"/g
  while ((m = re2.exec(html)) !== null) {
    try { cards.push(JSON.parse(m[1].replace(/&quot;/g, '"'))) } catch { /* skip */ }
  }
  return cards
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()

    const postId = formData.get('id')?.toString()
    const title = formData.get('title')?.toString()
    const slug = formData.get('slug')?.toString()
    const content = formData.get('content')?.toString() || ''
    const excerpt = formData.get('excerpt')?.toString() || ''
    const categoryId = formData.get('categoryId')?.toString()
    const published = formData.get('published') === 'on'
    const coverImageFile = formData.get('coverImage') as File | null

    if (!postId || !title || !slug) {
      return new Response(JSON.stringify({ error: 'ID, title and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build patch object — only include what we're updating
    const patch: any = {
      title,
      slug: { _type: 'slug', current: slug },
      content,
      excerpt,
      published,
      _updatedAt: new Date().toISOString(),
    }

    // Upload new cover image if provided
    if (coverImageFile && coverImageFile.size > 0) {
      const buffer = await coverImageFile.arrayBuffer()
      const asset = await sanity.assets.upload('image', Buffer.from(buffer), {
        filename: coverImageFile.name,
        contentType: coverImageFile.type,
      })
      patch.heroImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: title,
      }
    }

    // Re-extract product cards from updated HTML
    const productCards = extractProductCards(content)
    if (productCards.length > 0) {
      patch.affiliateProducts = productCards.map((card, i) => {
        const product: any = {
          _key: card._key || `product_${Date.now()}_${i}`,
          name: card.name,
          indiaLink: card.indiaLink,
          globalLink: card.globalLink,
        }
        if (card.badge) product.badge = card.badge
        if (card.priceInr) { product.price = card.priceInr; product.currency = 'INR' }
        else if (card.priceUsd) { product.price = card.priceUsd; product.currency = 'USD' }
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
    } else {
      // No cards in content — clear the array
      patch.affiliateProducts = []
    }

    // Update category
    if (categoryId) {
      patch.categories = [{ _type: 'reference', _ref: categoryId, _key: categoryId }]
    } else {
      patch.categories = []
    }

    await sanity.patch(postId).set(patch).commit()

    return new Response(JSON.stringify({ ok: true, id: postId }), {
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