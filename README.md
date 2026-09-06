# Nokta Garage Public Web Sitesi

Astro tabanlı, statik üretilen Nokta Garage public web sitesi.

## Proje durumu

- Görev 01–14 tamamlandı.
- Görev 15'in otomatik kontrolleri tamamlandı; gerçek cihaz/tarayıcı matrisi devralan geliştirici tarafından tamamlanmalıdır.
- Rapor sorgulama backend sözleşmesi ve gerçek API adaptörü tamamlandı.
- ACF gerektirmeyen WordPress eklentisi, build-time içerik/görsel senkronizasyonu ve Cloudflare yayın tetikleyicisi hazırlandı.
- Dış servis kurulumu ve canlıya geçiş adımları `docs/DEPLOYMENT.md` içinde kayıtlıdır.

## Mevcut durum

- Görev 01: Temel tasarım sistemi ve ortak bileşenler tamamlandı.
- Görev 02: Ana sayfa; hero, konum alanı, hızlı erişim ızgarası ve kompakt içerik yönlendirmeleriyle tamamlandı.
- Görev 03: Ekspertiz paketleri sayfası; yedi paket accordion'u ve iki paketli mobil karşılaştırma aracıyla tamamlandı.
- Görev 04: Hizmetler sayfası; tek sayfalı, ikonlu ve mobil uyumlu accordion yapısıyla tamamlandı.
- Görev 05: Mobil ekspertiz sayfası; hizmet bölgesi, kapsam sınırı, süreç ve iletişim CTA'larıyla tamamlandı.
- Görev 06: Uzaktan ekspertiz sayfası; paket seçimi, şubede inceleme, rapor iletimi ve uzmanla birebir telefon görüşmesi akışıyla tamamlandı.
- Görev 07: Rapor sorgulama sayfası gerçek panel public endpoint'ine bağlandı; demo veri kaldırıldı.
- Görev 08: Randevu sayfası; telefon ve hazır mesajlı WhatsApp öncelikli akış, çalışma saatleri ve şube bilgileriyle tamamlandı.
- Görev 09: Galeri ve kampanyalar sayfaları; tek galeri alanı ile aktiflik/tarih sonlandırma davranışlı kampanya altyapısıyla tamamlandı.
- Görev 10: Blog; dört başlangıç kategorisi, mobil listeleme, dinamik yazı rotaları, semantik makale yapısı ve Article SEO metadata modeliyle tamamlandı.
- Görev 11: Kurumsal sayfalar; Hakkımızda, Bayilik ve İnsan Kaynakları sayfaları, doğrudan iletişim kanalları ve taahhüt içermeyen başlangıç içerikleriyle tamamlandı.
- Görev 12: İletişim ve yasal sayfalar; doğrudan iletişim akışları ile KVKK, aydınlatma ve gizlilik sayfalarıyla tamamlandı. Çerez sayfası kullanıcı talebiyle kaldırıldı.
- Görev 13: Paketler, hizmetler, kampanyalar, blog, galeri, şubeler, ana sayfa ve global ayarlar için WordPress yönetimi ve build-time REST bağlantısı tamamlandı.
- Görev 14: Metadata, canonical, sitemap, robots, structured data, 404, responsive görseller ve takip event arayüzü tamamlandı.
- Görev 15: Otomatik statik QA tamamlandı; gerçek cihaz matrisi bekliyor.
- Görev 16: Teslim öncesi kaynak, placeholder, entegrasyon, bağlantı, performans ve yayın hazırlığı denetimi tamamlandı.

## İçerik mimarisi

Public sayfalar içerikleri `src/data/cms` giriş noktasından alır. Geliştirmede Git ile sürümlenen onaylı snapshot kullanılır. Production build, `CMS_API_URL` üzerinden WordPress içeriğini alır; görselleri WebP olarak statik pakete kopyalar. Tarayıcı WordPress'e istek göndermez. Production build'de CMS yanıtı alınamazsa build hata verir ve Cloudflare son başarılı deployment'ı canlı tutar.

Ana sayfa, mobil ekspertiz ve galeri görselleri gerçek işletme fotoğraflarıyla değiştirilmelidir. Paket fiyatlarındaki `1xxx TL` değerleri CMS bağlantısına kadar bilinçli olarak korunmaktadır.

## Hızlı başlangıç

Gereksinim: Node.js `22.13.0` veya üzeri.

```bash
npm ci
cp .env.example .env
npm run dev
```

Rapor sorgulama gerçek panel backend'ine bağlıdır. Varsayılan production adresi
`https://panel.noktagarage.com/api/public/report-query` olur; yerel veya staging ortamında
`.env` içindeki `PUBLIC_REPORT_QUERY_ENDPOINT` ile değiştirilebilir. Tarayıcıya gömülen demo
rapor kaydı yoktur.

## Kontrol komutları

```bash
npm run check
npm run build:local
npm run audit:site
npm run audit:seo
npm run audit:qa
```

CMS bağlı production build:

```bash
CMS_API_URL='https://cms.noktagarage.com/?rest_route=/nokta-garage/v1/content' npm run build
```

Kurulum ve canlıya geçiş için `docs/DEPLOYMENT.md`, geliştirme devri için `docs/HANDOFF.md` dosyasını okuyun.
