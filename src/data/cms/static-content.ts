import { blogPosts } from "../blog-posts";
import type { SiteContentSnapshot } from "./schema";

const phone = "+90 553 218 21 36";
const phoneHref = "tel:+905532182136";
const whatsappBaseUrl = "https://wa.me/905532182136";
const email = "otoekspertiznokta@gmail.com";
const mapsUrl = "https://share.google/5YHlpgYMIs2tCrZ8v";

const packageSeed = [
  ["Standart", ["Motor ve Mekanik Kontrolleri", "Araç Altı Mekanik Kontrolleri", "Boya ve Kaporta Kontrolleri", "Kaporta Parçaları Boya Kontrolleri", "Araç Direkleri Boya ve Yapısal Kontrolleri", "Şasi Kontrolleri"]],
  ["Kaporta Kontrol", ["Boya ve Kaporta Kontrolleri", "Kaporta Parçaları Boya Kontrolleri", "Araç Direkleri Boya ve Yapısal Kontrolleri", "Şasi Kontrolleri"]],
  ["Motor Kontrol", ["Motor ve Mekanik Kontrolleri", "Araç Altı Mekanik Kontrolleri", "Motor Performans Testi (Dyno)"]],
  ["Dyno Motor Test", ["Motor Performans Testi (Dyno)"]],
  ["Detaylı", ["Motor ve Mekanik Kontrolleri", "Araç Altı Mekanik Kontrolleri", "Boya ve Kaporta Kontrolleri", "Kaporta Parçaları Boya Kontrolleri", "Araç Direkleri Boya ve Yapısal Kontrolleri", "Şasi Kontrolleri", "Motor Performans Testi (Dyno)", "Fren Sistemi Kontrolleri", "Süspansiyon Sistemi Kontrolleri", "Yanal Kayma Testi", "İç Donanım ve Cam Kontrolleri", "Ayna ve Aydınlatma Kontrolleri", "Lastik Kontrolleri"]],
  ["Detaylı ve Airbagli", ["Motor ve Mekanik Kontrolleri", "Araç Altı Mekanik Kontrolleri", "Boya ve Kaporta Kontrolleri", "Kaporta Parçaları Boya Kontrolleri", "Araç Direkleri Boya ve Yapısal Kontrolleri", "Şasi Kontrolleri", "Motor Performans Testi (Dyno)", "Fren Sistemi Kontrolleri", "Süspansiyon Sistemi Kontrolleri", "Yanal Kayma Testi", "İç Donanım ve Cam Kontrolleri", "Ayna ve Aydınlatma Kontrolleri", "Lastik Kontrolleri", "Hava Yastığı (Airbag) Kontrolleri"]],
  ["Tek Airbag", ["Hava Yastığı (Airbag) Kontrolleri"]],
] as const;

