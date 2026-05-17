// src/pages/api/sitemap.ts — Dynamic XML sitemap
import type { APIRoute } from "astro";
import { sanityClient, ALL_SLUGS_QUERY } from "../../lib/sanity.js";

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://www.thebudgetaesthetic.com";
  const slugs: string[] = await sanityClient.fetch(ALL_SLUGS_QUERY);

  const staticPages = [
    { url: "/",          priority: "1.0", changefreq: "weekly"  },
    { url: "/blog",      priority: "0.9", changefreq: "daily"   },
    { url: "/disclosure",priority: "0.3", changefreq: "yearly"  },
  ];

  const blogPages = slugs.map(slug => ({
    url: `/blog/${slug}`, priority: "0.8", changefreq: "weekly",
  }));

  const allPages = [...staticPages, ...blogPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${siteUrl}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
