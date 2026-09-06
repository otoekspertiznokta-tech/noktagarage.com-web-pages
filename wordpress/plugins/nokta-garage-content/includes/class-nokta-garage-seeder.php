<?php

if (!defined('ABSPATH')) {
    exit;
}

final class Nokta_Garage_Seeder
{
    public static function activate(): void
    {
        Nokta_Garage_Content::register_content_types();
        if (!get_option('ng_site_settings')) update_option('ng_site_settings', self::default_settings(), false);
        if (!get_option('ng_content_seeded_v1')) {
            self::seed_packages();
            self::seed_services();
            self::seed_gallery();
            self::seed_branch();
            self::seed_home();
            self::seed_blog();
            update_option('ng_content_seeded_v1', gmdate('c'), false);
        }
    }

    public static function default_settings(): array
    {
        return [
            'brandName' => 'Nokta Garage', 'brandDescriptor' => 'Oto Ekspertiz',
            'logo' => '/logo-320.webp', 'alternateLogo' => '/logo-640.webp', 'favicon' => '/favicon.png',
            'primaryPhone' => '+90 553 218 21 36', 'phoneHref' => 'tel:+905532182136',
            'whatsappBaseUrl' => 'https://wa.me/905532182136', 'email' => 'otoekspertiznokta@gmail.com',
            'defaultWhatsappMessage' => 'Merhaba, Nokta Garage oto ekspertiz hizmetleri hakkında bilgi almak istiyorum.',
            'footerText' => '2018’den bu yana oto ekspertiz sektöründe edinilen tecrübe.',
            'copyright' => '© 2026 Nokta Garage', 'mapsUrl' => 'https://share.google/5YHlpgYMIs2tCrZ8v',
            'googleBusinessUrl' => 'https://share.google/5YHlpgYMIs2tCrZ8v', 'workingHours' => 'Her gün 08:00–18:00',
            'defaultSeoTitle' => 'Nokta Garage | Profesyonel Oto Ekspertiz',
            'defaultSeoDescription' => 'Nokta Garage oto ekspertiz hizmetleri, paketleri ve iletişim bilgileri.',
            'defaultSocialImage' => '/images/home-hero.webp', 'deployHookUrl' => '',
        ];
    }

    public static function default_navigation(): array
    {
        return [
            'services' => [['label' => 'Hizmetler', 'href' => '/hizmetler'], ['label' => 'Mobil Ekspertiz', 'href' => '/mobil-ekspertiz'], ['label' => 'Uzaktan Ekspertiz', 'href' => '/uzaktan-ekspertiz']],
            'corporate' => [['label' => 'Hakkımızda', 'href' => '/hakkimizda'], ['label' => 'Bayilik', 'href' => '/bayilik'], ['label' => 'İnsan Kaynakları', 'href' => '/insan-kaynaklari']],
            'mobile' => [
                ['label' => 'Ekspertiz Paketleri', 'href' => '/ekspertiz-paketleri'], ['label' => 'Hizmetler', 'href' => '/hizmetler'],
                ['label' => 'Mobil Ekspertiz', 'href' => '/mobil-ekspertiz'], ['label' => 'Uzaktan Ekspertiz', 'href' => '/uzaktan-ekspertiz'],
                ['label' => 'Rapor Sorgula', 'href' => '/rapor-sorgula'], ['label' => 'Randevu', 'href' => '/randevu'],
                ['label' => 'Kampanyalar', 'href' => '/kampanyalar'], ['label' => 'Galeri', 'href' => '/galeri'],
                ['label' => 'Blog', 'href' => '/blog'], ['label' => 'Hakkımızda', 'href' => '/hakkimizda'],
                ['label' => 'Bayilik', 'href' => '/bayilik'], ['label' => 'İnsan Kaynakları', 'href' => '/insan-kaynaklari'],
                ['label' => 'İletişim', 'href' => '/iletisim'],
            ],
            'legal' => [['label' => 'KVKK', 'href' => '/kvkk'], ['label' => 'Aydınlatma', 'href' => '/aydinlatma-metni'], ['label' => 'Gizlilik', 'href' => '/gizlilik-politikasi']],
        ];
    }

