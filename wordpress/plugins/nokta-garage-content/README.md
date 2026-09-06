# Nokta Garage İçerik Yönetimi

Bu eklenti yalnız Nokta Garage public sitesinin headless içerik yönetimi içindir. ACF veya ücretli başka bir eklenti gerektirmez.

## Yönetilen alanlar

- Paketler ve fiyatları
- Hizmetler
- Kampanyalar ve yayın tarihleri
- Blog yazıları
- Galeri
- Şubeler
- Ana sayfa hero/hızlı erişim alanları
- Genel iletişim, SEO ve WhatsApp ayarları

Bir kayıt public sitede gösterilecekse WordPress durumu **Yayınlandı** olmalı, ilgili içerik tipindeki **Sitede aktif** kutusu da açık olmalıdır. Taslak içerikler REST çıktısına dahil edilmez.

## Yayın akışı

Cloudflare Pages production Deploy Hook adresi **Ayarlar > Nokta Garage** ekranına bir kez girilir. Yayındaki bir içerik veya genel ayar güncellendiğinde eklenti hook'u çağırır. Cloudflare build başarılı olduğunda yeni içerik canlıya geçer; başarısız build mevcut canlı siteyi değiştirmez.

Public build endpoint'i:

```text
/?rest_route=/nokta-garage/v1/content
```

Endpoint yalnız yayınlanabilir public içeriği döndürür. WordPress kullanıcıları, taslaklar, özel ayarlar ve Cloudflare Deploy Hook URL'si yanıta eklenmez.
