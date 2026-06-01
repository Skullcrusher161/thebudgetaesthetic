# Affiliate Link Localizer Skill

This local capability handles the automatic geo-targeting and client-side link swapping for Amazon affiliate links depending on the visitor's geographic region.

## Capabilities & Blueprints

### 1. Data Schema Extraction
The custom schema provides two distinct affiliate parameters for every product:
- `indiaLink`: Amazon India affiliate URL (`amazon.in`) containing the Indian associate ID.
- `globalLink`: Amazon Global affiliate URL (`amazon.com` / `amazon.co.uk`) containing the global associate ID.

### 2. Client-Side Geolocation Routing
To ensure zero latency and prevent server-side geolocation bottlenecks, we utilize client-side IP location detection combined with high-performance cookies:
- Check for the existence of the `tba_region` cookie (injected at the Edge by Vercel or custom middleware).
- If the `tba_region` cookie equals `"IN"` (India), or if no cookie is found and the browser's default locale/timezone matches India (+5:30 GMT / `Asia/Kolkata`), default all Amazon buttons to `indiaLink`.
- Otherwise, default buttons to `globalLink`.
- Optional: Implement a lightweight client-side fetch fallback to a public IP-lookup API (like `https://ip-api.com/json/`) to set the `tba_region` cookie for future visits.

### 3. Outbound Link Compliance
All outbound product links must enforce robust security, performance, and legal compliance standards:
- Always apply: `rel="noopener noreferrer nofollow sponsored"`
- Always set target to `target="_blank"`
- Include micro-disclosure text underneath: `Affiliate link · Price may vary · Earns a small commission`
