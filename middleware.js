// middleware.js (root level — REPLACES your existing middleware.js)
// Adds admin auth protection while preserving any existing middleware logic

import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url

  // Protect all /admin routes except /admin/login and /admin/auth/*
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin/auth')
  ) {
    const sessionCookie = context.cookies.get('admin_session')

    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return context.redirect('/admin/login')
    }
  }

  return next()
})
