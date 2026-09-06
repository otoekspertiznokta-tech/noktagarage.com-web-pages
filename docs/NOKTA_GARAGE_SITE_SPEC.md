# Nokta Garage Oto Ekspertiz - Public Web Sitesi Ana Şartnamesi

## 1. Amaç

**Nokta Garage Oto Ekspertiz** için hızlı, mobil öncelikli, SEO'ya hazır ve kurumsal bir public web sitesi oluşturulacaktır. Site profesyonel, otomotiv sektörüne uygun, güven veren, kolay kullanılan ve görsel olarak kontrollü hissettirmelidir. Jenerik AI ile üretilmiş web sitesi görünümünden özellikle kaçınılmalıdır.

Ana dönüşüm hedefleri:
- Telefon araması
- WhatsApp konuşması
- Yol tarifi / fiziksel ziyaret
- Rapor orijinallik doğrulaması
- Bayilik talebi
- Randevu talebi

Web sitesi modern **Android ve Apple/iOS cihazlarda**, özellikle iPhone/iPad Safari ve Chromium tabanlı Android tarayıcılarda sorunsuz kullanılabilmelidir.

---

## 2. Teknoloji Mimarisi

### Public frontend
- Astro
- Static Site Generation (SSG)
- Cloudflare Pages üzerinde barındırılacak
- Ana public domain: `noktagarage.com`
- `www.noktagarage.com`, canonical ana domaine yönlendirilecek

### CMS
- Headless WordPress
- VPS / Coolify üzerinde barındırılacak
- CMS domaini: `cms.noktagarage.com`
- WordPress yalnızca içerik yönetimi için kullanılacak, sayfaları doğrudan render etmeyecek
- Astro, build sırasında WordPress REST API / kontrollü custom field yapısından içerikleri alacak
- Yayınlanan içerik değişiklikleri webhook/deploy hook ile yeni frontend build'i tetikleyecek
- Başarısız build, son başarılı public deployment'ı hiçbir zaman devre dışı bırakmamalı

### Mevcut ekspertiz backend'i
- Mevcut panel backend'i: `panel.noktagarage.com`
- Yalnızca gerekli yerde, public manuel rapor sorgulamada kullanılacak
- WordPress ekspertiz raporlarını hiçbir zaman saklamamalı veya işlememeli

### Görseller
- Müşteri orijinal görselleri WordPress'e yükler
- Frontend build sırasında gereken görseller alınır ve statik deployment içine optimize edilerek eklenir
- Public sayfalar runtime'da `cms.noktagarage.com/uploads/...` adreslerine bağımlı olmamalı
- Responsive görsel boyutları kullanılmalı
- Uygun yerlerde WebP/AVIF üretilebilmeli
- Görsel kaliteyi belirgin şekilde bozan sıkıştırma yapılmamalı
- Düşük çözünürlüklü görseller büyütülmemeli/upscale edilmemeli
- En-boy oranı ve keskinlik korunmalı
- Geliştirme ve tasarım onayı aşamalarında, gerçek işletme fotoğrafları hazır değilse açıkça geçici olan örnek AI görseller kullanılabilir
- Geçici AI görseller production yayını öncesinde gerçek ve onaylanmış işletme fotoğraflarıyla değiştirilmelidir

---

## 3. Marka ve Görsel Yön

### Tasarım karakteri
- Kurumsal
- Mekanik / otomotiv odaklı
- Sade
- Güven veren
- Mobil öncelikli
- Hızlı ve pürüzsüz

Kaçınılacaklar:
- Jenerik AI görünümlü gradient'ler
- Her yerde glassmorphism
- Neon efektler
- Aşırı yuvarlak pill bileşenleri
- Stock otomobil reklamı estetiği
- Uzun metin duvarları
- Aşırı agresif siyah/kırmızı tuning sitesi görünümü
- Gereksiz geniş beyaz boşluklar
- Ağır parallax
- Otomatik oynayan video arka planları
- Particle efektleri
- Kullanıcı etkileşimini geciktiren dekoratif animasyonlar

### Renk sistemi
Ana görsel dil yalnızca üç renk ailesinden oluşacaktır:
- Kırmızı
- Gri
- Beyaz

Ana sayfa ve güçlü marka alanlarında göz yormayan, koyu ve kontrollü bir kırmızı zemin kullanılacaktır. Parlak, neon veya doygunluğu rahatsız edici kırmızılardan kaçınılmalıdır.

Kullanılacak yaklaşım:
- Ana zemin ve güçlü marka alanlarında göz almayan koyu kırmızı
- Kartlar, tipografi, ikonlar ve yüzey ayrımları için beyaz ve gri tonları
- CTA ve durum farklılıkları aynı kırmızı, gri ve beyaz sistemi içinde çözümlenmeli
- WhatsApp dahil hiçbir arayüz öğesi için ayrı bir yeşil renk kullanılmamalı
- Saf beyaz geniş yüzeyler yalnızca denge gerektiğinde seçici biçimde kullanılmalı

