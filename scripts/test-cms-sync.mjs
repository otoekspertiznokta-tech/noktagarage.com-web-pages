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
  if (request.url === "/wp-json/nokta-garage/v1/content") {
    contentRequestCount += 1;
    if (contentRequestCount === 1) {
      response.writeHead(502, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "temporary" }));
      return;
    }
    const origin = `http://127.0.0.1:${server.address().port}`;
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      packages: [], services: [], campaigns: [], blogPosts: [], branches: [], pages: [],
      gallery: [{
        id: 1, slug: "test", status: "publish", modified_gmt: "2026-09-06T00:00:00Z",
        acf: { id: "test", image: `${origin}/wp-content/uploads/test.png`, alt: "Test", placeholderLabel: "Test", icon: "car", order: 1, active: true },
      }],
      settings: { id: 0, slug: "site-settings", status: "publish", modified_gmt: "2026-09-06T00:00:00Z", acf: {} },
    }));
    return;
  }
  response.writeHead(404).end();
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const endpoint = `http://127.0.0.1:${server.address().port}/wp-json/nokta-garage/v1/content`;

try {
  await execFileAsync(process.execPath, ["scripts/sync-wordpress-content.mjs"], {
    cwd: root,
    env: { ...process.env, CMS_API_URL: endpoint, CMS_REQUIRED: "true" },
  });
  const bundle = JSON.parse(await readFile(path.join(root, ".cms", "content.json"), "utf8"));
  const localized = bundle.gallery[0].acf.image;
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