const services = [
  ["Motor ve Mekanik Kontrolleri", "motor-mekanik", "Motor ve Mekanik", "Motorun çalışma karakteri, ses ve titreşimleri ile erişilebilen mekanik parçalar ve olası sıvı kaçakları kontrol edilir.", "wrench"],
  ["Araç Altı Mekanik Kontrolleri", "mekanik-alt", "Motor ve Mekanik", "Araç altındaki erişilebilir mekanik bileşenler; hasar, aşınma ve kaçak belirtileri açısından incelenir.", "search"],
  ["Boya ve Kaporta Kontrolleri", "boya-kaporta", "Gövde Kontrolleri", "Aracın dış gövdesi ve kaporta parçalarının genel durumu, görünür işlem ve hasar izleri açısından değerlendirilir.", "car"],
  ["Kaporta Parçaları Boya Kontrolleri", "kaporta-boyama", "Gövde Kontrolleri", "Kaporta parçalarında boyalı, değişen veya işlem görmüş olabilecek alanlara yönelik ölçüm ve yüzey kontrolleri yapılır.", "paint"],
  ["Araç Direkleri Boya ve Yapısal Kontrolleri", "direk-boyama", "Gövde Kontrolleri", "Araç direkleri, boya ve onarım belirtisi taşıyabilecek alanlar açısından kontrol edilir.", "scan"],
  ["Şasi Kontrolleri", "sasi-boyama", "Gövde Kontrolleri", "Şasi üzerindeki erişilebilir bölgeler boya, işlem ve onarım belirtileri açısından değerlendirilir.", "box"],
  ["Motor Performans Testi (Dyno)", "dyno-motor-performans", "Test Sistemleri", "Uygun test koşullarında motor performansına ilişkin ölçüm sonuçları dyno cihazı üzerinden değerlendirilir.", "gauge"],
  ["Fren Sistemi Kontrolleri", "fren", "Test Sistemleri", "Fren performansı ve tekerlekler arasındaki frenleme dengesi test ekipmanı üzerinden kontrol edilir.", "brake"],
  ["Süspansiyon Sistemi Kontrolleri", "suspansiyon", "Test Sistemleri", "Süspansiyon sisteminin ölçülebilen performansı ve sağ-sol dengesi test sonuçlarıyla değerlendirilir.", "suspension"],
  ["Yanal Kayma Testi", "yanal-kayma", "Test Sistemleri", "Aracın düz ilerleme eğilimi ve yanal sapma değeri uygun test düzeneğinde ölçülür.", "alignment"],
  ["İç Donanım ve Cam Kontrolleri", "ic-doseme-cam", "İç ve Dış Donanım", "İç döşeme, koltuklar ve camların görünür durumu temel işlev ve hasar belirtileri açısından incelenir.", "interior"],
  ["Ayna ve Aydınlatma Kontrolleri", "dis-ayna-aydinlatma", "İç ve Dış Donanım", "Dış aynalar ile temel dış aydınlatma elemanlarının görünür durumu ve işlevleri kontrol edilir.", "light"],
  ["Lastik Kontrolleri", "lastik", "İç ve Dış Donanım", "Lastiklerin görünür yüzeyi, diş durumu ve düzensiz aşınma belirtileri incelenir.", "tire"],
  ["Hava Yastığı (Airbag) Kontrolleri", "hava-yastigi-kontrolleri", "Güvenlik Sistemleri", "Hava yastığı sistemine ilişkin erişilebilen göstergeler ve kontrol bulguları değerlendirilir.", "airbag"],
] as const;

const campaignMessage = "Merhaba, güncel kampanyalarınız hakkında bilgi almak istiyorum.";
const campaignUrl = `${whatsappBaseUrl}?text=${encodeURIComponent(campaignMessage)}`;

