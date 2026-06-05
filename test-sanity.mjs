import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  const allPosts = await sanity.fetch(`*[_type == "post"]{ _id, title, published, publishedAt }`);
  console.log("ALL POSTS IN DB:", allPosts);

  const homePosts = await sanity.fetch(`*[_type == "post" && published == true && publishedAt <= now() && !(_id in path("drafts.**"))]{ _id, title, published, publishedAt }`);
  console.log("POSTS MATCHING HOME QUERY:", homePosts);

  const currentDate = new Date().toISOString();
  console.log("CURRENT DATE (ISO):", currentDate);
}

run().catch(console.error);
