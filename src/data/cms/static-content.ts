import { blogPosts } from "../blog-posts";
import { parseCmsContent } from "./schema";

const serviceSeed = [
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

const allBody = ["motor-mekanik", "mekanik-alt", "boya-kaporta", "kaporta-boyama", "direk-boyama", "sasi-boyama"];
const allDetailed = [...allBody, "dyno-motor-performans", "fren", "suspansiyon", "yanal-kayma", "ic-doseme-cam", "dis-ayna-aydinlatma", "lastik"];
const packageSeed = [
  ["Standart", "standart", allBody],
  ["Kaporta Kontrol", "kaporta-kontrol", allBody.slice(2)],
  ["Motor Kontrol", "motor-kontrol", ["motor-mekanik", "mekanik-alt", "dyno-motor-performans"]],
  ["Dyno Motor Test", "dyno-motor-test", ["dyno-motor-performans"]],
  ["Detaylı", "detayli", allDetailed],
  ["Detaylı ve Airbagli", "detayli-ve-airbagli", [...allDetailed, "hava-yastigi-kontrolleri"]],
  ["Tek Airbag", "tek-airbag", ["hava-yastigi-kontrolleri"]],
] as const;

export const staticSiteContent = parseCmsContent({
  packages: packageSeed.map(([name, slug, serviceSlugs], index) => ({ name, slug, price: "1xxx TL", serviceSlugs: [...serviceSlugs], order: index + 1 })),
  services: serviceSeed.map(([name, slug, category, description, icon], index) => ({ name, slug, category, description, icon, order: index + 1 })),
  campaigns: [],
  blogPosts,
  gallery: [
    { id: "dis-cephe", image: null, alt: "Nokta Garage dış cephe", caption: null, order: 1 },
    { id: "ic-alan", image: null, alt: "Nokta Garage iç alan", caption: null, order: 2 },
    { id: "cihazlar", image: null, alt: "Nokta Garage ekspertiz cihazları", caption: null, order: 3 },
    { id: "surec", image: "/images/mobile-inspection-1280.webp", alt: "Nokta Garage mobil ekspertiz sırasında araç kontrolü", caption: "Nokta Garage ekspertiz süreci", order: 4 },
  ],
  branch: {
    name: "Nokta Garage Lüleburgaz", city: "Kırklareli", district: "Lüleburgaz",
    address: "Atatürk Mahallesi, Yeni Sanayi Sitesi, A/4 Blok, 6. Sokak, No:64, 39750 Lüleburgaz/Kırklareli, Türkiye",
    shortAddress: "Atatürk Mahallesi, A/4 Blok, 6. Sokak, No:64", phone: "+90 553 218 21 36",
    phoneHref: "tel:+905532182136", whatsapp: "https://wa.me/905532182136", email: "otoekspertiznokta@gmail.com",
    mapsUrl: "https://share.google/5YHlpgYMIs2tCrZ8v", workingHours: "Her gün 08:00–18:00",
    defaultWhatsappMessage: "Merhaba, Nokta Garage oto ekspertiz hizmetleri hakkında bilgi almak istiyorum.",
  },
  home: { heroImage: "/images/home-hero.webp" },
});
