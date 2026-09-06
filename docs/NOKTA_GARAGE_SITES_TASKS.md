# Nokta Garage - ChatGPT Sites Uygulama Görevleri

## Çalışma Kuralı

`NOKTA_GARAGE_SITE_SPEC.md` projenin tek doğruluk kaynağıdır.

Tüm web sitesini tek seferde tamamlamaya çalışma.
Yalnızca mevcut görevi uygula.
Her ana sayfa/görev tamamlandıktan sonra kullanıcı incelemesi ve onayı için dur.
Onaylanmış bileşenleri sonraki görevlerde yeniden tasarlama.

---

## Görev 00 - Projeyi Tanıma

Sites'e verilecekler:
- `NOKTA_GARAGE_SITE_SPEC.md`
- Logo dosyası
- Mevcut site/prototip HTML dosyası yalnızca referans olarak; kopyalanması gereken bir tasarım değildir
- O ana kadar onaylanmış gerçek fotoğraflar

Talimat:
- Ana şartnamenin tamamını oku
- Henüz geliştirmeye başlama
- Mimariyi, tasarım kısıtlarını ve sayfa sırasını özetle
- Yalnızca gerçekten geliştirmeyi engelleyen noktaları belirt
- Daha önce alınmış kararları yeniden yorumlama veya değiştirme

Onay noktası: Kullanıcı, Sites'in şartnameyi doğru anladığını onaylar.

---

## Görev 01 - Temel Yapı ve Tasarım Sistemi

Yalnızca şunları oluştur:
- Global layout/iskele
- Renk token'ları
- Tipografi
- Boşluk/spacing ölçeği
- Buton sistemi
- Kartlar
- İkon kuralları
- Accordion bileşenleri
- Mobil sticky CTA bileşeni
- Desktop ve mobil header
- Mobil menü
- Footer
- Açılış marka animasyonu
- Responsive breakpoint'ler
- iOS safe-area desteği

Henüz içerik sayfalarının tamamını oluşturma.

Test et:
- iPhone boyutunda viewport
- Android boyutunda viewport
- Tablet
- Desktop
- Klavye/focus davranışı
- Hamburger/menü davranışı
- `prefers-reduced-motion`

Onay noktası: Görsel dil kabul edilir.

---

## Görev 02 - Ana Sayfa

Yalnızca ana sayfayı şartnameye göre oluştur.

Ana sayfa kompakt kalmalı:
- Hero
- Konum/harita alanı
- Hızlı Erişim grid'i
- İsteğe bağlı aktif kampanya teaser'ı
- Küçük galeri/blog teaser alanı
- Footer

Hızlı Erişim mutlaka şunları içermeli:
- Paketler
- Hizmetler
- Mobil Ekspertiz
- Uzaktan Ekspertiz
- Rapor Sorgula
- Randevu
- Kampanyalar
- Galeri
- Bayilik Başvurusu
- İletişim/Yol Tarifi

Özellikle test et:
- Dokunma alanları
- Hızlı erişim kartları
- Açılış animasyonu
- Haritanın yüklenmesi
- Telefon/WhatsApp bağlantıları
- Sayfanın gereksiz uzamaması
- Aşırı parlak beyaz görünüm oluşturmaması

Onay noktası: Ana sayfa onaylanmadan devam etme.

---

## Görev 03 - Ekspertiz Paketleri

Oluştur:
- Paket accordion listesi
- Yedi başlangıç paket kaydı
- Geçici fiyat değerleri
- İki paketli karşılaştırma aracı
- Sticky Ara/WhatsApp CTA

Özellikle iPhone Safari ve Android Chrome'da test et:
- Accordion dokunma tepkisi
- Karşılaştırma seçimi
- Yatay taşan tablo olmaması
- Uzun hizmet adları
- Sticky CTA'nın safe-area davranışı

Onay noktası.

---

## Görev 04 - Hizmetler

Tek sayfalı hizmet accordion/kart yapısını oluştur.

Kurallar:
- Her hizmet için ayrı URL oluşturma
- `Araç Resimleri` bir hizmet değildir
- İkonlar tutarlı olmalı
- Açılabilir alanlarda belirgin fakat sade chevron/işaret bulunmalı

Onay noktası.

---

## Görev 05 - Mobil Ekspertiz

Kısa ve satış odaklı bir sayfa oluştur.

Düzenlenebilir başlangıç metni kullan.
Dükkândaki ekspertiz paketleriyle aynı kapsamda olduğunu iddia etme.
Hizmet bölgesi: Trakya + İstanbul Avrupa Yakası.

Onay noktası.

---

## Görev 06 - Uzaktan Ekspertiz

Kısa hizmet sayfası oluştur.

Öne çıkar:
- Mevcut ekspertiz paketlerinden biri seçilebilir
- Araç Lüleburgaz şubesine gelir
- Ekspertiz yapılır
- Rapor iletilir
- Uzman bulguları telefonla birebir açıklar
- Alıcı doğrudan soru sorabilir

