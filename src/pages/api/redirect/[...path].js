/**
 * src/pages/api/redirect/[...path].js
 *
 * Explicit API route for the /go/* affiliate redirect.
 * The primary redirect logic lives in src/middleware.js (runs on every request).
 * This file is a fallback / explicit Vercel Serverless Function endpoint.
 *
 * Both approaches are included for maximum compatibility across Vercel plans.
 */

export const prerender = false;

// Allowed Amazon domains — prevents open redirect abuse
const ALLOWED_HOSTS = new Set([
  "amazon.com",
  "amazon.in",
  "amazon.co.uk",
  "amazon.de",
  "amazon.fr",
  "amazon.ca",
  "amazon.com.au",
  "amzn.to",          // Amazon short URLs
]);

function isAllowedAmazonDomain(hostname) {
  const clean = hostname.replace(/^www\./, "");
  if (ALLOWED_HOSTS.has(clean)) return true;
  // Handle subdomains like smile.amazon.com
  for (const host of ALLOWED_HOSTS) {
    if (clean.endsWith(`.${host}`)) return true;
  }
  return false;
}

export async function GET({ url, locals, redirect }) {
  const dest = url.searchParams.get("dest");

  if (!dest) {
    return new Response("Missing ?dest parameter", { status: 400 });
  }

  let destUrl;
  try {
    destUrl = new URL(decodeURIComponent(dest));
  } catch {
    return new Response("Invalid destination URL", { status: 400 });
  }

  if (!isAllowedAmazonDomain(destUrl.hostname)) {
    return new Response("Destination not permitted", { status: 403 });
  }

  // Region is injected by the geo middleware into locals
  const isIndia   = locals?.isIndia ?? false;
  const tag       = isIndia
    ? (import.meta.env.AMAZON_IN_TAG     ?? "thebudgetaes-21")
    : (import.meta.env.AMAZON_GLOBAL_TAG ?? "thebudgetaes-20");

  // Swap domain for India visitors
  if (isIndia && destUrl.hostname.endsWith("amazon.com")) {
    destUrl.hostname = "www.amazon.in";
  }

  destUrl.searchParams.set("tag", tag);

  return new Response(null, {
    status: 302,
    headers: {
      "Location":        destUrl.toString(),
      "Cache-Control":   "no-store",
      "X-Robots-Tag":    "noindex",
      "X-Affiliate-Tag": tag,
    },
  });
}
