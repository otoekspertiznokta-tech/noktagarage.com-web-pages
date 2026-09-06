# Nokta Garage — Kurulum, Canlıya Geçiş ve Teslim Planı

Bu belge, kaynak kodu hazır durumdan müşterinin içerik girebildiği canlı sisteme geçirmek için uygulanacak sıradır. Parolalar, deploy hook URL'si ve erişim anahtarları Git'e yazılmaz.

## 1. Hedef mimari

```text
Müşteri WordPress'te Yayınla/Güncelle
  -> Nokta Garage eklentisi Cloudflare Deploy Hook'u çağırır
  -> Cloudflare Pages `npm run build` çalıştırır
  -> Astro WordPress public içerik endpoint'ini build sırasında okur
  -> WordPress görselleri indirilir, WebP'ye çevrilir ve statik pakete eklenir
  -> başarılı build noktagarage.com'a geçer

Ziyaretçinin rapor sorgusu
  -> https://panel.noktagarage.com/api/public/report-query
  -> yalnız panelde üretilmiş ve saklama süresi devam eden aktif/pasif rapor özeti
  -> içe aktarılmış PDF'ler sonuç vermez
```

WordPress için MariaDB zorunludur. WordPress içeriği ve yönetici hesaplarını MariaDB'de; yüklenen görselleri WordPress volume'unda saklar. Public site statiktir ve kendi veritabanına ihtiyaç duymaz.

## 2. Kaynak kod sahipliği

Public site ve WordPress eklentisi müşterinin GitHub hesabındaki ayrı bir repository'de tutulmalıdır. Panel repository'si müşteriye devredilecek public site repository'sine dahil edilmemelidir.

Cloudflare Pages ayarları:

- Production branch: `main`
- Root directory: repository yalnız siteyi içeriyorsa boş; monorepo ise `nokta-garage-web-site`
- Build command: `npm run build`
- Build output: `dist`
- Node.js: `24`
- Environment variable: `CMS_API_URL=https://cms.noktagarage.com/?rest_route=/nokta-garage/v1/content`

`npm run build` production için CMS'yi zorunlu tutar. CMS ulaşılamazsa deployment başarısız olur; Cloudflare Pages son başarılı sürümü yayında bırakır.

## 3. WordPress kurulumu — Coolify

1. Coolify'da yeni bir Docker Compose uygulaması oluşturun.
2. `wordpress/docker-compose.yml` içeriğini kullanın.
3. `wordpress/.env.example` içindeki iki parolayı birbirinden farklı, uzun rastgele değerlerle değiştirin.
4. WordPress servisini `cms.noktagarage.com` alan adına bağlayın ve HTTPS'i etkinleştirin.
5. Kalıcı yedek kapsamına `database_data` ile `wordpress_data` volume'larını birlikte alın.
6. İlk kurulum ekranında site adı, yönetici kullanıcı adı, güçlü parola ve işletme e-postasını girin. Yönetici kullanıcı adı `admin` olmamalıdır.
7. Yönetim panelinde **Eklentiler > Nokta Garage İçerik Yönetimi** eklentisini etkinleştirin.
8. **Ayarlar > Kalıcı Bağlantılar** ekranında `Yazı ismi` seçip kaydedin.

Eklenti ilk etkinleştirmede onaylı başlangıç paketlerini, hizmetleri, dört blog yazısını, galeri yer tutucularını, Lüleburgaz şubesini, ana sayfa alanlarını ve genel işletme ayarlarını bir kez oluşturur. Eklentiyi kapatıp açmak mevcut müşteri içeriğini silmez veya yeniden yazmaz.

## 4. WordPress içerik girişi

Yayın öncesinde müşteriyle birlikte:

1. **Paketler** menüsünden `1xxx TL` değerlerini gerçek fiyatlarla değiştirin; gerekiyorsa önceki fiyatı girin.
2. **Galeri**, **Paketler**, **Hizmetler** ve **Site Sayfaları** alanlarına onaylı gerçek işletme görsellerini yükleyin.
3. Dört başlangıç blog yazısını ve kapak görsellerini kontrol edin.
4. **Şubeler** altında adres, telefon, e-posta, çalışma saati ve Maps bağlantısını son kez kontrol edin.
5. **Ayarlar > Nokta Garage** altında genel iletişim bilgilerini ve hazır WhatsApp metnini kontrol edin.
6. Tasarım/layout alanı WordPress'ten değiştirilemez; CMS yalnız onaylanmış yerleşimdeki içeriği yönetir.

Taslak kayıtlar public API'ye çıkmaz. `Yayınla/Güncelle` sonrası Cloudflare build tamamlanana kadar mevcut canlı içerik görünmeye devam eder.

## 5. Otomatik Cloudflare yayını