    private static function seed_packages(): void
    {
        $packages = [
            ['Standart', ['Motor ve Mekanik Kontrolleri', 'Araç Altı Mekanik Kontrolleri', 'Boya ve Kaporta Kontrolleri', 'Kaporta Parçaları Boya Kontrolleri', 'Araç Direkleri Boya ve Yapısal Kontrolleri', 'Şasi Kontrolleri']],
            ['Kaporta Kontrol', ['Boya ve Kaporta Kontrolleri', 'Kaporta Parçaları Boya Kontrolleri', 'Araç Direkleri Boya ve Yapısal Kontrolleri', 'Şasi Kontrolleri']],
            ['Motor Kontrol', ['Motor ve Mekanik Kontrolleri', 'Araç Altı Mekanik Kontrolleri', 'Motor Performans Testi (Dyno)']],
            ['Dyno Motor Test', ['Motor Performans Testi (Dyno)']],
            ['Detaylı', ['Motor ve Mekanik Kontrolleri', 'Araç Altı Mekanik Kontrolleri', 'Boya ve Kaporta Kontrolleri', 'Kaporta Parçaları Boya Kontrolleri', 'Araç Direkleri Boya ve Yapısal Kontrolleri', 'Şasi Kontrolleri', 'Motor Performans Testi (Dyno)', 'Fren Sistemi Kontrolleri', 'Süspansiyon Sistemi Kontrolleri', 'Yanal Kayma Testi', 'İç Donanım ve Cam Kontrolleri', 'Ayna ve Aydınlatma Kontrolleri', 'Lastik Kontrolleri']],
            ['Detaylı ve Airbagli', ['Motor ve Mekanik Kontrolleri', 'Araç Altı Mekanik Kontrolleri', 'Boya ve Kaporta Kontrolleri', 'Kaporta Parçaları Boya Kontrolleri', 'Araç Direkleri Boya ve Yapısal Kontrolleri', 'Şasi Kontrolleri', 'Motor Performans Testi (Dyno)', 'Fren Sistemi Kontrolleri', 'Süspansiyon Sistemi Kontrolleri', 'Yanal Kayma Testi', 'İç Donanım ve Cam Kontrolleri', 'Ayna ve Aydınlatma Kontrolleri', 'Lastik Kontrolleri', 'Hava Yastığı (Airbag) Kontrolleri']],
            ['Tek Airbag', ['Hava Yastığı (Airbag) Kontrolleri']],
        ];
        foreach ($packages as $index => [$name, $services]) {
            self::insert('ng_package', $name, "{$name} paketine dahil kontrol gruplarını ve hizmet kapsamını inceleyin.", "{$name} ekspertiz paketinin kontrol kapsamı.", [
                'active' => '1', 'order' => (string) ($index + 1), 'price' => '1xxx TL',
                'services' => implode("\n", $services), 'featured' => $name === 'Detaylı' ? '1' : '0',
                'cta_label' => 'Bilgi Al', 'cta_href' => '/randevu',
                'whatsapp_message' => "{$name} ekspertiz paketi hakkında bilgi almak istiyorum.",
                'seo_title' => "{$name} Ekspertiz Paketi | Nokta Garage",
                'seo_description' => "{$name} oto ekspertiz paketinin kontrol kapsamını inceleyin.",
            ]);
        }
    }

