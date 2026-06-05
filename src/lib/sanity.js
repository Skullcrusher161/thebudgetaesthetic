import { createClient } from "@sanity/client";
import imageUrlBuilder  from "@sanity/image-url";
 
const getClient = () => {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    console.warn("PUBLIC_SANITY_PROJECT_ID not set — Sanity disabled");
    return null;
  }
  return createClient({
    projectId,
    dataset:    import.meta.env.PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn:     import.meta.env.PROD,
    token:      import.meta.env.SANITY_API_TOKEN,
  });
};
 
export const sanityClient = {
  fetch: async (query, params) => {
    const client = getClient();
    if (!client) return [];
    return client.fetch(query, params);
  },
};
 
const getBuilder = () => {
  const client = getClient();
  if (!client) return null;
  return imageUrlBuilder(client);
};
 
export const urlFor = (source) => {
  const builder = getBuilder();
  if (!builder) return { url: () => "" };
  return builder.image(source);
};
 
export const heroImageUrl = (source, width = 800) => {
  const builder = getBuilder();
  if (!builder || !source) return "";
  return builder.image(source)
    .width(width)
    .height(Math.round(width * 1.5))
    .fit("crop")
    .crop("center")
    .format("webp")
    .quality(85)
    .url();
};
 
export const productImageUrl = (source, size = 400) => {
  const builder = getBuilder();
  if (!builder || !source) return "";
  return builder.image(source)
    .width(size)
    .height(size)
    .fit("crop")
    .format("webp")
    .quality(80)
    .url();
};
 
function groq(strings, ...values) {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
 
export const ALL_POSTS_QUERY = groq`
  *[_type == "post" && published == true && publishedAt <= now() && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, heroImage,
    categories[]->{title, slug},
    "readTime": round(length(coalesce(pt::text(content), content, "")) / 200)
  }
`;
 
export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id, title, slug, publishedAt, updatedAt, excerpt,
    heroImage{alt, asset->{_id, url}},
    content, seo, categories[]->{title, slug},
    affiliateProducts[] {
      _key, name, productImage, indiaLink, globalLink,
      price, currency, rating, ratingCount, badge
    },
    "readTime": round(length(coalesce(pt::text(content), content, "")) / 200)
  }
`;
 
export const ALL_SLUGS_QUERY = groq`
  *[_type == "post" && published == true && publishedAt <= now() && !(_id in path("drafts.**"))].slug.current
`;
 
export const POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "post" && published == true && publishedAt <= now() && $category in categories[]->slug.current && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, heroImage,
    categories[]->{title, slug},
    "readTime": round(length(pt::text(content)) / 200)
  }
`;

export const SEARCH_POSTS_QUERY = groq`
  *[_type == "post" && published == true && publishedAt <= now() && !(_id in path("drafts.**")) && (title match $keyword || excerpt match $keyword || pt::text(content) match $keyword)]
  | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, heroImage,
    categories[]->{title, slug},
    "readTime": round(length(coalesce(pt::text(content), content, "")) / 200)
  }
`;

export const CATEGORY_BY_SLUG_QUERY = groq`
  *[_type == "category" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    title, description, emoji, slug
  }
`;

export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category" && !(_id in path("drafts.**"))] | order(title asc) {
    title, description, emoji, slug
  }
`;
 