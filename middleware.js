// src/middleware.js
import { defineMiddleware } from 'astro:middleware';

const GEO_COOKIE          = 'tba_geo';
const COOKIE_MAX          = 60 * 60 * 24;
const INDIA_COOKIE_VALUE  = 'IN';
const GLOBAL_COOKIE_VALUE = 'GLOBAL';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // ── 1. Admin auth guard ──────────────────────────────────────────────────
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin/auth')
  ) {
    const sessionCookie = context.cookies.get('admin_session');
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      return context.redirect('/admin/login');
    }
  }

  // ── 2. Geo detection ─────────────────────────────────────────────────────
  const countryHeader  = context.request.headers.get('x-vercel-ip-country') ?? '';
  const existingCookie = context.cookies.get(GEO_COOKIE)?.value;

  let geo = existingCookie ?? (countryHeader === 'IN' ? INDIA_COOKIE_VALUE : GLOBAL_COOKIE_VALUE);

  // Manual override via ?geo=IN or ?geo=GLOBAL (testing)
  const geoParam = context.url.searchParams.get('geo');
  if (geoParam === 'IN' || geoParam === 'GLOBAL') geo = geoParam;

  if (!existingCookie || existingCookie !== geo) {
    context.cookies.set(GEO_COOKIE, geo, {
      path:     '/',
      maxAge:   COOKIE_MAX,
      httpOnly: false,
      sameSite: 'lax',
      secure:   import.meta.env.PROD,
    });
  }

  context.locals.geo = geo;

  // ── 3. /go/* affiliate shortlink redirect ────────────────────────────────
  if (pathname.startsWith('/go/')) {
    const encoded = pathname.replace('/go/', '');
    try {
      const decoded = JSON.parse(atob(encoded));
      const destRaw = geo === 'IN' ? (decoded.in || decoded.gl) : (decoded.gl || decoded.in);
      if (!destRaw) return next();

      const parsed = new URL(destRaw);
      const tag = geo === 'IN'
        ? (import.meta.env.AMAZON_ASSOCIATE_IN     ?? 'thebudgetaest-21')
        : (import.meta.env.AMAZON_ASSOCIATE_GLOBAL ?? 'thebudgetaest-20');
      parsed.searchParams.set('tag', tag);

      return context.redirect(parsed.toString(), 302);
    } catch {
      return next();
    }
  }

  return next();
});