Telefon parlaklığı yüksekken ekran gözü yormamalı ve parlak beyaz ışık kaynağı hissi vermemelidir.

### Görsel referans yönü
- Mobil tasarım dili ve hızlı erişim yapısı için `https://pilotgarage.com/tr` sitesinin mobil görünümü yapısal referanstır
- Özellikle kenardan kenara ilerleyen, iki sütunlu, büyük dokunma alanlarına sahip hızlı erişim kartlarının ritminden yararlanılmalıdır
- Pilot Garage tasarımı doğrudan kopyalanmamalı; Nokta Garage logosu, kırmızı-gri-beyaz renk sistemi, içerik hiyerarşisi ve özgün bileşen detaylarıyla yeniden yorumlanmalıdır

### Tipografi
- Modern, yüksek okunabilirliğe sahip sans-serif
- Startup estetiğinden çok kurumsal karakter
- Güçlü başlıklar fakat mobilde aşırı büyük fontlar yok
- Kompakt ve rahat okunur satır uzunlukları
- Ağır font yükleme stratejisinden kaçınılmalı

### İkonlar
- Tek ve tutarlı bir ikon ailesi kullanılmalı
- Tercihen SVG
- Alakasız ikon stilleri karıştırılmamalı
- İkonlar bulanıklaşmamalı veya bozulmamalı
- Otomotiv ikonları sade ve kolay anlaşılır olmalı

---

## 4. UX İlkeleri

### Mobil öncelik
Telefon deneyimi ana tasarım hedefidir.

Zorunlu özellikler:
- Yeterince büyük dokunma alanları
- Başparmakla rahat erişilen CTA'lar
- Yanlışlıkla yatay overflow olmaması
- Hover'a bağımlı etkileşim olmaması
- Mobilde pressed/active state'lerin bulunması
- Sticky bileşenlerin içeriği kapatmaması
- Akıcı scroll ve hızlı etkileşim

### Etkileşim ipuçları / affordance
Gizli etkileşim olmayacak.

Bir alan açılabilir, kaydırılabilir, seçilebilir veya navigasyon amacı taşıyorsa kullanıcı küçük bir görsel ipucuyla bunu anlayabilmelidir.

Örnekler:
- Accordion: chevron ikonu, açılınca yön değiştirir
- Dropdown: aşağı chevron
- Navigasyon kartı: ok veya küçük chevron
- Yatay carousel: sonraki öğenin bir kısmı ve/veya küçük oklar
- Galeri: oklar ve gerekiyorsa konum göstergesi
- Paket karşılaştırma kartı: açık seçili/seçili değil durumu
- Hamburger: standart menü ikonu

Yatay kaydırma yalnızca gerçek fayda sağladığında kullanılmalı. Mobilde varsayılan akış dikeydir.

### Hareket ve animasyon
Animasyonlar akıcı hissettirmeli fakat kullanıcıyı yavaşlatmamalıdır.

Sadece kontrollü hareketler kullanılacak:
- Açılış marka animasyonu
- Gerekli yerlerde hafif section fade/translate
- Kart hover/press geri bildirimi
- Accordion aç/kapa
- Dropdown/menü geçişleri

Genel etkileşim geçişleri kısa ve hızlı olmalı; çoğunlukla yaklaşık 150-300 ms.

`prefers-reduced-motion` desteklenmelidir.

### Açılış animasyonu
- Yaklaşık 1.6-2.0 saniye
- Non-blocking logo/marka reveal
- Sayfa arka planda zaten render/yükleniyor olmalı
- Tercihen `sessionStorage` ile tarayıcı oturumu başına bir kez
- Particle, glow patlaması, dönen logo, bekleme ekranı hissi olmamalı

---

## 5. Tarayıcı ve Cihaz Uyumluluğu

Site güvenilir biçimde çalışmalıdır:
- Güncel iPhone Safari
- Güncel iPad Safari
- Güncel Android Chrome
- Mümkün olduğunda Samsung Internet
- Desktop Chrome
- Desktop Safari
- Desktop Edge
- Desktop Firefox

### iOS'a özel mühendislik gereksinimleri
Desktop Chrome'da çalışan bir bileşenin iOS Safari'de aynı davranacağı varsayılmamalıdır.

