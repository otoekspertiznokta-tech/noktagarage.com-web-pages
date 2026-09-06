import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const dist = join(root, "dist");
const errors = [];

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

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const label = relative(dist, file);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${label}: meta description eksik`);
  if (!/<link rel="canonical" href="https:\/\/noktagarage\.com\/[^"]*"/.test(html)) errors.push(`${label}: canonical eksik veya hatalı`);
  if (!/<h1(?:\s|>)/.test(html)) errors.push(`${label}: H1 eksik`);
  if (label !== "404.html" && /noindex/.test(html)) errors.push(`${label}: beklenmeyen noindex`);
  if (label === "404.html" && !/noindex,nofollow/.test(html)) errors.push(`${label}: noindex eksik`);
}

const requiredFiles = ["robots.txt", "sitemap.xml", "404.html"];
for (const required of requiredFiles) {
  if (!files.some((file) => relative(dist, file) === required)) errors.push(`${required}: build çıktısında yok`);
}

const textAssets = files.filter((file) => /\.(?:html|js|css)$/.test(file));
const text = (await Promise.all(textAssets.map((file) => readFile(file, "utf8")))).join("\n");
const trackerSignatures = ["googletagmanager.com", "google-analytics.com", "connect.facebook.net", "gtag("];
for (const signature of trackerSignatures) {
  if (text.includes(signature)) errors.push(`istenmeyen analytics imzası: ${signature}`);
}

const homeHtml = await stat(join(dist, "index.html"));
const cssBytes = (await Promise.all(files.filter((file) => file.endsWith(".css")).map((file) => stat(file)))).reduce((sum, item) => sum + item.size, 0);
const jsBytes = (await Promise.all(files.filter((file) => file.endsWith(".js")).map((file) => stat(file)))).reduce((sum, item) => sum + item.size, 0);
const fontBytes = (await Promise.all(files.filter((file) => /\.(?:woff2?|ttf)$/.test(file)).map((file) => stat(file)))).reduce((sum, item) => sum + item.size, 0);
const heroBytes = (await stat(join(dist, "images", "home-hero-640.webp"))).size;
const logoBytes = (await stat(join(dist, "logo-320.webp"))).size;
const estimatedMobileFirstView = homeHtml.size + cssBytes + jsBytes + fontBytes + heroBytes + logoBytes;
const mobileBudget = 750 * 1024;
if (estimatedMobileFirstView > mobileBudget) errors.push(`mobil ilk görünüm bütçesi aşıldı: ${estimatedMobileFirstView} > ${mobileBudget} bayt`);

console.log(`HTML sayfası: ${htmlFiles.length}`);
console.log(`JS: ${(jsBytes / 1024).toFixed(1)} KB · CSS: ${(cssBytes / 1024).toFixed(1)} KB · Font: ${(fontBytes / 1024).toFixed(1)} KB`);
console.log(`Tahmini mobil ilk görünüm: ${(estimatedMobileFirstView / 1024).toFixed(1)} KB / 750 KB`);
console.log("Analytics/Ads ağı: yok (yalnızca yerel nokta:site-event arayüzü)");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Statik SEO ve mobil transfer bütçesi kontrolleri geçti.");
}
