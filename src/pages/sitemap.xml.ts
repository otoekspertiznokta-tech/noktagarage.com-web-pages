import type { APIRoute } from "astro";
import { siteContent } from "../data/cms";

const siteOrigin = "https://noktagarage.com";
const staticPaths = [
  "/",
  "/ekspertiz-paketleri",
  "/hizmetler",
  "/mobil-ekspertiz",
  "/uzaktan-ekspertiz",
  "/rapor-sorgula",
  "/randevu",
  "/kampanyalar",
  "/galeri",
  "/blog",
  "/hakkimizda",
  "/bayilik",
  "/insan-kaynaklari",
  "/iletisim",
  "/kvkk",
  "/aydinlatma-metni",
  "/gizlilik-politikasi",
];

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const canonicalPath = (path: string) => path === "/" ? "/" : `${path.replace(/\/$/, "")}/`;
  const staticEntries = staticPaths.map((path) => `<url><loc>${escapeXml(new URL(canonicalPath(path), siteOrigin).toString())}</loc></url>`);
  const articleEntries = siteContent.blogPosts.map((post) => [
    "<url>",
    `<loc>${escapeXml(new URL(`/blog/${post.slug}/`, siteOrigin).toString())}</loc>`,
    `<lastmod>${escapeXml(post.publishedAt)}</lastmod>`,
    "</url>",
  ].join(""));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticEntries, ...articleEntries].join("")}</urlset>`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
