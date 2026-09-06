export const blogCategories = [
  "Araç Alım Rehberi",
  "Ekspertiz Bilgileri",
  "Bakım ve Teknik Bilgiler",
  "Nokta Garage'dan",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  category: BlogCategory;
  publishedAt: string;
  displayDate: string;
  coverImage: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  sections: BlogSection[];
  /** WordPress blok editöründen gelen, sunucu tarafında temizlenmiş içerik. */
  contentHtml?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ikinci-el-arac-alirken-ekspertiz-rehberi",
    title: "İkinci El Araç Alırken Ekspertiz Raporunda Nelere Bakılır?",
    summary: "Ekspertiz raporunu yalnızca sonuç listesi olarak değil, satın alma kararını destekleyen bütüncül bir kontrol olarak okumak için temel başlıklar.",
    category: "Araç Alım Rehberi",
    publishedAt: "2026-08-30",
    displayDate: "30 Ağustos 2026",
    coverImage: "/images/home-hero.webp",
    coverAlt: "Ekspertiz alanında kontrol edilen otomobil",
    seoTitle: "İkinci El Araç Ekspertiz Raporu Rehberi | Nokta Garage",
    seoDescription: "İkinci el araç alırken ekspertiz raporunda kaporta, mekanik, elektronik ve test sonuçlarını nasıl birlikte değerlendireceğinizi öğrenin.",
    intro: "İkinci el araç alımında tek bir ölçüm ya da tek bir kusur, aracın tamamı hakkında karar vermek için yeterli değildir. Sağlıklı değerlendirme; bulguların birlikte okunmasına, kullanım beklentisine ve gerekli bakım ihtiyacına dayanır.",
    sections: [
      {
        heading: "Raporu bölüm bölüm inceleyin",
        paragraphs: [
          "Kaporta, motor-mekanik, fren-süspansiyon ve elektronik kontroller farklı risk alanlarını anlatır. Bir bölümdeki bulgu, diğer bölümdeki sonuçlarla birlikte değerlendirildiğinde daha anlamlı hâle gelir.",
        ],
        bullets: [
          "Kaporta ve boya ölçümlerinin parça bazındaki dağılımı",
          "Motor ve mekanik sistemlerde gözlenen mevcut durum",
          "Fren, süspansiyon ve yol güvenliğini etkileyen kontroller",
          "Elektronik sistemlerde kayıtlı veya gözlenen uyarılar",
        ],
      },
      {
        heading: "Bulgunun etkisini uzmana sorun",
        paragraphs: [
          "Raporda yazan bir tespitin acil onarım gerektirip gerektirmediği, kullanım güvenliğine etkisi ve yaklaşık bakım önceliği uzman açıklamasıyla netleşir. Anlamadığınız ifadeleri doğrudan sormak, yalnızca raporu okumaktan daha sağlıklı bir karar zemini oluşturur.",
        ],
      },
      {
        heading: "Kararı tek veriye bağlamayın",
        paragraphs: [
          "Araç yaşı, kilometresi, bakım geçmişi, kullanım amacı ve ekspertiz bulguları birlikte ele alınmalıdır. Ekspertiz satın alma kararını sizin yerinize vermez; aracın mevcut durumunu daha görünür hâle getirir.",
        ],
      },
    ],
  },
  {
    slug: "boya-olcumu-ne-anlatir",
    title: "Boya Ölçümü Ne Anlatır?",
    summary: "Mikron ölçümünün neyi gösterdiğini, tek bir sayının neden yeterli olmadığını ve parçalar arası karşılaştırmanın önemini öğrenin.",
    category: "Ekspertiz Bilgileri",
    publishedAt: "2026-08-26",
    displayDate: "26 Ağustos 2026",
    coverImage: "/images/home-hero.webp",
    coverAlt: "Oto ekspertiz kontrol alanındaki araç",
    seoTitle: "Araç Boya Ölçümü ve Mikron Değerleri | Nokta Garage",
    seoDescription: "Oto ekspertizde boya ölçümünün ne anlattığını, mikron değerlerinin nasıl karşılaştırıldığını ve sonuçların neden parça bazında okunduğunu öğrenin.",
    intro: "Boya kalınlığı ölçümü, araç gövdesindeki metal yüzeylerden alınan değerlerin karşılaştırılmasına yardımcı olur. Amaç yalnızca yüksek veya düşük bir sayı bulmak değil, parçalar arasındaki dağılımı ve olası işlem izlerini değerlendirmektir.",
    sections: [
      {
        heading: "Tek ölçüm yeterli değildir",
        paragraphs: [
          "Aynı parça üzerinde farklı noktalardan ölçüm alınması, yüzeydeki dağılımı görmeyi sağlar. Tek noktadan alınan değer; yüzey yapısı, ölçüm konumu veya cihazın temas biçimi nedeniyle tek başına yanıltıcı olabilir.",
        ],
      },
      {
        heading: "Parçalar birbiriyle karşılaştırılır",
        paragraphs: [
          "Fabrika boya kalınlıkları marka, model, üretim yöntemi ve parça yapısına göre değişebilir. Bu nedenle değerlendirme sabit bir sayı ezberinden çok, aracın kendi parçaları arasındaki tutarlılığa dayanır.",
        ],
        bullets: [
          "Aynı parça üzerindeki farklı ölçüm noktaları",
          "Komşu gövde parçalarının değerleri",
          "Yüzeyde gözlenen doku ve işlem izleri",
          "Metal ve metal olmayan parça ayrımı",
        ],
      },
      {
        heading: "Sonuç görsel kontrolle tamamlanır",
        paragraphs: [
          "Mikron verisi, uzman gözlemi ve kaporta kontrolüyle birlikte okunmalıdır. Ölçüm cihazı önemli bir veri sağlar; ancak aracın geçmişi hakkında tek başına kesin hüküm kurmaz.",
        ],
      },
    ],
  },
  {
    slug: "ekspertiz-oncesi-arac-nasil-hazirlanir",
    title: "Ekspertiz Öncesi Araç Nasıl Hazırlanır?",
    summary: "Randevu öncesinde yapılacak birkaç basit hazırlık, kontrollerin daha düzenli ve verimli ilerlemesine yardımcı olabilir.",
    category: "Bakım ve Teknik Bilgiler",
    publishedAt: "2026-08-22",
    displayDate: "22 Ağustos 2026",
    coverImage: "/images/home-hero.webp",
    coverAlt: "Kontrol için ekspertiz alanına alınan otomobil",
    seoTitle: "Oto Ekspertiz Öncesi Araç Hazırlığı | Nokta Garage",
    seoDescription: "Oto ekspertiz randevusundan önce araç belgeleri, yakıt seviyesi, kişisel eşyalar ve bilinen arızalar için yapılabilecek hazırlıkları inceleyin.",
    intro: "Ekspertiz öncesi kapsamlı bakım yaptırmak gerekmez. Ancak araca erişimi kolaylaştıran ve mevcut durumu doğru aktarmaya yardımcı olan basit hazırlıklar süreci hızlandırabilir.",
    sections: [
      {
        heading: "Temel bilgileri hazır bulundurun",
        paragraphs: [
          "Araç plakası, kilometre bilgisi ve varsa bilinen arıza veya uyarılar önceden paylaşılabilir. Satıcı ya da araç sahibi, yakın dönemde yapılan bakım ve değişen parçalar hakkında bilgi verebiliyorsa bu bilgileri de yanında bulundurmalıdır.",
        ],
      },
      {
        heading: "Kontrol alanlarını erişilebilir bırakın",
        paragraphs: [
          "Bagaj ve araç içindeki yoğun kişisel eşyalar bazı kontrol noktalarına erişimi zorlaştırabilir. Değerli eşyaların alınması ve erişim gereken alanların mümkün olduğunca boş bırakılması faydalıdır.",
        ],
        bullets: [
          "Gösterge panelindeki uyarıları önceden silmeyin veya gizlemeyin",
          "Araçta yeterli yakıt bulunduğundan emin olun",
          "Varsa yedek anahtar ve ilgili belgeleri hazır tutun",
          "Bilinen arızaları ekspertiz ekibiyle açıkça paylaşın",
        ],
      },
      {
        heading: "Randevu kapsamını önceden netleştirin",
        paragraphs: [
          "Seçilen ekspertiz paketinin hangi kontrolleri içerdiğini randevu öncesinde öğrenmek, beklentiyi doğru kurar. İhtiyaç duyulan ek kontrol varsa görüşme sırasında belirtilmelidir.",
        ],
      },
    ],
  },
  {
    slug: "nokta-garage-ekspertiz-yaklasimi",
    title: "Nokta Garage Ekspertiz Yaklaşımı",
    summary: "Kontrolün yalnızca rapor üretmekten ibaret olmadığı; bulguların anlaşılır biçimde açıklanmasının neden önemli olduğu üzerine kısa bir başlangıç yazısı.",
    category: "Nokta Garage'dan",
    publishedAt: "2026-08-18",
    displayDate: "18 Ağustos 2026",
    coverImage: "/images/home-hero.webp",
    coverAlt: "Nokta Garage ekspertiz alanındaki araç",
    seoTitle: "Nokta Garage Ekspertiz Yaklaşımı",
    seoDescription: "Nokta Garage'ın kontrol, raporlama ve uzman açıklaması yaklaşımını; şube, mobil ve uzaktan ekspertiz seçeneklerini inceleyin.",
    intro: "Nokta Garage'ın yaklaşımı, araç üzerinde gözlenen bulguları düzenli bir kontrol akışıyla kayıt altına almak ve sonucu anlaşılır biçimde aktarmaktır. Hedef yalnızca bir rapor sunmak değil, rapordaki tespitlerin ne anlama geldiğini açıklamaktır.",
    sections: [
      {
        heading: "Kontrol ve açıklama birlikte ilerler",
        paragraphs: [
          "Araçla ilgili teknik ifadeler herkes için aynı derecede anlaşılır olmayabilir. Bu nedenle müşterinin rapordaki bulgular hakkında soru sorabilmesi ve önemli noktaları uzmanla değerlendirebilmesi sürecin temel parçalarındandır.",
        ],
      },
      {
        heading: "İhtiyaca göre hizmet seçenekleri",
        paragraphs: [
          "Lüleburgaz şubesindeki ekspertiz paketlerinin yanında, uygun koşullarda mobil kontrol desteği ve şehir dışındaki alıcılar için uzaktan ekspertiz seçeneği bulunur. Her hizmetin kapsamı kendi koşulları içinde netleştirilir.",
        ],
      },
      {
        heading: "Sektör tecrübesiyle gelişen süreç",
        paragraphs: [
          "2018'den bu yana oto ekspertiz sektöründe edinilen tecrübe, farklı yaş ve durumdaki araçlarla karşılaşmayı ve kontrol akışını sürekli geliştirmeyi sağlamıştır.",
        ],
      },
    ],
  },
];

export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug);
