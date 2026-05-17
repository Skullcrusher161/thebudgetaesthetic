// ─────────────────────────────────────────────────────────────────────────────
// src/lib/affiliateUrl.js
// Builds geo-routed affiliate redirect URLs for ProductCard component.
// The actual geo detection + tag injection happens in middleware.js at the edge.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = import.meta.env.PUBLIC_SITE_URL || "https://www.thebudgetaesthetic.com";

/**
 * Returns a /go?url=... redirect URL that the edge middleware
 * will intercept and inject the correct affiliate tag into.
 *
 * @param {string} indiaLink   - amazon.in product URL
 * @param {string} globalLink  - amazon.com product URL
 * @returns {{ in: string, global: string, redirect: string }}
 */
export function buildAffiliateUrls(indiaLink, globalLink) {
  const encode = (url) => encodeURIComponent(url);

  return {
    in:       `${SITE}/go?url=${encode(indiaLink)}`,
    global:   `${SITE}/go?url=${encode(globalLink)}`,
    // The `redirect` URL is what ProductCard href uses.
    // JS on the client reads the tba_region cookie and picks the right one.
    // Fallback (JS disabled / cookie missing): serves global link.
    redirect: `${SITE}/go?url=${encode(globalLink)}&fallback=${encode(indiaLink)}`,
  };
}

/**
 * Minimal client-side script to swap affiliate href based on cookie.
 * Inlined into ProductCard as a <script> tag.
 */
export const AFFILIATE_SWAP_SCRIPT = `
(function() {
  var region = document.cookie.split('; ').find(r => r.startsWith('tba_region='));
  if (!region) return;
  var isIndia = region.split('=')[1] === 'IN';
  document.querySelectorAll('[data-affiliate]').forEach(function(el) {
    var inUrl    = el.dataset.urlIn;
    var globalUrl = el.dataset.urlGlobal;
    if (inUrl && globalUrl) {
      el.href = isIndia ? inUrl : globalUrl;
    }
  });
})();
`;
