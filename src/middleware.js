// ─────────────────────────────────────────────────────────────────────────────
// src/middleware.js  —  Vercel Edge Middleware
// Geo-aware Amazon affiliate link routing.
// Runs at the EDGE before any page is served (zero cold-start latency).
// ─────────────────────────────────────────────────────────────────────────────
import { defineMiddleware } from "astro:middleware";

const ASSOCIATE_IN     = import.meta.env.AMAZON_ASSOCIATE_ID_IN     || "budgetaes-in-21";
const ASSOCIATE_GLOBAL = import.meta.env.AMAZON_ASSOCIATE_ID_GLOBAL || "budgetaes-20";

/**
 * Detects country from Vercel geo headers and rewrites /go/[hash] links
 * to the correct Amazon storefront with the right affiliate tag injected.
 *
 * URL contract:  /go?url=<encoded_amazon_url>&region=in|global
 * The region param is set server-side when rendering ProductCard hrefs.
 * The middleware overrides it using the visitor's real geo.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;

  // ── 1. Affiliate redirect route ──────────────────────────────────────────
  if (url.pathname === "/go") {
    const targetUrl  = url.searchParams.get("url");
    if (!targetUrl) return new Response("Bad Request", { status: 400 });

    // Vercel injects x-vercel-ip-country on Edge
    const country = request.headers.get("x-vercel-ip-country") || "US";
    const isIndia  = country === "IN";
    const tag      = isIndia ? ASSOCIATE_IN : ASSOCIATE_GLOBAL;

    let destination;
    try {
      destination = new URL(decodeURIComponent(targetUrl));
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    // Inject / replace affiliate tag
    destination.searchParams.set("tag", tag);

    // Security: only allow amazon.* domains
    if (!destination.hostname.match(/^(www\.)?(amazon\.(in|com|co\.uk|de|fr|ca|com\.au))$/)) {
      return new Response("Forbidden", { status: 403 });
    }

    return Response.redirect(destination.toString(), 302);
  }

  // ── 2. Inject geo cookie for client-side awareness ───────────────────────
  const response = await next();
  const country  = request.headers.get("x-vercel-ip-country") || "US";

  // Lightweight cookie — no sensitive data, just "IN" or "GLOBAL"
  if (!request.headers.get("cookie")?.includes("tba_region")) {
    response.headers.append(
      "Set-Cookie",
      `tba_region=${country === "IN" ? "IN" : "GLOBAL"}; Path=/; SameSite=Lax; Max-Age=86400`
    );
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
});
