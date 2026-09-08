import assert from "node:assert/strict";
import { parseCmsContent } from "../src/data/cms/schema.ts";
import { isCampaignVisible } from "../src/lib/campaign-visibility.ts";

const valid = {
  packages: [{ slug: "paket", name: "Paket", price: "1 TL", serviceSlugs: ["hizmet"], order: 1 }],
  services: [{ slug: "hizmet", name: "Hizmet", category: "Kategori", description: "Açıklama", icon: "wrench", order: 1 }],
  campaigns: [{ slug: "kampanya", title: "Kampanya", summary: "Özet", contentHtml: "<p>İçerik</p>", contentText: "İçerik", image: null, startsAt: "2026-01-01", endsAt: "2026-12-31", order: 1, detailCta: null, whatsappMessage: null }],
  gallery: [], blogPosts: [],
  branch: { name: "Nokta Garage", city: "Kırklareli", district: "Lüleburgaz", address: "Adres", shortAddress: "Adres", phone: "+90 555 000 00 00", phoneHref: "tel:+905550000000", whatsapp: "https://wa.me/905550000000", email: "test@example.com", mapsUrl: "https://maps.google.com", workingHours: "Her gün 08:00–18:00", defaultWhatsappMessage: "Merhaba" },
  home: { heroImage: null },
};

assert.equal(parseCmsContent(valid).packages.length, 1);

for (const [label, mutate, expected] of [
  ["eksik fiyat", (data) => { data.packages[0].price = ""; }, "Paket fiyatı"],
  ["bozuk URL", (data) => { data.branch.mapsUrl = "bozuk"; }, "URL"],
  ["geçersiz tarih", (data) => { data.campaigns[0].endsAt = "2025-01-01"; }, "bitiş tarihi"],
  ["mükerrer slug", (data) => { data.services.push({ ...data.services[0] }); }, "Mükerrer"],
  ["eksik hizmet", (data) => { data.packages[0].serviceSlugs = ["yok"]; }, "bulunamadı"],
]) {
  const candidate = structuredClone(valid);
  mutate(candidate);
  assert.throws(() => parseCmsContent(candidate), new RegExp(expected, "i"), label);
}

console.log("CMS sözleşme testi geçti: zorunlu alan, URL, tarih, slug ve referans hataları yakalandı.");

const window = { startsAt: "2026-09-08", endsAt: "2026-09-08" };
assert.equal(isCampaignVisible(window, Date.parse("2026-09-07T21:00:00Z")), true, "İstanbul'da başlangıç günü dahil olmalı");
assert.equal(isCampaignVisible(window, Date.parse("2026-09-08T20:59:59Z")), true, "İstanbul'da bitiş günü dahil olmalı");
assert.equal(isCampaignVisible(window, Date.parse("2026-09-08T21:00:00Z")), false, "İstanbul'da bitiş gününden sonra gizlenmeli");
console.log("Kampanya takvim testi geçti: Europe/Istanbul başlangıç ve bitiş günleri dahil.");
