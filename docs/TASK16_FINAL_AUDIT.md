# Görev 16 — Teslim Öncesi Son Site Denetimi

> Bu belge CMS ve gerçek rapor API'si uygulanmadan önceki denetimin tarihsel kaydıdır.
> Buradaki açık entegrasyon maddeleri güncel değildir; kurulum ve canlıya geçiş için
> `DEPLOYMENT.md` esas alınmalıdır.

Denetim tarihi: 4 Eylül 2026

İncelenen kaynak sürümü: `44714a05f0f9fb8b0d5c073649711c924a3892b9`

İncelenen kayıtlı/canlı Sites sürümü: `33`

Yayın adresi: `https://nokta-oto-ekspertiz.berkebekar.chatgpt.site`

## Sonuç

Site teknik olarak derleniyor, temel SEO ve statik mobil uyumluluk denetimlerini geçiyor. Ancak gerçek üretim teslimi için rapor API'si, fiyatlar, gerçek işletme fotoğrafları, CMS veri akışı ve özel alan adı bağlantısı tamamlanmalıdır. Bu maddeler kapanmadan siteyi nihai ticari sürüm olarak kabul etmek doğru değildir.

Bu denetim sırasında görünür sayfa veya işlev değiştirilmemiş ve yeni canlı sürüm yayınlanmamıştır.

## Oluşturulan sayfalar

Derleme toplam 22 rota üretmektedir. Bunların 21'i indexlenebilir URL olarak sitemap içinde yer alır; `404.html` sitemap dışında tutulur.

- Ana sayfa
- Ekspertiz Paketleri
- Hizmetler
- Mobil Ekspertiz
- Uzaktan Ekspertiz
- Rapor Sorgula
- Randevu
- Kampanyalar
- Galeri
- Blog liste sayfası
- 4 blog yazısı
- Hakkımızda
- Bayilik
- İnsan Kaynakları
- İletişim
- KVKK
- Aydınlatma Metni
- Gizlilik Politikası
- 404 sayfası
- XML sitemap

Çerez sayfası, kullanıcı talebi doğrultusunda kaldırılmıştır; eksik sayfa sayılmaz.

## Otomatik test sonuçları

| Kontrol | Sonuç |
|---|---|
| Astro kaynak kontrolü | 46 dosya, 0 hata, 0 uyarı, 0 ipucu |
| Production derlemesi | Başarılı, 22 rota |
| Teknik SEO | 21 indexlenebilir sayfa, 21 sitemap URL'si, 0 uyarı |
| Yapısal veri | 31 JSON-LD bloğu |
| İç bağlantılar | Bozuk iç bağlantı bulunmadı |
| Mobil statik taşma kontrolü | 320–430 px aralığında bilinen yatay taşma riski bulunmadı |
| Mobil ilk görünüm tahmini | 432,0 KB / 750 KB bütçe |
| Üretilen JS | 0,0 KB harici JS |
| Üretilen CSS | 103,7 KB |
| Font dosyaları | 239,0 KB |

Bu sonuçlar statik ve otomatik kontrollerdir. Gerçek iOS/Android cihazları ile tüm masaüstü tarayıcılarında yapılan manuel testlerin yerine geçmez.

## Yayına hazırlık bulguları

| Öncelik | Bulgu | Etki | Gerekli işlem |
|---|---|---|---|
| Kritik | Rapor sorgulama gerçek API'ye bağlı değil. `PUBLIC_REPORT_QUERY_ENDPOINT` yoksa tarayıcıdaki demo kayıtları çalışıyor. | Gerçek müşterinin raporu doğrulanamaz; demo değerleri üretimde erişilebilir olur. | Backend hazırlandığında endpoint tanımlanmalı, CORS doğrulanmalı ve demo fallback üretimden kaldırılmalı veya güvenli biçimde kapatılmalı. |
| Kritik | Canonical, Open Graph, sitemap ve robots adresleri `https://noktagarage.com` alan adını kullanıyor; mevcut yayın `berkebekar.chatgpt.site` üzerindedir. | Özel alan adı bağlı değilse arama motorları farklı/ulaşılamayan URL'leri esas alır. | `noktagarage.com` Sites projesine bağlanmalı; DNS, SSL, ana alan adı ve yönlendirmeler doğrulanmalı. |
| Yüksek | Paket fiyatlarının tamamı bilinçli olarak `1xxx TL` bırakıldı. | Ticari fiyat bilgisi nihai değil. | CMS bağlandığında onaylı gerçek fiyatlar girilmeli. |
| Yüksek | Ana sayfa ve mobil ekspertiz görselleri geçici AI/temsili görsellerdir; galeride aynı kaynak ailesinden tek örnek görsel bulunur. | Marka güveni ve gerçek işletme temsili eksik kalır. | Onaylı, yüksek çözünürlüklü şube, cihaz ve uygulama fotoğraflarıyla değiştirilmelidir. |
| Yüksek | WordPress REST şeması ve dönüştürücüsü hazırdır fakat site hâlâ statik içerik anlık görüntüsünü kullanıyor. | Panelde yapılan değişiklikler siteye otomatik yansımaz. | CMS bağlantısı, veri çekme yöntemi, hata/fallback politikası ve yayın tetikleyicisi uygulanmalıdır. |
| Orta | Gerçek aktif kampanya bulunmuyor; kaynakta görünür olmayan süresi geçmiş/pasif örnek kayıtlar var. | Kampanyalar sayfası boş durum gösterir. | CMS geçişinde örnek kayıtlar kaldırılmalı ve yalnızca onaylı kampanyalar eklenmeli. |
| Orta | Telefon, e-posta, adres, çalışma saatleri ve harita bağlantısı kaynakta sabittir. | Yanlış veya değişmiş işletme bilgisi doğrudan müşteriye yansır. | İşletme sahibi son kez doğrulamalıdır. Özellikle `Her gün 08:00–18:00` ve harita konumu kontrol edilmelidir. |
| Orta | Harita için `share.google` kısa bağlantısı kullanılıyor. | Bağlantı bugün geçerli olsa bile uzun vadede doğrudan Google Maps işletme bağlantısından daha kırılgandır. | Kalıcı Google Maps yer/işletme URL'siyle değiştirilmesi önerilir. |
| Orta | Task 15'in gerçek cihaz/tarayıcı matrisi tamamlanmadı. | Safari/iOS, Samsung Internet ve yön değişimi gibi platforma özgü sorunlar gözden kaçabilir. | Belirtilen cihaz ve tarayıcılarda manuel test yapılmalı. |
| Orta | iOS'ta “Hareketi Azalt” açıksa CSS erişilebilirlik kuralı animasyonları yaklaşık anında tamamlıyor. | Sabit iletişim çubuğu ve yumuşak kaydırma iPhone'da animasyonsuz görünür. | Bu erişilebilirlik davranışının korunup korunmayacağı ürün kararıyla netleştirilmeli. |
| Düşük | Font yükü 239 KB ile toplam ilk görünümün önemli bölümünü oluşturuyor. | Bütçe geçiliyor değildir ancak yavaş bağlantılarda ek maliyet yaratır. | Gerekirse kullanılan font ağırlıkları azaltılabilir veya alt kümelenebilir. |
| Düşük | README görev durumu ve bazı eski “geçici içerik” açıklamaları bakımından güncel değildir. | Yeni geliştirici mevcut durumu yanlış anlayabilir. | Nihai entegrasyon kararları verildikten sonra README güncellenmelidir. |

