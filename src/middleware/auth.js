// src/middleware/auth.js
// Protects all /admin/* routes — checks for valid session cookie

export function requireAdmin(context) {
  const sessionCookie = context.cookies.get('admin_session')
  
  if (!sessionCookie || sessionCookie.value !== 'authenticated') {
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login' },
    })
  }
  
  return null // null = allowed through
}