Gereksinimler:
- Mümkün olduğunca native semantik HTML form elemanları kullanılmalı
- Her input açık bir `<label>` ile ilişkilendirilmeli
- Uygun `type`, `inputmode`, `autocomplete`, `name` ve gerektiğinde `enterkeyhint` kullanılmalı
- Native etkileşimi bozabilecek yalnızca CSS ile taklit edilmiş form kontrollerine bağımlı olunmamalı
- iOS sanal klavyesinin kapatabileceği sabit yükseklikli form container'larından kaçınılmalı
- Mobil tam ekran bölümlerde zorunlu `100vh` kullanılmamalı; gerekirse `dvh` gibi modern viewport birimleri ve güvenli fallback kullanılmalı
- Sticky/fixed mobil kontroller `env(safe-area-inset-top/right/bottom/left)` değerlerini hesaba katmalı
- Sticky CTA, iPhone home indicator'ın üzerinde erişilebilir kalmalı
- Global zoom kapatılmamalı
- Safari'nin otomatik zoom yapabileceği form inputlarında 16px altı fonttan kaçınılmalı
- Modal/menüler body scroll'u doğru yönetmeli; Safari'yi kullanılamaz scroll durumunda bırakmamalı
- Hover'a bağımlı menüler olmamalı
- Focus/blur, sanal klavye açılması, ekran döndürme ve sayfaya geri dönüş test edilmeli
- Safari desteği olmayan JS API'leri fallback olmadan kullanılmamalı
- Native date/time inputları kullanılacaksa Safari'de ayrıca test edilmeli
- Autofill sonrası formlar kullanılabilir kalmalı

### Android'e özel gereksinimler
- Chrome sanal klavye ve viewport resize davranışı test edilmeli
- Autofill test edilmeli
- Modal/mobil navigasyon varsa Android geri tuşu test edilmeli
- `100vw` + scrollbar/padding kaynaklı yatay taşmadan kaçınılmalı
- Tarayıcı üst/alt bar yüksekliği değişse bile sticky/fixed CTA kullanılabilir kalmalı

### Dinamik UI gereksinimleri
Accordion, karşılaştırma, menü, rapor formu, randevu UI ve galeri etkileşimleri yalnızca desktop responsive simülasyonla değil, gerçek dokunma davranışıyla test edilmelidir.

---

## 6. Header ve Navigasyon

### Desktop header
- Logo
- Paketler
- Hizmetler
- Kurumsal
- İletişim

`Hizmetler` dropdown:
- Hizmetler
- Mobil Ekspertiz
- Uzaktan Ekspertiz

`Kurumsal` dropdown:
- Hakkımızda
- Bayilik
- İnsan Kaynakları

Rapor Sorgula doğrudan desktop header'a konulmamalı.

### Mobil header
- Logo
- Hamburger

Hamburger menü; ikincil sayfalar dahil tüm faydalı navigasyonu gösterebilir:
- Paketler
- Hizmetler
- Mobil Ekspertiz
- Uzaktan Ekspertiz
- Rapor Sorgula
- Randevu
- Kampanyalar
- Galeri
- Blog
- Hakkımızda
- Bayilik
- İnsan Kaynakları
- İletişim

---

## 7. Public Sitemap

- `/`
- `/ekspertiz-paketleri`
- `/hizmetler`
- `/mobil-ekspertiz`
- `/uzaktan-ekspertiz`
- `/rapor-sorgula`
- `/randevu`
- `/galeri`
- `/kampanyalar`
- `/blog`
- `/blog/[slug]`
- `/hakkimizda`
- `/bayilik`
- `/insan-kaynaklari`
- `/iletisim`
- `/kvkk`
- `/aydinlatma-metni`
- `/gizlilik-politikasi`
- `/cerez-politikasi`

Gelecekte birden fazla şube oluştuğunda:
- `/subeler/[sube-slug]`

Tek şube varken işletme gereksinimi değişmedikçe public `/subeler` liste sayfası oluşturulmayacak.

---

## 8. Ana Sayfa

Ana sayfa kompakt kalmalı. Uzun bir landing page'e dönüşmemelidir.

Önerilen sıra:
1. Açılış marka animasyonu
2. Header
3. Kompakt hero
4. Hero'nun hemen altında konum / Google Maps alanı
5. Hızlı Erişim grid'i
6. İsteğe bağlı aktif kampanya teaser'ı
7. Kompakt kalıyorsa küçük galeri/blog teaser alanı
8. Gerekliyse final dönüşüm CTA'sı
9. Footer

### Hero
- Mümkün olduğunda gerçek işletme / ekspertiz fotoğrafı
- Kısa profesyonel başlık
- Kısa destek cümlesi
- Primary CTA: Hemen Ara
- Secondary CTA: WhatsApp'tan Yaz
- Uzun kurumsal paragraf yok

### Konum
- Hero'nun hemen altında
- Adres / şube referansı
- Hafif map preview/embed stratejisi
- `Yol Tarifi Al`
- Fold üstünde performansı bozan ağır harita yüklemesinden kaçınılmalı

### Hızlı Erişim
Ana sayfanın temel navigasyon mekanizmasıdır.