    private static function seed_services(): void
    {
        $services = [
            ['Motor ve Mekanik Kontrolleri', 'motor-mekanik', 'Motor ve Mekanik', 'Motorun çalışma karakteri, ses ve titreşimleri ile erişilebilen mekanik parçalar ve olası sıvı kaçakları kontrol edilir.', 'wrench'],
            ['Araç Altı Mekanik Kontrolleri', 'mekanik-alt', 'Motor ve Mekanik', 'Araç altındaki erişilebilir mekanik bileşenler; hasar, aşınma ve kaçak belirtileri açısından incelenir.', 'search'],
            ['Boya ve Kaporta Kontrolleri', 'boya-kaporta', 'Gövde Kontrolleri', 'Aracın dış gövdesi ve kaporta parçalarının genel durumu, görünür işlem ve hasar izleri açısından değerlendirilir.', 'car'],
            ['Kaporta Parçaları Boya Kontrolleri', 'kaporta-boyama', 'Gövde Kontrolleri', 'Kaporta parçalarında boyalı, değişen veya işlem görmüş olabilecek alanlara yönelik ölçüm ve yüzey kontrolleri yapılır.', 'paint'],
            ['Araç Direkleri Boya ve Yapısal Kontrolleri', 'direk-boyama', 'Gövde Kontrolleri', 'Araç direkleri, boya ve onarım belirtisi taşıyabilecek alanlar açısından kontrol edilir.', 'scan'],
            ['Şasi Kontrolleri', 'sasi-boyama', 'Gövde Kontrolleri', 'Şasi üzerindeki erişilebilir bölgeler boya, işlem ve onarım belirtileri açısından değerlendirilir.', 'box'],
            ['Motor Performans Testi (Dyno)', 'dyno-motor-performans', 'Test Sistemleri', 'Uygun test koşullarında motor performansına ilişkin ölçüm sonuçları dyno cihazı üzerinden değerlendirilir.', 'gauge'],
            ['Fren Sistemi Kontrolleri', 'fren', 'Test Sistemleri', 'Fren performansı ve tekerlekler arasındaki frenleme dengesi test ekipmanı üzerinden kontrol edilir.', 'brake'],
            ['Süspansiyon Sistemi Kontrolleri', 'suspansiyon', 'Test Sistemleri', 'Süspansiyon sisteminin ölçülebilen performansı ve sağ-sol dengesi test sonuçlarıyla değerlendirilir.', 'suspension'],
            ['Yanal Kayma Testi', 'yanal-kayma', 'Test Sistemleri', 'Aracın düz ilerleme eğilimi ve yanal sapma değeri uygun test düzeneğinde ölçülür.', 'alignment'],
            ['İç Donanım ve Cam Kontrolleri', 'ic-doseme-cam', 'İç ve Dış Donanım', 'İç döşeme, koltuklar ve camların görünür durumu temel işlev ve hasar belirtileri açısından incelenir.', 'interior'],
            ['Ayna ve Aydınlatma Kontrolleri', 'dis-ayna-aydinlatma', 'İç ve Dış Donanım', 'Dış aynalar ile temel dış aydınlatma elemanlarının görünür durumu ve işlevleri kontrol edilir.', 'light'],
            ['Lastik Kontrolleri', 'lastik', 'İç ve Dış Donanım', 'Lastiklerin görünür yüzeyi, diş durumu ve düzensiz aşınma belirtileri incelenir.', 'tire'],
            ['Hava Yastığı (Airbag) Kontrolleri', 'hava-yastigi-kontrolleri', 'Güvenlik Sistemleri', 'Hava yastığı sistemine ilişkin erişilebilen göstergeler ve kontrol bulguları değerlendirilir.', 'airbag'],
        ];
        foreach ($services as $index => [$name, $slug, $category, $description, $icon]) {
            self::insert('ng_service', $name, $description, $description, [
                'active' => '1', 'order' => (string) ($index + 1), 'category' => $category, 'summary' => $description,
                'icon' => $icon, 'seo_title' => "{$name} | Nokta Garage", 'seo_description' => $description,
            ], $slug);
        }
    }

    private static function seed_gallery(): void
    {
        foreach ([['Dış Cephe', 'dis-cephe', 'building'], ['İç Alan', 'ic-alan', 'car'], ['Ekspertiz Cihazları', 'cihazlar', 'gauge'], ['Ekspertiz Süreci', 'surec', 'scan']] as $index => [$title, $slug, $icon]) {
            self::insert('ng_gallery', $title, '', '', ['active' => '1', 'order' => (string) ($index + 1), 'image_alt' => "Nokta Garage {$title}", 'icon' => $icon], $slug);
        }
    }

    private static function seed_branch(): void
    {
        self::insert('ng_branch', 'Nokta Garage Lüleburgaz', 'Nokta Garage Lüleburgaz oto ekspertiz şubesi.', '', [
            'active' => '1', 'city' => 'Kırklareli', 'district' => 'Lüleburgaz',
            'address' => 'Atatürk Mahallesi, Yeni Sanayi Sitesi, A/4 Blok, 6. Sokak, No:64, 39750 Lüleburgaz/Kırklareli, Türkiye',
            'short_address' => 'Atatürk Mahallesi, A/4 Blok, 6. Sokak, No:64', 'phone' => '+90 553 218 21 36',
            'phone_href' => 'tel:+905532182136', 'whatsapp' => 'https://wa.me/905532182136',
            'email' => 'otoekspertiznokta@gmail.com', 'maps_url' => 'https://share.google/5YHlpgYMIs2tCrZ8v',
            'working_hours' => 'Her gün 08:00–18:00', 'seo_title' => 'Lüleburgaz Oto Ekspertiz | Nokta Garage',
            'seo_description' => 'Nokta Garage Lüleburgaz şubesi adres, çalışma saatleri ve iletişim bilgileri.',
        ], 'luleburgaz');
    }

