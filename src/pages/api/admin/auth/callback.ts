// src/pages/api/admin/auth/callback.ts
// Google OAuth callback — exchanges code for token, validates email, sets session

export const prerender = false

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code')

  if (!code) {
    return redirect('/admin/login?error=no_code')
  }

  const clientId = import.meta.env.GOOGLE_CLIENT_ID
  const clientSecret = import.meta.env.GOOGLE_CLIENT_SECRET
  const redirectUri = import.meta.env.GOOGLE_REDIRECT_URI
  const allowedEmail = import.meta.env.ADMIN_EMAIL

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = await tokenRes.json()

  if (!tokenData.access_token) {
    return redirect('/admin/login?error=token_failed')
  }

  // Fetch Google user profile
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  const user = await userRes.json()

  // Only allow the configured admin email
  if (user.email !== allowedEmail) {
    return redirect('/admin/login?error=unauthorized')
  }

  // Set session cookie
  cookies.set('admin_session', 'authenticated', {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })

  return redirect('/admin/dashboard')
}