Mobil:
- Büyük, 2 sütunlu, rahat dokunulan kart sistemi
- Basit otomotiv hızlı erişim yapılarından yapısal olarak ilham alabilir ama kopya olmamalı
- Küçük ikon + kısa etiket + ok/chevron affordance

İçermeli:
- Ekspertiz Paketleri
- Hizmetler
- Mobil Ekspertiz
- Uzaktan Ekspertiz
- Rapor Sorgula
- Randevu
- Kampanyalar
- Galeri
- Bayilik Başvurusu
- İletişim / Yol Tarifi

Desktop:
- Aynı görsel dili koruyarak 3-4 sütuna uyarlanabilir

Ana sayfada tüm paketler veya tüm hizmetler listelenmemeli.

---

## 9. Ekspertiz Paketleri Sayfası

URL: `/ekspertiz-paketleri`

Her paket için ayrı sayfa olmayacak.

### Mobil UX
Kapalı accordion kartları kullanılacak.

Kapalı kart gösterir:
- Paket adı
- Fiyat
- Açma chevron'u

Açık kart gösterir:
- Dahil hizmetler
- İsteğe bağlı kısa açıklama

Kullanılabilirlik bozulmuyorsa aynı anda birden fazla kart açık kalabilir.

### Paket karşılaştırma
Zorunludur.

Mobilde yedi sütunlu tablo kullanılmayacak.

Mobil davranış:
- Kullanıcı iki paket seçer
- Yan yana veya mobil için uygun stacked iki paketli karşılaştırma arayüzü
- Hizmet satırlarında dahil/değil durumu
- Açık seçim state'leri
- Seçili paketlerin kolayca değiştirilebilmesi

### Mevcut başlangıç paket verileri
Fiyatlar kesinleşene kadar geçici placeholder'dır.

1. **Standart** - `1xxx TL`
   - Motor Mekanik
   - Mekanik Alt
   - Boya Kaporta
   - Kaporta Boyama
   - Direk Boyama
   - Şasi Boyama

2. **Kaporta Kontrol** - `1xxx TL`
   - Boya Kaporta
   - Kaporta Boyama
   - Direk Boyama
   - Şasi Boyama

3. **Motor Kontrol** - `1xxx TL`
   - Motor Mekanik
   - Mekanik Alt
   - Dyno Motor Performans

4. **Dyno Motor Test** - `1xxx TL`
   - Dyno Motor Performans

5. **Detaylı** - `1xxx TL`
   - Motor Mekanik
   - Mekanik Alt
   - Boya Kaporta
   - Kaporta Boyama
   - Direk Boyama
   - Şasi Boyama
   - Dyno
   - Fren
   - Süspansiyon
   - Yanal Kayma
   - İç Döşeme ve Cam
   - Dış Ayna ve Aydınlatma
   - Lastik

6. **Detaylı ve Airbagli** - `1xxx TL`
   - Detaylı paketindeki hizmetler
   - Hava Yastığı Kontrolleri

7. **Tek Airbag** - `1xxx TL`
   - Hava Yastığı Kontrolleri

Önemli:
- `Araç Resimleri` bir hizmet değildir
- Uydurma "kaç nokta kontrol" sayıları gösterilmemeli
- Paket sırası, aktiflik ve öne çıkan durumu CMS'den yönetilmeli
- Paket görselleri opsiyoneldir, zorunlu değildir

Mobilde sticky alt dönüşüm alanı `Ara | WhatsApp` gösterebilir.

---

## 10. Hizmetler Sayfası

URL: `/hizmetler`

Her hizmet için ayrı URL olmayacak.

Paketler sayfasındaki tek sayfalı accordion/kart yaklaşımı kullanılacak.

Gereksinimler:
- Mobilde kolay taranabilir kartlar
- Tutarlı ikonografi
- Açılabilir detaylar
- Belirgin chevron affordance
- CMS kontrollü sıra ve aktiflik

`Araç Resimleri` hizmet olarak gösterilmemelidir.

---

## 11. Mobil Ekspertiz Sayfası

URL: `/mobil-ekspertiz`

Bilinen gerçekler:
- Hizmet bölgesi: Trakya + İstanbul Avrupa Yakası
- Dükkândaki tam ekspertiz hizmetiyle aynı kapsamdaymış gibi anlatılmamalı
- Mevcut bilgiye göre çoğunlukla boya/kaporta ağırlıklıdır; kesin kapsam ve fiyat müşteri tarafından CMS üzerinden düzeltilecektir

Sayfa yapısı:
- Kompakt hero
- Hizmet bölgesi
- Kısa hizmet açıklaması
- Kısa süreç
- Mümkün olduğunda gerçek mobil ekspertiz fotoğrafı
- Telefon/WhatsApp CTA

Başlangıç WhatsApp mesajı:
`Merhaba, mobil ekspertiz hizmetiniz hakkında bilgi almak istiyorum.`

Kesin paket kapsamı uydurulmamalı.

---

