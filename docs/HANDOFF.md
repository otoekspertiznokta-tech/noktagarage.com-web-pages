# Nokta Garage — Geliştirici Devir Notu

Bu belge, mevcut Astro kaynak kodunu devralacak geliştirici veya Codex oturumu için başlangıç noktasıdır.

## 1. Kurulum

Gereksinim: Node.js `22.13.0` veya üzeri.

```bash
npm ci
cp .env.example .env
npm run dev
```

Production kontrolü:

```bash
npm run check
npm run build:local
npm run audit:site
npm run audit:seo
npm run audit:qa
```

## 2. Mimari

- Framework: Astro 7, TypeScript ve statik çıktı
- Sayfalar: `src/pages`
- Ortak bileşenler: `src/components`
- Ortak sayfa düzeni: `src/layouts`
- Stil sistemi: `src/styles`
- Statik içerik ve CMS modeli: `src/data/cms`
- Yasal içerikler: `src/data/legal-pages.ts`
- Rapor sorgulama sınırı: `src/lib/report-query-adapter.ts`
- Görsel ve favicon dosyaları: `public`
- Cloudflare Pages kurulum ve statik çıktı ayarları: `DEPLOYMENT.md` ve `astro.config.mjs`

## 3. İlk tamamlanması gereken entegrasyonlar

### Rapor sorgulama API'si

Production varsayılanı aşağıdaki adrestir; farklı bir ortam kullanılacaksa `.env` ile ezilir:

```dotenv
PUBLIC_REPORT_QUERY_ENDPOINT=https://panel.noktagarage.com/api/public/report-query
```

Frontend bu adrese `POST` ile plaka ve rapor numarası gönderir. Yanıt sözleşmesi, hata durumları ve zaman aşımı bilgileri `TASK16_FINAL_AUDIT.md` dosyasında kayıtlıdır.

Tarayıcıya gömülü demo kayıt yoktur. Backend yalnız panelde üretilmiş, saklama süresi devam
eden aktif veya pasif raporları döndürür; dışarıdan içe aktarılan PDF'ler sonuç vermez. CORS
yalnız gerçek site alan adlarına ve credentials olmadan açıktır.

### CMS

- Coolify/Docker tanımı: `wordpress/docker-compose.yml`
- Ücretsiz özel eklenti: `wordpress/plugins/nokta-garage-content`
- Public içerik endpoint'i: `/wp-json/nokta-garage/v1/content`
- Build senkronizasyonu: `scripts/sync-wordpress-content.mjs`
- Production build CMS ulaşılamazsa bilinçli olarak durur; eksik/bozuk içerik canlıya geçmez.
- WordPress medya dosyaları build sırasında en fazla 1920 px olacak şekilde, büyütmeden WebP'ye çevrilir ve public deployment içine alınır.
- WordPress Publish/Update işlemi, ayarlardaki gizli Cloudflare Deploy Hook adresini tetikler.

Kurulumun tamamı ve rollback akışı `DEPLOYMENT.md` içindedir.

### Ticari içerik ve görseller

- `1xxx TL` paket fiyatlarını onaylı gerçek fiyatlarla değiştirin.
- Ana sayfa, mobil ekspertiz ve galeri görsellerini gerçek işletme fotoğraflarıyla değiştirin.
- Telefon, e-posta, adres, çalışma saatleri ve harita hedefini son kez doğrulayın.
- Aktif kampanya eklenecekse tarih ve yayın durumunu CMS'den yönetin.

## 4. Alan adı ve SEO

Canonical, Open Graph, sitemap ve robots adresleri `https://noktagarage.com` için hazırlanmıştır. Nihai yayında bu alan adını Sites projesine bağlayın; DNS, SSL, ana alan adı ve yönlendirmeleri doğrulayın.

Alan adı değişirse `src/layouts/SiteLayout.astro`, sitemap üretimi ve `public/robots.txt` birlikte güncellenmelidir.

## 5. Kalan manuel QA

- iPhone Safari: dikey/yatay, Hareketi Azalt açık/kapalı
- iPad Safari
- Android Chrome: dikey/yatay
- Samsung Internet
- Masaüstü Chrome, Edge, Firefox ve Safari
- Menü, geri/ileri gezinme, accordion ve paket karşılaştırma
- Sabit iletişim çubuğu ve yumuşak kaydırma
- Telefon, WhatsApp, e-posta ve yol tarifi bağlantıları
- Rapor sorgulamada başarılı, bulunamadı, servis hatası ve doğrulama hatası
- Yön değişiminden sonra yatay taşma

`prefers-reduced-motion: reduce` aktifken animasyonların yaklaşık anında tamamlanması bilinçli erişilebilirlik davranışıdır. Ürün kararı olmadan bu davranışı kaldırmayın.

## 6. Yayın güvenliği

Yeni sürüm yayınlamadan önce:

1. `npm run build` ve üç audit komutunu çalıştırın.
2. Rapor sorgusunun panel production endpoint'ine ulaştığını doğrulayın.
3. Özel alan adı ve dış bağlantıları gerçek cihazda test edin.
4. Kaynağı commit edin ve yalnızca doğrulanan commit'i Sites sürümü olarak kaydedin.
5. Public yayın için kullanıcı onayı alın.

## 7. Referans belgeler

- `NOKTA_GARAGE_SITE_SPEC.md`: ürün ve içerik şartnamesi
- `NOKTA_GARAGE_SITES_TASKS.md`: görev sırası ve kabul ölçütleri
- `TASK16_FINAL_AUDIT.md`: son denetim, riskler ve API sözleşmesi
