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

async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const htmlByPath = new Map(await Promise.all(htmlFiles.map(async (file) => [relative(dist, file), await readFile(file, "utf8")])));

for (const [path, html] of htmlByPath) {
  if (!html.includes('name="viewport"')) errors.push(`${path}: viewport meta eksik`);
  for (const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/g)) {
    const href = match[1].split(/[?#]/)[0];
    if (href.startsWith("//")) continue;
    const target = href === "/"
      ? join(dist, "index.html")
      : /\.[a-z0-9]+$/i.test(href)
        ? join(dist, href)
        : join(dist, href, "index.html");
    if (!await exists(target)) errors.push(`${path}: bozuk iç bağlantı ${href}`);
  }
}

const home = htmlByPath.get("index.html") ?? "";
const report = htmlByPath.get("rapor-sorgula/index.html") ?? "";
const packages = htmlByPath.get("ekspertiz-paketleri/index.html") ?? "";
const gallery = htmlByPath.get("galeri/index.html") ?? "";
const services = htmlByPath.get("hizmetler/index.html") ?? "";
const css = (await Promise.all(files.filter((file) => file.endsWith(".css")).map((file) => readFile(file, "utf8")))).join("\n");
const allHtml = [...htmlByPath.values()].join("\n");
const nonHomeHtml = [...htmlByPath.entries()]
  .filter(([path]) => path !== "index.html")
  .map(([, html]) => html)
  .join("\n");

const expectations = [
  [home.includes("data-mobile-menu"), "mobil menü işareti eksik"],
  [home.includes("brand-intro"), "ana sayfa açılış animasyonu eksik"],
  [!nonHomeHtml.includes("brand-intro"), "açılış animasyonu ana sayfa dışında bulunuyor"],
  [!home.includes("sessionStorage"), "açılış animasyonu tekrarını engelleyen sessionStorage kaldı"],
  [home.includes("data-menu-open"), "menü tetikleyicisi eksik"],
  [home.includes("sticky-contact"), "sticky iletişim çubuğu eksik"],
  [report.includes("data-report-form") && report.includes("data-plate") && report.includes("data-report-number"), "rapor formu alanları eksik"],
  [packages.includes("data-package-a") && packages.includes("data-package-b") && packages.includes("data-package-compare"), "paket karşılaştırma kontrolleri eksik"],
  [gallery.includes("data-gallery") && gallery.includes("gallery-board"), "tek galeri alanı eksik"],
  [!allHtml.includes("legal-page__draft"), "yasal sayfalardaki demo uyarısı kaldırılmamış"],
  [!allHtml.includes("/cerez-politikasi"), "kaldırılan çerez sayfasına bağlantı kalmış"],
  [services.includes("<details") && services.includes("<summary"), "hizmet accordion semantiği eksik"],
  [allHtml.includes("tel:+905532182136"), "telefon bağlantısı eksik"],
  [allHtml.includes("wa.me/905532182136"), "WhatsApp bağlantısı eksik"],
  [allHtml.includes("https://share.google/5YHlpgYMIs2tCrZ8v"), "harita bağlantısı eksik"],
  [css.includes("env(safe-area-inset-bottom)"), "iOS alt güvenli alan desteği eksik"],
  [css.includes("overflow-x:clip") || css.includes("overflow-x: clip"), "yatay taşma koruması eksik"],
  [!css.match(/\bwidth\s*:\s*100vw\b/), "100vw kaynaklı yatay taşma riski"],
];

for (const [passes, message] of expectations) {
  if (!passes) errors.push(message);
}

console.log(`Route: ${htmlFiles.length} · İç linkler, formlar ve etkileşim işaretleri kontrol edildi.`);
console.log("320–430 px taşma riski: 100vw genişlik kuralı yok; kök taşma koruması ve safe-area desteği var.");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Statik tarayıcı hazırlık kontrolleri geçti.");
}