## 12. Uzaktan Ekspertiz Sayfası

URL: `/uzaktan-ekspertiz`

Temel hizmet:
- Alıcı mevcut ekspertiz paketlerinden birini seçebilir
- Araç/satıcı Lüleburgaz şubesine gelir
- Ekspertiz yapılır
- Rapor iletilir
- Uzman alıcıyı arar ve bulguları birebir açıklar
- Alıcı doğrudan soru sorabilir

Temel değer önerisi:
**Sadece PDF rapor değil; doğrudan uzman açıklaması ve soru-cevap.**

Sayfa yapısı:
- Kompakt hero
- Nasıl çalışır
- Paket seçimi açıklaması
- Mümkün olduğunda gerçek fotoğraflar
- Telefon/WhatsApp CTA

Başlangıç WhatsApp mesajı:
`Merhaba, uzaktan ekspertiz hizmetiniz hakkında bilgi almak istiyorum.`

---

## 13. Rapor Sorgula Sayfası

URL: `/rapor-sorgula`

Amaç: yalnızca manuel orijinallik kontrolü.

Inputlar:
- Plaka
- Rapor No

Public başarılı sonuç:
`Raporunuz sistemde kayıtlıdır ve orijinaldir.`

Eşleşme yok sonucu:
`Girilen bilgilerle eşleşen bir rapor bulunamadı.`

Servis kullanılamıyor sonucu:
`Rapor sorgulama hizmetine şu anda ulaşılamıyor. Lütfen kısa süre sonra tekrar deneyin.`

Asla gösterilmemeli:
- Müşteri adı
- Telefon
- Kimlik bilgileri
- Şasi numarası
- Araç detayları
- Rapor detayları
- PDF rapor

API gereksinimleri:
- Karşılaştırmadan önce plaka formatını normalize et
- Rate limit
- Enumeration koruması
- Minimal response payload
- Güvenli CORS
- Input validation
- Bilgi sızıntısı olmaması
- NOT_FOUND ile SERVICE_UNAVAILABLE ayrılmalı
- Abuse oluşursa daha sonra Turnstile eklenebilir

Bu sayfada doğrulama görevini bozuyorsa normal sticky iletişim barı kullanılmamalıdır.

Mevcut QR tabanlı doğrulama ayrı kalacak ve bu proje tarafından yeniden tasarlanmayacaktır.

---

## 14. Randevu Sayfası

URL: `/randevu`

İlk sürümde bu sayfa korunacaktır.

İlk hedef:
- Randevu niyetini kolaylaştırmak
- Telefon/WhatsApp öncelikli akış
- Daha sonra özellikle istenmedikçe ağır bir rezervasyon backend'i oluşturmamak

Sayfa şunları içerebilir:
- Kısa açıklama
- Şube/çalışma saatleri
- `Ara`
- `WhatsApp'tan Randevu Al`
- Yalnızca ileride istenirse opsiyonel randevu talep alanları

Form eklenirse sanal klavye, autofill ve validation dahil iOS Safari ve Android Chrome'da dikkatle test edilmelidir.

---

## 15. Kampanyalar

URL: `/kampanyalar`

CMS alanları:
- Başlık
- Kısa açıklama
- Detay
- Görsel
- Başlangıç tarihi
- Bitiş tarihi
- Aktif
- CTA tipi/metni
- WhatsApp mesajı

Süresi dolan kampanyalar otomatik olarak görünmeyi bırakmalıdır.

Frontend statik olduğu için yalnızca build-time tarih kontrolüne güvenilmemelidir. Süresi dolan kampanya bir sonraki build'e kadar görünür kalmasın diye küçük bir client-side expiry kontrolü veya başka hafif yöntem kullanılmalıdır.

Geliştirme sırasında demo kampanyalar olabilir fakat gerçek yayından önce açıkça değiştirilip/doğrulanmalıdır.

---

## 16. Galeri

URL: `/galeri`

Basit tutulacak.

İçerik:
- Dükkân dış/iç fotoğrafları
- Cihazlar
- Ekspertiz süreci
- Uygun olduğunda ekip/çalışma fotoğrafları

Gereksinimler:
- Production'da yalnızca gerçek fotoğraflar
- AI ile üretilmiş galeri görselleri yok
- CMS'den ekle/sil/sırala/aktif-pasif
- İlk aşamada kategori filtresi yok
- Kullanılıyorsa lightbox/galeri navigasyonu açık olmalı
- Mobilde swipe/sonraki affordance görünür olmalı

---

## 17. Blog

URL'ler:
- `/blog`
- `/blog/[slug]`

Başlangıç kategorileri:
- Araç Alım Rehberi
- Ekspertiz Bilgileri
- Bakım ve Teknik Bilgiler
- Nokta Garage'dan

Blog listeleme:
- Basit mobil kartlar
- Kapak görseli
- Başlık
- Kısa özet
- Kategori/tarih

