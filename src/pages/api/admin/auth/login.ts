// src/pages/api/admin/auth/login.ts
// Handles email+password login for admin
// Google OAuth is handled via redirect flow in /api/admin/auth/google

export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const data = await request.formData()
  const email = data.get('email')?.toString()
  const password = data.get('password')?.toString()

  const ADMIN_EMAIL = import.meta.env.ADMIN_EMAIL
  const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Missing credentials' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return redirect('/admin/dashboard')
  }

  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
