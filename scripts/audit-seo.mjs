import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const dist = join(root, "dist");
const errors = [];
const warnings = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const indexableFiles = htmlFiles.filter((file) => relative(dist, file) !== "404.html");
const titles = new Map();
const descriptions = new Map();
const canonicals = new Set();
let jsonLdBlocks = 0;
let imageCount = 0;

const attr = (html, name) => html.match(new RegExp(`${name}="([^"]*)"`))?.[1];

for (const file of indexableFiles) {
  const label = relative(dist, file);
  const html = await readFile(file, "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;

  if (!html.includes('<html lang="tr">')) errors.push(`${label}: lang="tr" eksik`);
  if (!title) errors.push(`${label}: title eksik`);
  if (!description) errors.push(`${label}: description eksik`);
  if (!canonical?.startsWith("https://noktagarage.com/")) errors.push(`${label}: canonical eksik veya hatalı`);
  if (h1Count !== 1) errors.push(`${label}: H1 sayısı ${h1Count}`);
  if (!html.includes('name="robots" content="index,follow,max-image-preview:large"')) errors.push(`${label}: index robots değeri hatalı`);
  for (const field of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!html.includes(`property="${field}"`)) errors.push(`${label}: ${field} eksik`);
  }
  for (const field of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    if (!html.includes(`name="${field}"`)) errors.push(`${label}: ${field} eksik`);
  }

  if (title) {
    if (titles.has(title)) errors.push(`${label}: tekrarlanan title (${titles.get(title)})`);
    titles.set(title, label);
    if (title.length > 65) warnings.push(`${label}: title ${title.length} karakter`);
  }
  if (description) {
    if (descriptions.has(description)) errors.push(`${label}: tekrarlanan description (${descriptions.get(description)})`);
    descriptions.set(description, label);
    if (description.length < 70 || description.length > 170) warnings.push(`${label}: description ${description.length} karakter`);
  }
  if (canonical) canonicals.add(canonical);

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); jsonLdBlocks += 1; }
    catch { errors.push(`${label}: geçersiz JSON-LD`); }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    imageCount += 1;
    if (attr(match[0], "alt") === undefined) errors.push(`${label}: alt niteliği olmayan görsel`);
    if (!attr(match[0], "width") || !attr(match[0], "height")) errors.push(`${label}: ölçüsü olmayan görsel`);
  }
}

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
for (const canonical of canonicals) if (!sitemapUrls.has(canonical)) errors.push(`sitemap eksik: ${canonical}`);
for (const url of sitemapUrls) if (!canonicals.has(url)) errors.push(`sitemap fazladan URL: ${url}`);

if (files.some((file) => relative(dist, file).startsWith("cerez-politikasi/"))) errors.push("kaldırılan çerez sayfası hâlâ build içinde");
const combinedHtml = (await Promise.all(htmlFiles.map((file) => readFile(file, "utf8")))).join("\n");
if (combinedHtml.includes("/cerez-politikasi")) errors.push("kaldırılan çerez sayfasına bağlantı kaldı");
if (!combinedHtml.includes('"@type":"AutomotiveBusiness"')) errors.push("LocalBusiness structured data eksik");
if (!combinedHtml.includes('"@type":"BreadcrumbList"')) errors.push("Breadcrumb structured data eksik");
if (!combinedHtml.includes('"@type":"Article"')) errors.push("Article structured data eksik");

console.log(`Indexlenebilir sayfa: ${indexableFiles.length} · Sitemap URL: ${sitemapUrls.size}`);
console.log(`JSON-LD: ${jsonLdBlocks} blok · Görsel etiketi: ${imageCount}`);
console.log(`SEO uyarısı: ${warnings.length}`);
for (const warning of warnings) console.log(`- ${warning}`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Teknik SEO kontrolleri geçti.");
}