1. Cloudflare Pages projesinde **Settings > Builds > Deploy hooks** bölümünden production branch için bir hook oluşturun.
2. Oluşan gizli URL'yi WordPress'te **Ayarlar > Nokta Garage > Cloudflare Pages Deploy Hook** alanına yapıştırın.
3. Bir içerikte küçük bir güncelleme yapıp **Güncelle** deyin.
4. Cloudflare deployment'ın tetiklendiğini ve 1–3 dakika içinde `Success` olduğunu doğrulayın.
5. Canlı sayfada değişikliğin göründüğünü kontrol edin.

Eklenti, aynı kayıt işlemi sırasında oluşan mükerrer tetikleri 20 saniye boyunca birleştirir. Deploy hook URL'si public REST yanıtına hiçbir zaman eklenmez.

## 6. DNS ve alan adları

- `noktagarage.com`: Cloudflare Pages custom domain
- `www.noktagarage.com`: ana domaine kalıcı yönlendirme
- `cms.noktagarage.com`: Coolify WordPress servisi
- `panel.noktagarage.com`: mevcut panel/backend; public rapor isteği burada kalır

HTTPS tamamlanmadan WordPress'e deploy hook veya müşteri hesabı tanımlamayın. CMS alan adı arama motorlarına `noindex, nofollow` gönderir ve ziyaretçiyi yönetim ekranına yönlendirir.

## 7. Rapor sorgulama canlı kontrolü

Panel backend deploy edildikten sonra aşağıdaki durumları gerçek production verisiyle doğrulayın:

- Üretilmiş aktif rapor + doğru plaka/numara: ayrıntılı sonuç kartı
- Üretilmiş pasif rapor + doğru plaka/numara: ayrıntılı sonuç kartı
- İçe aktarılmış PDF + doğru bilgiler: bulunamadı
- Yanlış plaka veya numara: genel bulunamadı mesajı
- 10 isteği aşan kısa süreli kullanım: genel servis kullanılamıyor durumu
- `noktagarage.com` ve `www` dışındaki origin: CORS reddi

QR ile çalışan `/rapor-dogrulama/{token}` akışında değişiklik yapılmaz.

## 8. Yayın öncesi teknik kontrol

```bash
npm ci
npm run check
npm run build:local
npm run audit:site
npm run audit:seo
npm run audit:qa
```

Production CMS denemesi:

```bash
CMS_API_URL='https://cms.noktagarage.com/?rest_route=/nokta-garage/v1/content' npm run build
```

Ardından iPhone Safari, Android Chrome ve masaüstü Chrome/Firefox üzerinde menü, accordion, telefon, WhatsApp, yol tarifi ve rapor sonuç durumları kontrol edilir.

## 9. Search Console ve Google Business

İlk yayında Analytics veya Ads eklenmez.

1. Search Console'da Domain property oluşturup verilen TXT kaydını Cloudflare DNS'e ekleyin.
2. Doğrulama sonrası `https://noktagarage.com/sitemap.xml` gönderin.
3. URL Denetleme ile ana sayfanın canlı testini çalıştırın ve dizine eklenmesini isteyin.
4. Google Business profilinde web sitesi alanını `https://noktagarage.com`, randevu/iletişim hedefini uygun public sayfa olarak güncelleyin.
5. Business profilindeki telefon, çalışma saatleri, adres ve harita pini ile sitedeki değerlerin aynı olduğunu doğrulayın.

## 10. Yedekleme ve geri dönüş

- MariaDB: her gece otomatik yedek, en az 14 günlük saklama
- WordPress uploads: her gece otomatik yedek, en az 14 günlük saklama
- Ayda bir geri yükleme denemesi
- Eklenti/site kaynağı: GitHub ana branch ve etiketli teslim sürümü
- Hatalı frontend içeriği: Cloudflare Pages'te son başarılı deployment'a rollback
- Hatalı WordPress değişikliği: WordPress revision'dan geri alıp tekrar güncelleme

Veritabanı ve uploads birlikte yedeklenmelidir; yalnız birini almak tam geri yükleme sağlamaz.

## 11. Teslim kabul listesi

- [ ] Müşteri GitHub repository'sinde kaynak kod mevcut
- [ ] WordPress ve MariaDB Coolify'da kalıcı volume + yedekle çalışıyor
- [ ] Müşteri editör hesabıyla giriş yapabiliyor
- [ ] Gerçek fiyatlar ve gerçek görseller girildi
- [ ] WordPress güncellemesi 1–3 dakikada canlıya geçiyor
- [ ] Rapor sorgusunun güvenlik ve sonuç senaryoları geçti
- [ ] Alan adı, `www` yönlendirmesi ve SSL geçti
- [ ] Search Console doğrulandı ve sitemap gönderildi
- [ ] Google Business bilgileri eşleşiyor
- [ ] Gerçek mobil cihaz kontrolleri geçti
- [ ] Yedek ve rollback işlemi denendi