Onay noktası.

---

## Görev 07 - Rapor Sorgula

Arayüzü ve tüm durumları oluştur.

Alanlar:
- Plaka
- Rapor No

Durumlar:
- Boş/başlangıç
- Yükleniyor
- Geçerli
- Bulunamadı
- Servise ulaşılamıyor
- Doğrulama hatası

Rapor veya müşteri verisi gösterme.
Backend henüz bağlanmadıysa API adapter/mock sınırı kullan.

Özellikle iOS Safari ve Android Chrome'da yoğun test et:
- Sanal klavye
- Input'a odaklanınca zoom
- Autocomplete/autofill
- Validation
- Klavyeden submit
- Loading durumu
- Back/forward state restoration

Onay noktası.

---

## Görev 08 - Randevu

Telefon/WhatsApp öncelikli randevu sayfası oluştur.

Karmaşık bir rezervasyon backend'i uydurma.
Herhangi bir form prototipi yapılırsa opsiyonel olsun ve production davranışından net biçimde ayrı tutulsun.

Onay noktası.

---

## Görev 09 - Galeri ve Kampanyalar

Oluştur:
- `/galeri`
- `/kampanyalar`

Galeride kaydırma/ok affordance'ı açıkça anlaşılmalı.
Kampanyalarda aktif/süresi dolmuş davranışı desteklenmeli.

Onay noktası.

---

## Görev 10 - Blog

Oluştur:
- `/blog`
- `/blog/[slug]`

Gerekirse yalnızca düzenlenebilir demo içerik olarak başlangıç yazıları kullanılabilir.
Semantik makale yapısını ve SEO metadata modelini güçlü kur.

Onay noktası.

---

## Görev 11 - Kurumsal Sayfalar

Oluştur:
- Hakkımızda
- Bayilik
- İnsan Kaynakları

Bayilik; hızlı erişim, navigasyon ve footer içinde görünür kalmalı.
İlk sürümde başvuru formu yok.

Onay noktası.

---

## Görev 12 - İletişim ve Yasal Sayfalar

Oluştur:
- İletişim
- KVKK
- Aydınlatma Metni
- Gizlilik Politikası
- Çerez Politikası

Hukuki garanti veya uyumluluk iddiası uydurma.
Metinler hâlâ genel ise final işletme/hukuk kontrolü gerektiğini açıkça işaretle.

Onay noktası.

---

## Görev 13 - CMS Veri Bağlantısına Hazırlık

Kod içinde sabit yazılmış fakat CMS'den yönetilmesi gereken içerikleri, WordPress REST API'ye uygun temiz bir içerik/veri katmanının arkasına taşı.

Beklenen şemaları tanımla:
- Paketler
- Hizmetler
- Kampanyalar
- Blog
- Galeri
- Şubeler
- Sayfa içerikleri
- Global site ayarları

Public sayfaları runtime'da WordPress'e bağımlı hale getirme.

Onay noktası.

---

## Görev 14 - SEO / Performans / Ads Hazırlığı

Uygula/kontrol et:
- Metadata
- Canonical
- Sitemap
- Robots
- Gerçeğe uygun structured data
- 404
- Responsive görsel stratejisi
- Gelecekteki Ads takibi için event hook arayüzü
- İlk aşamada gereksiz analytics olmaması

Mobil performans kontrolü yap.

Onay noktası.

---

## Görev 15 - Tarayıcılar Arası QA

Zorunlu final test matrisi:

### iOS
- iPhone Safari dikey
- iPhone Safari yatay
- Mümkünse iPad Safari

### Android
- Chrome dikey
- Chrome yatay
- Mümkünse Samsung Internet

### Desktop
- Chrome
- Safari
- Edge
- Firefox

Kontrol et:
- Formlar
- Input focus
- Autofill
- Sticky CTA
- Hamburger/dropdown
- Accordion'lar
- Paket karşılaştırma
- Galeri swipe
- Harita
- Telefon linkleri
- WhatsApp linkleri
- Route navigasyonu
- Back/forward navigasyonu
- Orientation change
- Yatay overflow olmaması

Onay noktası.

---

## Görev 16 - Teslim Öncesi Son Site Denetimi

Sites şu raporu üretmeli:
- Oluşturulan sayfalar
- Çözülmemiş TODO'lar
- Kalan placeholder'lar
- Eksik gerçek fotoğraflar
- Eksik ticari bilgiler
- Bozuk/geçici bağlantılar
- Tarayıcı uyumluluğu riskleri
- Performans riskleri

Körü körüne yayınlama.
Önce sürümü kaydet ve incele.

Ardından kaynak/dosyaları production denetimi, CMS/API entegrasyon kontrolü ve yayına hazır olma incelemesi için Codex'e aktar.