Tekil yazı:
- H1 başlık
- Tarih/kategori
- Kapak görseli
- Yazı içeriği
- Faydalıysa ilgili içerikler
- Uygunsa yazı sonunda dönüşüm CTA'sı

Blog ana SEO içerik kanallarından biridir.

---

## 18. Kurumsal Sayfalar

### Hakkımızda
Profesyonel ve kısa içerik kullanılmalı.

Güvenli anlatım:
`2018'den bu yana oto ekspertiz sektöründe edinilen tecrübe.`

Daha sonra doğrulanmadıkça Nokta Garage markasının 2018'de kurulduğu iddia edilmemeli.

Anlatılabilecekler:
- Farklı araç tipleri/yaşları/durumlarında geniş deneyim
- Dükkân/mobil/uzaktan ekspertiz alternatifleri
- Raporlama ve açıklama yaklaşımı

İşletme gerçek içerik sağlamadıkça jenerik ve boş misyon/vizyon kutularından kaçınılmalı.

### Bayilik
URL: `/bayilik`

Navigasyonda arka planda kalmamalı.

Erişim noktaları:
- Hızlı Erişim
- Kurumsal menüsü
- Footer

İlk aşamada başvuru formu yok.

Kullanılacaklar:
- Kısa tanıtım
- Düzenlenebilir başlangıç içeriği olarak avantajlar / süreç / gereksinimler
- Telefon
- WhatsApp
- E-posta

Başlangıç WhatsApp mesajı:
`Merhaba, Nokta Garage bayiliği hakkında bilgi almak istiyorum.`

### İnsan Kaynakları
URL: `/insan-kaynaklari`

İlk aşamada form yok.

Kullanılacaklar:
- Kısa içerik
- E-posta
- Telefon
- Opsiyonel `CV Gönder` mailto bağlantısı

---

## 19. İletişim Sayfası

URL: `/iletisim`

Mevcut başlangıç işletme verileri:
- Telefon / WhatsApp: `+90 553 218 21 36`
- E-posta: `otoekspertiznokta@gmail.com`
- Çalışma saatleri: Her gün, `08:00-18:00`
- Adres: `Atatürk Mahallesi, Yeni Sanayi Sitesi, A/4 Blok, 6. Sokak, No:64, 39750 Lüleburgaz/Kırklareli, Türkiye`
- Google Maps işletme URL'si: `https://share.google/5YHlpgYMIs2tCrZ8v`

CTA:
- Ara
- WhatsApp
- Yol Tarifi Al

İletişim formu zorunlu değildir.

İletişim bilgilerinin altında harita kullanılabilir.

Production öncesinde Google Business Profile işletme adı ve NAP tutarlılığı kontrol edilmelidir.

---

## 20. Footer

Desktop:
- Logo
- Kısa deneyim ifadesi
- Hizmetler
- Kurumsal
- Hızlı bağlantılar
- İletişim/adres/çalışma saatleri
- Verildiğinde sosyal medya bağlantıları
- Yasal bağlantılar

Mobil:
- Kompakt yapı
- Accordion kullanılabilir
- Accordion olduğu anlaşılır olmalı

Yasal bağlantılar:
- KVKK
- Aydınlatma Metni
- Gizlilik Politikası
- Çerez Politikası

---

## 21. WordPress Yönetim Modeli

Müşteri karmaşık standart WordPress arayüzüyle karşılaşmamalıdır.

Ana menüler:
1. Ana Sayfa
2. Paketler
3. Hizmetler
4. Kampanyalar
5. Blog
6. Galeri
7. Şubeler
8. Sayfalar
9. Site Ayarları

Mümkün olan yerlerde gereksiz WordPress menüleri/gürültüsü gizlenmelidir.

### Paket alanları
- Paket Adı
- Slug
- Kısa Açıklama
- Detaylı Açıklama
- Fiyat
- Opsiyonel eski/indirimli fiyat
- Opsiyonel görsel
- Bağlı Hizmetler
- Öne Çıkan
- Aktif/Pasif
- Sıralama
- CTA
- WhatsApp mesajı
- SEO başlığı
- SEO açıklaması

### Hizmet alanları
- Hizmet Adı
- Kısa Açıklama
- Detaylı Açıklama
- İkon/Görsel
- Aktif
- Sıralama
- SEO başlığı
- SEO açıklaması

### Blog alanları
- Başlık
- Slug
- Özet
- Block editor içerik
- Kapak görseli
- İçerik görselleri
- Kategori
- Opsiyonel yazar
- Yayın tarihi
- Taslak/Yayında
- SEO başlığı
- SEO açıklaması

### Galeri alanları
- Görsel
- Opsiyonel kısa açıklama
- Sıralama
- Aktif