export const staticSiteContent: SiteContentSnapshot = {
  packages: packageSeed.map(([name, serviceNames], index) => ({
    name,
    slug: name.toLocaleLowerCase("tr-TR").replaceAll(" ", "-").replaceAll("ı", "i").replaceAll("ş", "s").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ö", "o").replaceAll("ç", "c"),
    summary: `${name} ekspertiz paketinin kontrol kapsamı.`,
    description: `${name} paketine dahil kontrol gruplarını ve hizmet kapsamını inceleyin.`,
    price: "1xxx TL",
    services: [...serviceNames],
    featured: name === "Detaylı",
    active: true,
    order: index + 1,
    cta: { label: "Bilgi Al", href: "/randevu" },
    whatsappMessage: `${name} ekspertiz paketi hakkında bilgi almak istiyorum.`,
    seo: { title: `${name} Ekspertiz Paketi | Nokta Garage`, description: `${name} oto ekspertiz paketinin kontrol kapsamını inceleyin.` },
  })),
  services: services.map(([name, slug, category, description, icon], index) => ({
    name, slug, category, summary: description, description, icon,
    active: true, order: index + 1,
    seo: { title: `${name} | Nokta Garage`, description },
  })),
  campaigns: [
    { title: "Süresi Dolmuş Kampanya Örneği", slug: "suresi-dolmus-ornek", summary: "Bu kayıt tarih sonlandırma davranışını doğrulamak için görünmez tutulur.", detail: "Süresi dolan kampanyalar statik build sonrasında da otomatik olarak gizlenir.", startsAt: "2025-01-01", endsAt: "2025-01-31", active: true, order: 1, cta: { label: "Bilgi Al", href: campaignUrl }, whatsappMessage: campaignMessage },
    { title: "Pasif Kampanya Örneği", slug: "pasif-ornek", summary: "Bu kayıt aktiflik kontrolünü doğrulamak için görünmez tutulur.", detail: "CMS tarafında aktif olmayan kayıtlar public sayfada gösterilmez.", startsAt: "2026-01-01", endsAt: "2099-12-31", active: false, order: 2, cta: { label: "Bilgi Al", href: campaignUrl }, whatsappMessage: campaignMessage },
  ],
  blogPosts,
  gallery: [
    { id: "dis-cephe", alt: "Nokta Garage dış cephe", placeholderLabel: "Dış Cephe", icon: "building", order: 1, active: true },
    { id: "ic-alan", alt: "Nokta Garage iç alan", placeholderLabel: "İç Alan", icon: "car", order: 2, active: true },
    { id: "cihazlar", alt: "Nokta Garage ekspertiz cihazları", placeholderLabel: "Ekspertiz Cihazları", icon: "gauge", order: 3, active: true },
    { id: "surec", alt: "Nokta Garage mobil ekspertiz sırasında araç kontrolü", image: "/images/mobile-inspection-1280.webp", caption: "Nokta Garage ekspertiz süreci", placeholderLabel: "Ekspertiz Süreci", icon: "scan", order: 4, active: true },
  ],
  branches: [{
    name: "Nokta Garage Lüleburgaz", slug: "luleburgaz", city: "Kırklareli", district: "Lüleburgaz",
    address: "Atatürk Mahallesi, Yeni Sanayi Sitesi, A/4 Blok, 6. Sokak, No:64, 39750 Lüleburgaz/Kırklareli, Türkiye",
    shortAddress: "Atatürk Mahallesi, A/4 Blok, 6. Sokak, No:64", phone, phoneHref, whatsapp: whatsappBaseUrl, email, mapsUrl,
    workingHours: "Her gün 08:00–18:00", images: [],
    description: "Nokta Garage Lüleburgaz oto ekspertiz şubesi.", active: true,
    seo: { title: "Lüleburgaz Oto Ekspertiz | Nokta Garage", description: "Nokta Garage Lüleburgaz şubesi adres, çalışma saatleri ve iletişim bilgileri." },
  }],
  pages: {
    home: {
      slug: "home", title: "Ana Sayfa",
      hero: { eyebrow: "Lüleburgaz Oto Ekspertiz", heading: "Aracın durumunu net gör.", description: "Satın alma kararından önce motor, mekanik ve kaporta kontrollerini profesyonel ekspertiz desteğiyle tamamlayın.", image: "/images/home-hero.webp", primaryCta: { label: "Hemen Ara", href: phoneHref }, secondaryCta: { label: "WhatsApp", href: whatsappBaseUrl } },
      sections: { locationTitle: "Yeni Sanayi Sitesi’ndeyiz", quickAccessTitle: "İhtiyacın olan işleme doğrudan ulaş", discoverTitle: "Garajdan içerikler" },
      quickAccess: [
        { label: "Ekspertiz Paketleri", href: "/ekspertiz-paketleri", tone: "white", icon: "package", visible: true, order: 1 },
        { label: "Hizmetler", href: "/hizmetler", tone: "gray", icon: "service", visible: true, order: 2 },
        { label: "Mobil Ekspertiz", href: "/mobil-ekspertiz", tone: "gray", icon: "mobile", visible: true, order: 3 },
        { label: "Uzaktan Ekspertiz", href: "/uzaktan-ekspertiz", tone: "white", icon: "remote", visible: true, order: 4 },
        { label: "Rapor Sorgula", href: "/rapor-sorgula", tone: "white", icon: "report", visible: true, order: 5 },
        { label: "Randevu", href: "/randevu", tone: "gray", icon: "appointment", visible: true, order: 6 },
        { label: "Kampanyalar", href: "/kampanyalar", tone: "gray", icon: "campaign", visible: true, order: 7 },
        { label: "Galeri", href: "/galeri", tone: "white", icon: "gallery", visible: true, order: 8 },
        { label: "Bayilik Başvurusu", href: "/bayilik", tone: "white", icon: "franchise", visible: true, order: 9 },
        { label: "İletişim ve Yol Tarifi", href: "/iletisim", tone: "gray", icon: "contact", visible: true, order: 10 },
      ],
      visibility: { location: true, quickAccess: true, discover: true },
      seo: { title: "Nokta Garage | Lüleburgaz Oto Ekspertiz", description: "Nokta Garage Lüleburgaz oto ekspertiz hizmetleri, ekspertiz paketleri, randevu ve yol tarifi bilgileri." },
    },
  },
  settings: {
    brandName: "Nokta Garage", brandDescriptor: "Oto Ekspertiz", logo: "/logo-320.webp", alternateLogo: "/logo-640.webp", favicon: "/favicon.png",
    primaryPhone: phone, phoneHref, whatsappBaseUrl, email, socialLinks: [],
    defaultWhatsappMessage: "Merhaba, Nokta Garage oto ekspertiz hizmetleri hakkında bilgi almak istiyorum.",
    footerText: "2018’den bu yana oto ekspertiz sektöründe edinilen tecrübe.", copyright: "© 2026 Nokta Garage",
    mapsUrl, googleBusinessUrl: mapsUrl, workingHours: "Her gün 08:00–18:00",
    defaultSeo: { title: "Nokta Garage | Profesyonel Oto Ekspertiz", description: "Nokta Garage oto ekspertiz hizmetleri, paketleri ve iletişim bilgileri." },
    defaultSocialImage: "/images/home-hero.webp",
    navigation: {
      services: [{ label: "Hizmetler", href: "/hizmetler" }, { label: "Mobil Ekspertiz", href: "/mobil-ekspertiz" }, { label: "Uzaktan Ekspertiz", href: "/uzaktan-ekspertiz" }],
      corporate: [{ label: "Hakkımızda", href: "/hakkimizda" }, { label: "Bayilik", href: "/bayilik" }, { label: "İnsan Kaynakları", href: "/insan-kaynaklari" }],
      mobile: [{ label: "Ekspertiz Paketleri", href: "/ekspertiz-paketleri" }, { label: "Hizmetler", href: "/hizmetler" }, { label: "Mobil Ekspertiz", href: "/mobil-ekspertiz" }, { label: "Uzaktan Ekspertiz", href: "/uzaktan-ekspertiz" }, { label: "Rapor Sorgula", href: "/rapor-sorgula" }, { label: "Randevu", href: "/randevu" }, { label: "Kampanyalar", href: "/kampanyalar" }, { label: "Galeri", href: "/galeri" }, { label: "Blog", href: "/blog" }, { label: "Hakkımızda", href: "/hakkimizda" }, { label: "Bayilik", href: "/bayilik" }, { label: "İnsan Kaynakları", href: "/insan-kaynaklari" }, { label: "İletişim", href: "/iletisim" }],
      legal: [{ label: "KVKK", href: "/kvkk" }, { label: "Aydınlatma", href: "/aydinlatma-metni" }, { label: "Gizlilik", href: "/gizlilik-politikasi" }],
    },
  },
};