## Placeholder ve iç not taraması

- Görünür kullanıcı arayüzünde hukukçuya, demoya, “final metne”, “ilk sürüme”, gerçek fotoğraf beklenmesine veya geliştiriciye yönelik açıklama bulunmadı.
- Görünür ticari placeholder olarak yalnızca kullanıcı talebiyle korunan `1xxx TL` fiyatları kaldı.
- Galeri veri modelindeki `placeholderLabel` alanları ve pasif kampanya örnekleri kullanıcıya gösterilmiyor.
- Rapor sorgulama demo değerleri yalnızca kodda ve derlenen istemci modülünde bulunuyor; API bağlanmadan üretim riski oluşturuyor.
- Kaynaklarda açık `TODO`, `FIXME` veya `XXX` işareti bulunmadı.

## Rapor API sözleşmesi

Frontend, `PUBLIC_REPORT_QUERY_ENDPOINT` adresine JSON gövdeli `POST` isteği gönderir:

```json
{
  "plate": "59ABC123",
  "reportNumber": "RAPOR-NO"
}
```

Başarılı yanıtta aşağıdaki alanların tamamı dolu metin olarak beklenir:

```json
{
  "reportNumber": "7282549",
  "reportDate": "02.09.2026",
  "plate": "22ADZ836",
  "chassisLast6": "Y93195",
  "packageName": "Kaporta Kontrol",
  "dealerName": "Lüleburgaz Nokta Garage Ekspertiz"
}
```

- `200`: Geçerli rapor nesnesi
- `404`: Eşleşme bulunamadı
- Diğer HTTP hataları, zaman aşımı veya eksik/geçersiz JSON: Hizmete ulaşılamıyor durumu
- İstek zaman aşımı: 10 saniye
- Backend, gerçek tarayıcı origin'i için CORS izni sağlamalıdır.

## Bağlantı denetimi

- Tüm iç bağlantılar mevcut statik rotalara ulaşıyor.
- Boş `href`, `href="#"`, boş görsel kaynağı, localhost veya `example.com` bağlantısı bulunmadı.
- Telefon, e-posta ve WhatsApp bağlantıları biçimsel olarak geçerli.
- Harita, WhatsApp, telefon ve e-posta hedeflerinin gerçek cihazda uçtan uca açılması manuel teslim testinde tekrar doğrulanmalıdır.

## Kalan Task 15 test matrisi

- iPhone Safari: dikey, yatay, Hareketi Azalt açık ve kapalı
- iPad Safari
- Android Chrome: dikey ve yatay
- Samsung Internet
- Masaüstü Chrome, Edge, Firefox ve Safari
- Menü aç/kapat, geri tuşu ve ileri/geri gezinme
- Sabit iletişim çubuğunun görünme eşiği
- Anchor/yumuşak kaydırma davranışı
- Telefon, WhatsApp ve yol tarifi bağlantıları
- Rapor sorgulama: başarılı, bulunamadı, servis hatası ve doğrulama hatası
- Orientation change sonrasında yatay taşma

## Nihai yayın kapısı

Nihai ticari yayın için en az şu sıra izlenmelidir:

1. Gerçek rapor API'sini bağla ve demo fallback'i kaldır.
2. Gerçek fiyatları ve onaylı CMS içeriklerini bağla.
3. Geçici görselleri gerçek işletme fotoğraflarıyla değiştir.
4. Telefon, adres, çalışma saatleri, harita ve hukuki metinleri işletme sahibi/hukukçu ile son kez onayla.
5. `noktagarage.com` alan adını bağla ve SEO URL'lerini gerçek ortamda doğrula.
6. Gerçek cihaz/tarayıcı matrisini tamamla.
7. Son production derlemesini yeniden denetle, sürümü kaydet ve ancak onaydan sonra yayınla.
