// src/pages/api/admin/auth/google.ts
// Initiates Google OAuth flow — redirects to Google consent screen

export const prerender = false

import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const clientId = import.meta.env.GOOGLE_CLIENT_ID
  const redirectUri = import.meta.env.GOOGLE_REDIRECT_URI // e.g. https://yourdomain.com/api/admin/auth/callback

  const scope = encodeURIComponent('openid email profile')
  const state = crypto.randomUUID()

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&state=${state}` +
    `&access_type=offline`

  return new Response(null, {
    status: 302,
    headers: { Location: googleAuthUrl },
  })
}
