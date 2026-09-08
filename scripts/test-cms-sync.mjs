import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = process.cwd();
let contentRequestCount = 0;
const pixel = await sharp({
  create: { width: 2, height: 2, channels: 4, background: { r: 180, g: 20, b: 35, alpha: 1 } },
}).png().toBuffer();

const server = http.createServer((request, response) => {
  if (request.url === "/wp-content/uploads/test.png") {
    response.writeHead(200, { "Content-Type": "image/png" });
    response.end(pixel);
    return;
  }
  if (request.url?.startsWith("/wp-json/nokta-garage/v2/content?")) {
    contentRequestCount += 1;
    if (contentRequestCount === 1) {
      response.writeHead(502, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "temporary" }));
      return;
    }
    const origin = `http://127.0.0.1:${server.address().port}`;
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      packages: [{ slug: "test-paket", name: "Test Paket", price: "1 TL", serviceSlugs: ["test-hizmet"], order: 1 }],
      services: [{ slug: "test-hizmet", name: "Test Hizmet", category: "Test", description: "Test açıklaması", icon: "car", order: 1 }],
      campaigns: [], blogPosts: [],
      gallery: [{
        id: "test", image: `${origin}/wp-content/uploads/test.png`, alt: "Test", caption: null, order: 1,
      }],
      branch: { name: "Test", city: "Test", district: "Test", address: "Test adres", shortAddress: "Test", phone: "+90 555 000 00 00", phoneHref: "tel:+905550000000", whatsapp: "https://wa.me/905550000000", email: "test@example.com", mapsUrl: "https://maps.google.com", workingHours: "Her gün 08:00–18:00", defaultWhatsappMessage: "Test mesajı" },
      home: { heroImage: null },
    }));
    return;
  }
  response.writeHead(404).end();
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const endpoint = `http://127.0.0.1:${server.address().port}/wp-json/nokta-garage/v2/content`;

try {
  await execFileAsync(process.execPath, ["scripts/sync-wordpress-content.mjs"], {
    cwd: root,
    env: { ...process.env, CMS_API_URL: endpoint, CMS_REQUIRED: "true" },
  });
  const bundle = JSON.parse(await readFile(path.join(root, ".cms", "content.json"), "utf8"));
  const localized = bundle.gallery[0].image;
  assert.match(localized, /^\/cms-media\/[a-f0-9]{20}\.webp$/);
  const localFile = path.join(root, "public", localized);
  assert.equal(existsSync(localFile), true);
  const metadata = await sharp(localFile).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 2);
  assert.equal(metadata.height, 2);
  assert.equal(contentRequestCount, 2);
  const sources = JSON.parse(await readFile(path.join(root, ".cms", "media.json"), "utf8"));
  assert.equal(sources[localized], `${localized} 2w`);
  console.log("CMS sync testi geçti: REST içerik alındı ve görsel statik WebP'ye dönüştürüldü.");
} finally {
  await new Promise((resolve) => server.close(resolve));
  await rm(path.join(root, ".cms"), { recursive: true, force: true });
  await rm(path.join(root, "public", "cms-media"), { recursive: true, force: true });
}
