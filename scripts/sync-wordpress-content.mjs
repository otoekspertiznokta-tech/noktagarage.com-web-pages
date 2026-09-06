import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const cmsApiUrl = process.env.CMS_API_URL?.trim();
const isRequired = process.env.CMS_REQUIRED === "true";
const projectRoot = process.cwd();
const outputDirectory = path.join(projectRoot, ".cms");
const mediaDirectory = path.join(projectRoot, "public", "cms-media");

if (!cmsApiUrl) {
  if (isRequired) throw new Error("CMS_REQUIRED=true fakat CMS_API_URL tanımlı değil.");
  console.log("CMS_API_URL tanımlı değil; sürümlenmiş yerel içerik kullanılacak.");
  process.exit(0);
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 20_000);
let response;
try {
  response = await fetch(cmsApiUrl, {
    headers: { Accept: "application/json", "User-Agent": "NoktaGarage-Cloudflare-Build/1.0" },
    signal: controller.signal,
  });
} finally {
  clearTimeout(timeout);
}

if (!response.ok) throw new Error(`WordPress içerik isteği başarısız: HTTP ${response.status}`);
const bundle = await response.json();
if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) {
  throw new Error("WordPress içerik yanıtı geçerli bir nesne değil.");
}

const requiredCollections = ["packages", "services", "campaigns", "blogPosts", "gallery", "branches", "pages"];
for (const key of requiredCollections) {
  if (!Array.isArray(bundle[key])) throw new Error(`CMS alanı eksik veya dizi değil: ${key}`);
}
if (!bundle.settings || typeof bundle.settings !== "object" || bundle.settings.status !== "publish") {
  throw new Error("CMS site ayarları eksik veya yayınlanmamış.");
}

await rm(mediaDirectory, { recursive: true, force: true });
await mkdir(mediaDirectory, { recursive: true });
await mkdir(outputDirectory, { recursive: true });

const mediaCache = new Map();
const mediaSources = {};
const isCmsMediaUrl = (value) => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return false;
  try {
    const candidate = new URL(value);
    const cms = new URL(cmsApiUrl);
    return candidate.origin === cms.origin && candidate.pathname.includes("/wp-content/uploads/");
  } catch {
    return false;
  }
};

const downloadMedia = async (url) => {
  if (mediaCache.has(url)) return mediaCache.get(url);
  const mediaResponse = await fetch(url, { headers: { "User-Agent": "NoktaGarage-Cloudflare-Build/1.0" } });
  if (!mediaResponse.ok) throw new Error(`CMS görseli indirilemedi: HTTP ${mediaResponse.status}`);

  const bytes = Buffer.from(await mediaResponse.arrayBuffer());
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 20);
  const name = `${hash}.webp`;
  const metadata = await sharp(bytes).metadata();
  const sourceWidth = metadata.width ?? 1920;
  const mainWidth = Math.min(sourceWidth, 1920);
  await sharp(bytes)
    .rotate()
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(mediaDirectory, name));

  const localPath = `/cms-media/${name}`;
  const variants = [];
  for (const width of [640, 960, 1280]) {
    if (width >= mainWidth) continue;
    const variantName = `${hash}-${width}.webp`;
    await sharp(bytes).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(path.join(mediaDirectory, variantName));
    variants.push(`/cms-media/${variantName} ${width}w`);
  }
  variants.push(`${localPath} ${mainWidth}w`);
  mediaSources[localPath] = variants.join(", ");
  mediaCache.set(url, localPath);
  return localPath;
};

const localizeMedia = async (value) => {
  if (isCmsMediaUrl(value)) return downloadMedia(value);
  if (typeof value === "string" && value.includes("/wp-content/uploads/")) {
    const urls = [...value.matchAll(/https?:\/\/[^\s\"'<>]+\/wp-content\/uploads\/[^\s\"'<>]+/gi)].map((match) => match[0]);
    let localized = value;
    for (const url of [...new Set(urls)]) localized = localized.replaceAll(url, await downloadMedia(url));
    return localized;
  }
  if (Array.isArray(value)) return Promise.all(value.map(localizeMedia));
  if (value && typeof value === "object") {
    return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await localizeMedia(item)])));
  }
  return value;
};

const localizedBundle = await localizeMedia(bundle);
await writeFile(path.join(outputDirectory, "content.json"), `${JSON.stringify(localizedBundle, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDirectory, "media.json"), `${JSON.stringify(mediaSources, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDirectory, "manifest.json"), `${JSON.stringify({
  source: cmsApiUrl,
  syncedAt: new Date().toISOString(),
  localizedMediaCount: mediaCache.size,
}, null, 2)}\n`, "utf8");

console.log(`WordPress içeriği hazırlandı; ${mediaCache.size} görsel statik pakete alındı.`);