    private static function seed_home(): void
    {
        $quick = [
            ['label' => 'Ekspertiz Paketleri', 'href' => '/ekspertiz-paketleri', 'tone' => 'white', 'icon' => 'package'],
            ['label' => 'Hizmetler', 'href' => '/hizmetler', 'tone' => 'gray', 'icon' => 'service'],
            ['label' => 'Mobil Ekspertiz', 'href' => '/mobil-ekspertiz', 'tone' => 'gray', 'icon' => 'mobile'],
            ['label' => 'Uzaktan Ekspertiz', 'href' => '/uzaktan-ekspertiz', 'tone' => 'white', 'icon' => 'remote'],
            ['label' => 'Rapor Sorgula', 'href' => '/rapor-sorgula', 'tone' => 'white', 'icon' => 'report'],
            ['label' => 'Randevu', 'href' => '/randevu', 'tone' => 'gray', 'icon' => 'appointment'],
            ['label' => 'Kampanyalar', 'href' => '/kampanyalar', 'tone' => 'gray', 'icon' => 'campaign'],
            ['label' => 'Galeri', 'href' => '/galeri', 'tone' => 'white', 'icon' => 'gallery'],
            ['label' => 'Bayilik Başvurusu', 'href' => '/bayilik', 'tone' => 'white', 'icon' => 'franchise'],
            ['label' => 'İletişim ve Yol Tarifi', 'href' => '/iletisim', 'tone' => 'gray', 'icon' => 'contact'],
        ];
        foreach ($quick as $index => &$item) { $item['visible'] = true; $item['order'] = $index + 1; }
        self::insert('ng_page', 'Ana Sayfa', '', '', [
            'hero_eyebrow' => 'Lüleburgaz Oto Ekspertiz', 'hero_heading' => 'Aracın durumunu net gör.',
            'hero_description' => 'Satın alma kararından önce motor, mekanik ve kaporta kontrollerini profesyonel ekspertiz desteğiyle tamamlayın.',
            'primary_cta_label' => 'Hemen Ara', 'primary_cta_href' => 'tel:+905532182136',
            'secondary_cta_label' => 'WhatsApp', 'secondary_cta_href' => 'https://wa.me/905532182136',
            'sections_json' => wp_json_encode(['locationTitle' => 'Yeni Sanayi Sitesi’ndeyiz', 'quickAccessTitle' => 'İhtiyacın olan işleme doğrudan ulaş', 'discoverTitle' => 'Garajdan içerikler'], JSON_UNESCAPED_UNICODE),
            'quick_access_json' => wp_json_encode($quick, JSON_UNESCAPED_UNICODE),
            'visibility_json' => wp_json_encode(['location' => true, 'quickAccess' => true, 'discover' => true]),
            'seo_title' => 'Nokta Garage | Lüleburgaz Oto Ekspertiz',
            'seo_description' => 'Nokta Garage Lüleburgaz oto ekspertiz hizmetleri, ekspertiz paketleri, randevu ve yol tarifi bilgileri.',
        ], 'home');
    }

