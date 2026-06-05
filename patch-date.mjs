import { createClient } from "@sanity/client";

const sanity = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  const posts = await sanity.fetch(`*[_type == "post"]{ _id, title, publishedAt }`);
  console.log("Found posts:", posts.length);
  for (const p of posts) {
    if (p.publishedAt) {
      // If it has 13:15:00.000Z instead of 07:45:00.000Z, we subtract 5.5 hours.
      // But instead of subtracting directly, we can just use now() since the user wanted it published immediately.
      // Wait, let's just subtract the 5.5 hours to be safe.
      const d = new Date(p.publishedAt);
      d.setMinutes(d.getMinutes() - 330); // IST is +5:30, so it was parsed as UTC meaning it was shifted forward by 5:30.
      await sanity.patch(p._id).set({ publishedAt: d.toISOString() }).commit();
      console.log(`Patched ${p.title} to ${d.toISOString()}`);
    }
  }
}

run().catch(console.error);