### Kampanya alanları
- Başlık
- Kısa açıklama
- Detay
- Görsel
- Başlangıç/bitiş tarihleri
- Aktif
- CTA
- WhatsApp mesajı

### Şube alanları
- Ad
- Slug
- Şehir
- İlçe
- Tam adres
- Telefon
- WhatsApp
- E-posta
- Maps URL/embed
- Çalışma saatleri
- Görseller
- Açıklama
- Aktif
- SEO

### Site ayarları
- Marka adı
- Logo
- Gerekirse alternatif logo
- Favicon
- Ana telefon
- WhatsApp
- E-posta
- Sosyal medya bağlantıları
- Varsayılan WhatsApp mesajı
- Footer içeriği
- Copyright
- Maps
- Google Business linki
- Çalışma saatleri
- Varsayılan SEO başlığı
- Varsayılan SEO açıklaması
- Varsayılan sosyal paylaşım görseli

### Ana sayfa alanları
- Hero başlığı
- Hero alt başlığı
- Hero görseli
- CTA etiketleri
- Harita başlığı
- Güvenli biçimde uygulanabiliyorsa Hızlı Erişim görünürlük/sıralama ayarı
- Kampanya teaser görünürlüğü
- Galeri/blog teaser başlıkları
- Final CTA
- Görünürlük toggle'ları

CMS içerikleri yönetir, layout'u değil.
Müşteriye serbest layout page builder verilmemelidir.

---

## 22. Yayınlama Akışı

Müşteri işlemi:
`İçeriği düzenle -> Yayınla/Güncelle`

Sistem:
`WordPress -> webhook/deploy hook -> Cloudflare build -> Astro CMS içeriğini alır -> optimize statik site -> başarılı build canlıya geçer`

Gereksinimler:
- Taslak kaydetmek gereksiz public build tetiklememeli
- Build hatası mevcut canlı deployment'ı korumalı
- Art arda hızlı güncellemeler kontrolsüz eşzamanlı build fırtınası oluşturmamalı
- Müşterinin deployment bilgisi bilmesi gerekmemeli

Beklenen public güncelleme süresi yaklaşık 1-3 dakika olabilir.

---

## 23. SEO

### Teknik SEO
- Statik ve crawl edilebilir HTML
- Semantik HTML
- Doğru H1/H2 hiyerarşisi
- Canonical URL
- `robots.txt`
- `sitemap.xml`
- OpenGraph/Twitter metadata
- Özel 404
- Temiz URL'ler
- Gerektiğinde 301 redirect
- Doğru index/noindex stratejisi
- CMS indexlenmemeli

### Gerçeğe uygun structured data
- LocalBusiness
- BreadcrumbList
- Article
- FAQPage yalnızca gerçekten anlamlı FAQ bölümü varsa

### Local SEO
- Tutarlı NAP
- Google Business Profile uyumu
- Google Search Console
- Sitemap gönderimi

Çok sayıda zayıf şehir/hizmet doorway sayfası oluşturulmayacak.

### Önerilen sayfa başlığı yönü
- Ana sayfa: `Nokta Garage | Profesyonel Oto Ekspertiz`
- Paketler: `Oto Ekspertiz Paketleri | Nokta Garage`
- Mobil: `Mobil Oto Ekspertiz | Trakya ve İstanbul Avrupa Yakası | Nokta Garage`
- Uzaktan: `Uzaktan Oto Ekspertiz | Nokta Garage`
- İletişim: `Lüleburgaz Oto Ekspertiz İletişim | Nokta Garage`

Sayfa bazlı title ve meta description CMS'den düzenlenebilmeli ve mantıklı fallback değerleri olmalı.

---

## 24. Google Ads Hazırlığı

İlk yayında Google Ads aktif olmayacaktır.

Başlangıçta gereksiz Ads/Analytics tracking scriptleri yüklenmemelidir.

Buna rağmen frontend ileride ölçüm bağlanabilmesi için temiz ve tutarlı interaction hook'ları sağlamalı:
- `click_phone`
- `click_whatsapp`
- `click_directions`
- `report_verification_submit`
- `package_compare`
- `appointment_intent`
- `franchise_contact`

Ads/Analytics daha sonra aktif edildiğinde, kullanılan gerçek scriptlere göre gizlilik/consent gereksinimleri tekrar değerlendirilmelidir.

---

## 25. Çerezler ve Gizlilik

Sadece site var diye otomatik olarak cookie banner gösterilmemelidir.

İlk mimari mümkün olduğunca zorunlu olmayan çerezlerden kaçınmalıdır.

Şunlar eklenecekse consent gereksinimleri tekrar değerlendirilmelidir:
- Google Analytics
- Google Ads dönüşüm takibi
- Meta Pixel
- YouTube embedleri
- Pazarlama araçları
- Diğer zorunlu olmayan üçüncü taraf scriptleri

