# Nokta Garage İçerik Yönetimi

Bu eklenti yalnız Nokta Garage public sitesinin headless içerik yönetimi içindir. ACF veya ücretli başka bir eklenti gerektirmez.

## Yönetilen alanlar

- Paketler ve fiyatları
- Hizmetler
- Kampanyalar ve yayın tarihleri
- Blog yazıları
- Galeri
- Tekil işletme bilgileri
- Ana sayfa hero görseli

Bir kayıt public sitede gösterilecekse WordPress durumu **Yayınlandı** olmalıdır. Taslak içerikler REST çıktısına dahil edilmez. Kampanyalar ayrıca başlangıç ve bitiş tarihleri içinde gösterilir.

## Yayın akışı

Cloudflare Pages production Deploy Hook adresi **Ayarlar > Nokta Garage** ekranına bir kez girilir. Yayındaki bir içerik veya genel ayar güncellendiğinde eklenti hook'u çağırır. Cloudflare build başarılı olduğunda yeni içerik canlıya geçer; başarısız build mevcut canlı siteyi değiştirmez.

Public build endpoint'i:

```text
/?rest_route=/nokta-garage/v2/content
```

V2 endpoint yalnız yayınlanabilir public içeriği döndürür. WordPress kullanıcıları, taslaklar, eski alanlar ve Cloudflare Deploy Hook URL'si yanıta eklenmez. V1 endpoint bir teslim sürümü boyunca geri dönüş amacıyla korunur.