    private static function seed_blog(): void
    {
        $posts = [
            [
                'İkinci El Araç Alırken Ekspertiz Raporunda Nelere Bakılır?', 'ikinci-el-arac-alirken-ekspertiz-rehberi', '2026-08-30 09:00:00', 'Araç Alım Rehberi',
                'Ekspertiz raporunu yalnızca sonuç listesi olarak değil, satın alma kararını destekleyen bütüncül bir kontrol olarak okumak için temel başlıklar.',
                'İkinci el araç alımında tek bir ölçüm ya da tek bir kusur, aracın tamamı hakkında karar vermek için yeterli değildir. Sağlıklı değerlendirme; bulguların birlikte okunmasına, kullanım beklentisine ve gerekli bakım ihtiyacına dayanır.',
                '<h2>Raporu bölüm bölüm inceleyin</h2><p>Kaporta, motor-mekanik, fren-süspansiyon ve elektronik kontroller farklı risk alanlarını anlatır. Bir bölümdeki bulgu, diğer bölümdeki sonuçlarla birlikte değerlendirildiğinde daha anlamlı hâle gelir.</p><ul><li>Kaporta ve boya ölçümlerinin parça bazındaki dağılımı</li><li>Motor ve mekanik sistemlerde gözlenen mevcut durum</li><li>Fren, süspansiyon ve yol güvenliğini etkileyen kontroller</li><li>Elektronik sistemlerde kayıtlı veya gözlenen uyarılar</li></ul><h2>Bulgunun etkisini uzmana sorun</h2><p>Raporda yazan bir tespitin acil onarım gerektirip gerektirmediği, kullanım güvenliğine etkisi ve yaklaşık bakım önceliği uzman açıklamasıyla netleşir. Anlamadığınız ifadeleri doğrudan sormak, yalnızca raporu okumaktan daha sağlıklı bir karar zemini oluşturur.</p><h2>Kararı tek veriye bağlamayın</h2><p>Araç yaşı, kilometresi, bakım geçmişi, kullanım amacı ve ekspertiz bulguları birlikte ele alınmalıdır. Ekspertiz satın alma kararını sizin yerinize vermez; aracın mevcut durumunu daha görünür hâle getirir.</p>',
                'Ekspertiz alanında kontrol edilen otomobil', 'İkinci El Araç Ekspertiz Raporu Rehberi | Nokta Garage', 'İkinci el araç alırken ekspertiz raporunda kaporta, mekanik, elektronik ve test sonuçlarını nasıl birlikte değerlendireceğinizi öğrenin.',
            ],
            [
                'Boya Ölçümü Ne Anlatır?', 'boya-olcumu-ne-anlatir', '2026-08-26 09:00:00', 'Ekspertiz Bilgileri',
                'Mikron ölçümünün neyi gösterdiğini, tek bir sayının neden yeterli olmadığını ve parçalar arası karşılaştırmanın önemini öğrenin.',
                'Boya kalınlığı ölçümü, araç gövdesindeki metal yüzeylerden alınan değerlerin karşılaştırılmasına yardımcı olur. Amaç yalnızca yüksek veya düşük bir sayı bulmak değil, parçalar arasındaki dağılımı ve olası işlem izlerini değerlendirmektir.',
                '<h2>Tek ölçüm yeterli değildir</h2><p>Aynı parça üzerinde farklı noktalardan ölçüm alınması, yüzeydeki dağılımı görmeyi sağlar. Tek noktadan alınan değer; yüzey yapısı, ölçüm konumu veya cihazın temas biçimi nedeniyle tek başına yanıltıcı olabilir.</p><h2>Parçalar birbiriyle karşılaştırılır</h2><p>Fabrika boya kalınlıkları marka, model, üretim yöntemi ve parça yapısına göre değişebilir. Bu nedenle değerlendirme sabit bir sayı ezberinden çok, aracın kendi parçaları arasındaki tutarlılığa dayanır.</p><ul><li>Aynı parça üzerindeki farklı ölçüm noktaları</li><li>Komşu gövde parçalarının değerleri</li><li>Yüzeyde gözlenen doku ve işlem izleri</li><li>Metal ve metal olmayan parça ayrımı</li></ul><h2>Sonuç görsel kontrolle tamamlanır</h2><p>Mikron verisi, uzman gözlemi ve kaporta kontrolüyle birlikte okunmalıdır. Ölçüm cihazı önemli bir veri sağlar; ancak aracın geçmişi hakkında tek başına kesin hüküm kurmaz.</p>',
                'Oto ekspertiz kontrol alanındaki araç', 'Araç Boya Ölçümü ve Mikron Değerleri | Nokta Garage', 'Oto ekspertizde boya ölçümünün ne anlattığını, mikron değerlerinin nasıl karşılaştırıldığını ve sonuçların neden parça bazında okunduğunu öğrenin.',
            ],
            [
                'Ekspertiz Öncesi Araç Nasıl Hazırlanır?', 'ekspertiz-oncesi-arac-nasil-hazirlanir', '2026-08-22 09:00:00', 'Bakım ve Teknik Bilgiler',
                'Randevu öncesinde yapılacak birkaç basit hazırlık, kontrollerin daha düzenli ve verimli ilerlemesine yardımcı olabilir.',
                'Ekspertiz öncesi kapsamlı bakım yaptırmak gerekmez. Ancak araca erişimi kolaylaştıran ve mevcut durumu doğru aktarmaya yardımcı olan basit hazırlıklar süreci hızlandırabilir.',
                '<h2>Temel bilgileri hazır bulundurun</h2><p>Araç plakası, kilometre bilgisi ve varsa bilinen arıza veya uyarılar önceden paylaşılabilir. Satıcı ya da araç sahibi, yakın dönemde yapılan bakım ve değişen parçalar hakkında bilgi verebiliyorsa bu bilgileri de yanında bulundurmalıdır.</p><h2>Kontrol alanlarını erişilebilir bırakın</h2><p>Bagaj ve araç içindeki yoğun kişisel eşyalar bazı kontrol noktalarına erişimi zorlaştırabilir. Değerli eşyaların alınması ve erişim gereken alanların mümkün olduğunca boş bırakılması faydalıdır.</p><ul><li>Gösterge panelindeki uyarıları önceden silmeyin veya gizlemeyin</li><li>Araçta yeterli yakıt bulunduğundan emin olun</li><li>Varsa yedek anahtar ve ilgili belgeleri hazır tutun</li><li>Bilinen arızaları ekspertiz ekibiyle açıkça paylaşın</li></ul><h2>Randevu kapsamını önceden netleştirin</h2><p>Seçilen ekspertiz paketinin hangi kontrolleri içerdiğini randevu öncesinde öğrenmek, beklentiyi doğru kurar. İhtiyaç duyulan ek kontrol varsa görüşme sırasında belirtilmelidir.</p>',
                'Kontrol için ekspertiz alanına alınan otomobil', 'Oto Ekspertiz Öncesi Araç Hazırlığı | Nokta Garage', 'Oto ekspertiz randevusundan önce araç belgeleri, yakıt seviyesi, kişisel eşyalar ve bilinen arızalar için yapılabilecek hazırlıkları inceleyin.',
            ],
            [
                'Nokta Garage Ekspertiz Yaklaşımı', 'nokta-garage-ekspertiz-yaklasimi', '2026-08-18 09:00:00', "Nokta Garage'dan",
                'Kontrolün yalnızca rapor üretmekten ibaret olmadığı; bulguların anlaşılır biçimde açıklanmasının neden önemli olduğu üzerine kısa bir başlangıç yazısı.',
                'Nokta Garage’ın yaklaşımı, araç üzerinde gözlenen bulguları düzenli bir kontrol akışıyla kayıt altına almak ve sonucu anlaşılır biçimde aktarmaktır. Hedef yalnızca bir rapor sunmak değil, rapordaki tespitlerin ne anlama geldiğini açıklamaktır.',
                '<h2>Kontrol ve açıklama birlikte ilerler</h2><p>Araçla ilgili teknik ifadeler herkes için aynı derecede anlaşılır olmayabilir. Bu nedenle müşterinin rapordaki bulgular hakkında soru sorabilmesi ve önemli noktaları uzmanla değerlendirebilmesi sürecin temel parçalarındandır.</p><h2>İhtiyaca göre hizmet seçenekleri</h2><p>Lüleburgaz şubesindeki ekspertiz paketlerinin yanında, uygun koşullarda mobil kontrol desteği ve şehir dışındaki alıcılar için uzaktan ekspertiz seçeneği bulunur. Her hizmetin kapsamı kendi koşulları içinde netleştirilir.</p><h2>Sektör tecrübesiyle gelişen süreç</h2><p>2018’den bu yana oto ekspertiz sektöründe edinilen tecrübe, farklı yaş ve durumdaki araçlarla karşılaşmayı ve kontrol akışını sürekli geliştirmeyi sağlamıştır.</p>',
                'Nokta Garage ekspertiz alanındaki araç', 'Nokta Garage Ekspertiz Yaklaşımı', 'Nokta Garage’ın kontrol, raporlama ve uzman açıklaması yaklaşımını; şube, mobil ve uzaktan ekspertiz seçeneklerini inceleyin.',
            ],
        ];
        foreach ($posts as [$title, $slug, $date, $category, $excerpt, $intro, $content, $cover_alt, $seo_title, $seo_description]) {
            self::insert('post', $title, $content, $excerpt, [
                'blog_category' => $category, 'blog_intro' => $intro, 'cover_alt' => $cover_alt,
                'seo_title' => $seo_title, 'seo_description' => $seo_description,
            ], $slug, $date);
        }
    }

    private static function insert(string $type, string $title, string $content, string $excerpt, array $meta, string $slug = '', string $date = ''): int
    {
        $existing = get_posts(['post_type' => $type, 'name' => $slug ?: sanitize_title($title), 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids']);
        if ($existing) return (int) $existing[0];
        $post_id = wp_insert_post([
            'post_type' => $type, 'post_status' => 'publish', 'post_title' => $title,
            'post_name' => $slug ?: sanitize_title($title), 'post_content' => $content,
            'post_excerpt' => $excerpt, 'post_date' => $date ?: current_time('mysql'),
        ], true);
        if (is_wp_error($post_id)) return 0;
        foreach ($meta as $key => $value) update_post_meta($post_id, '_ng_' . $key, $value);
        return (int) $post_id;
    }
}