Google Maps dikkatli yüklenmeli; uygun olduğunda lazy/on-interaction tercih edilmelidir.

Yasal sayfalar gerçek veri akışına uymalıdır. Hukuki uyumluluk metni uydurulmamalıdır.

---

## 26. Performans Hedefleri

Mobil hedefler:
- LCP <= 2.5s
- INP <= 200ms
- CLS <= 0.10

Lighthouse mobil hedefleri:
- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- Gerçekçi olduğu ölçüde SEO = 100

Uygulama kuralları:
- Minimum JavaScript
- Gerçekten gerekmedikçe ağır slider yok
- Fold altı görseller lazy-load
- Hero/LCP görseli önceliklendirilmeli
- Responsive image
- Büyük layout shiftlerden kaçınılmalı
- Render-blocking üçüncü taraf embedlerden kaçınılmalı
- Font sayısı ve yükü minimum tutulmalı

---

## 27. Erişilebilirlik

Zorunlu:
- Semantik landmark'lar
- Görünür focus state'leri
- Klavye navigasyonu
- Doğru kontrast
- Form label'ları
- Yararlı validation mesajları
- Anlamlı görsellere alt text
- Dekoratif görsellerin doğru işaretlenmesi
- Reduced motion desteği
- Yeterli touch target boyutu
- Tarayıcı zoom'u kapatılmamalı

---

## 28. İçerik Stratejisi

İçerik:
- Kısa
- Somut
- Otomotiv sektörüne özgü
- Profesyonel
- Kolay taranabilir

Boş pazarlama cümlelerinden kaçınılmalı.

İşletme gerçekleri henüz kesin değilse, doğrulanmamış bilgiyi final gerçekmiş gibi sunmak yerine düzenlenebilir başlangıç metni kullanılmalıdır.

Kesin fiyatlar, kampanya indirimleri ve mobil ekspertizin net kapsamı gibi kritik ticari bilgiler müşteri onaylayana kadar açık biçimde geçici kalmalıdır.

---

## 29. Kabul Kriterleri

Bir sayfa ilgili kontrollerden geçmeden tamamlanmış sayılmaz.

### Görsel ve responsive
- 320-430px telefon genişliklerinde yatay overflow olmadan çalışır
- Tablet ve desktop'ta çalışır
- Logo/ikon/görseller bozulmaz
- Hatalı crop olmaz
- Aşırı parlak beyaz canvas hissi olmaz
- Tipografi/spacing/radius/buton sistemi tutarlıdır

### UX
- Etkileşimler anlık ve hızlı hissedilir
- Scroll akıcıdır
- Accordion'ların açılabilir olduğu anlaşılır
- Kaydırılabilir alanlarda affordance vardır
- Sticky bar'lar içeriği kapatmaz
- CTA'lar doğru hedeflere gider

### iOS / Android
- Gerçek cihaz veya yüksek doğruluklu test ile iPhone Safari ve Android Chrome kontrolü
- Sanal klavye kritik alan veya aksiyonları kapatmaz
- Formlar iOS'ta istemsiz zoom yapmaz
- Sticky elemanlar safe-area/home indicator'ı hesaba katar
- Menü/modal scroll'u bozulmaz
- Autofill ve focus düzgün çalışır
- Ekran yönü değişince layout bozulmaz

### Fonksiyonel
- Tüm bağlantılar çalışır
- Console error yok
- Hydration warning yok
- Eksik asset yok
- API durumları ayrı ve doğru
- Rapor sorgulama özel veri sızdırmaz

### SEO
- Title/meta/canonical doğru
- Tek mantıklı H1
- Sitemap/robots geçerli
- Kullanılan structured data geçerli

### Performans
- Gereksiz ağır JS yok
- Görseller görünür kalite kaybı olmadan optimize edilmiş
- Performans hedefleri makul ölçüde karşılanır

### CMS dayanıklılığı
- Müşterinin biraz uzun metni layout'u hemen bozmaz
- Eksik opsiyonel görsel için zarif fallback vardır
- Pasif öğeler temiz biçimde kaybolur
- Sıralama CMS düzenine uyar

---

## 30. Geliştirme Yöntemi

Sites'ten tüm web sitesini kontrolsüz tek seferde üretmesi istenmemelidir.

Bu doküman **tek doğruluk kaynağıdır**, ancak uygulama sayfa sayfa yapılacaktır.

Süreç:
1. Foundation/tasarım sistemi
2. Ana sayfa
3. Kullanıcı inceleme/testi
4. Yalnızca onaydan sonra sonraki sayfa
5. Aynı şekilde devam
6. Tüm site için final QA
7. Kaynak/dosya teslimi ve final teknik denetim + production entegrasyonu için Codex'e aktarım

Her görev bu ana şartnameyi referans almalıdır.
Onaylanmış tasarım kararları sonraki sayfalarda yeniden icat edilmemelidir.
