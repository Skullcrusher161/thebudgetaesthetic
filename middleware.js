export const config = {
  matcher: ["/go", "/go/(.*)"],
};

const ASSOCIATE_IN     = process.env.AMAZON_ASSOCIATE_ID_IN     || "budgetaes-in-21";
const ASSOCIATE_GLOBAL = process.env.AMAZON_ASSOCIATE_ID_GLOBAL || "budgetaes-20";

export default async function middleware(request) {
  const url = new URL(request.url);

  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) return new Response("Bad Request", { status: 400 });

  const country = request.headers.get("x-vercel-ip-country") || "US";
  const tag     = country === "IN" ? ASSOCIATE_IN : ASSOCIATE_GLOBAL;

  let destination;
  try {
    destination = new URL(decodeURIComponent(targetUrl));
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  if (!destination.hostname.match(/^(www\.)?(amazon\.(in|com|co\.uk|de|fr|ca|com\.au))$/)) {
    return new Response("Forbidden", { status: 403 });
  }

  destination.searchParams.set("tag", tag);
  return Response.redirect(destination.toString(), 302);
}