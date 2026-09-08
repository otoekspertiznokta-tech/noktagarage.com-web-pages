export const siteConfig = {
  brandName: "Nokta Garage",
  brandDescriptor: "Oto Ekspertiz",
  logo: "/logo-320.webp",
  favicon: "/favicon.png",
  footerText: "2018’den bu yana oto ekspertiz sektöründe edinilen tecrübe.",
  copyright: "© 2018 Nokta Garage",
  defaultSeo: {
    title: "Nokta Garage | Profesyonel Oto Ekspertiz",
    description: "Nokta Garage oto ekspertiz hizmetleri, paketleri ve iletişim bilgileri.",
  },
  defaultSocialImage: "/images/home-hero.webp",
  navigation: {
    services: [{ label: "Hizmetler", href: "/hizmetler" }, { label: "Mobil Ekspertiz", href: "/mobil-ekspertiz" }, { label: "Uzaktan Ekspertiz", href: "/uzaktan-ekspertiz" }],
    corporate: [{ label: "Hakkımızda", href: "/hakkimizda" }, { label: "Bayilik", href: "/bayilik" }, { label: "İnsan Kaynakları", href: "/insan-kaynaklari" }],
    mobile: [{ label: "Ekspertiz Paketleri", href: "/ekspertiz-paketleri" }, { label: "Hizmetler", href: "/hizmetler" }, { label: "Mobil Ekspertiz", href: "/mobil-ekspertiz" }, { label: "Uzaktan Ekspertiz", href: "/uzaktan-ekspertiz" }, { label: "Rapor Sorgula", href: "/rapor-sorgula" }, { label: "Randevu", href: "/randevu" }, { label: "Kampanyalar", href: "/kampanyalar" }, { label: "Galeri", href: "/galeri" }, { label: "Blog", href: "/blog" }, { label: "Hakkımızda", href: "/hakkimizda" }, { label: "Bayilik", href: "/bayilik" }, { label: "İnsan Kaynakları", href: "/insan-kaynaklari" }, { label: "İletişim", href: "/iletisim" }],
    legal: [{ label: "KVKK", href: "/kvkk" }, { label: "Aydınlatma", href: "/aydinlatma-metni" }, { label: "Gizlilik", href: "/gizlilik-politikasi" }],
  },
  home: {
    eyebrow: "Lüleburgaz Oto Ekspertiz",
    heading: "Aracın durumunu net gör.",
    description: "Satın alma kararından önce motor, mekanik ve kaporta kontrollerini profesyonel ekspertiz desteğiyle tamamlayın.",
    locationTitle: "Yeni Sanayi Sitesi’ndeyiz",
    quickAccessTitle: "İhtiyacın olan işleme doğrudan ulaş",
    discoverTitle: "Garajdan içerikler",
    seo: {
      title: "Nokta Garage | Lüleburgaz Oto Ekspertiz",
      description: "Nokta Garage Lüleburgaz oto ekspertiz hizmetleri, ekspertiz paketleri, randevu ve yol tarifi bilgileri.",
    },
    quickAccess: [
      { label: "Ekspertiz Paketleri", href: "/ekspertiz-paketleri", tone: "white", icon: "package" },
      { label: "Hizmetler", href: "/hizmetler", tone: "gray", icon: "service" },
      { label: "Mobil Ekspertiz", href: "/mobil-ekspertiz", tone: "gray", icon: "mobile" },
      { label: "Uzaktan Ekspertiz", href: "/uzaktan-ekspertiz", tone: "white", icon: "remote" },
      { label: "Rapor Sorgula", href: "/rapor-sorgula", tone: "white", icon: "report" },
      { label: "Randevu", href: "/randevu", tone: "gray", icon: "appointment" },
      { label: "Kampanyalar", href: "/kampanyalar", tone: "gray", icon: "campaign" },
      { label: "Galeri", href: "/galeri", tone: "white", icon: "gallery" },
      { label: "Bayilik Başvurusu", href: "/bayilik", tone: "white", icon: "franchise" },
      { label: "İletişim ve Yol Tarifi", href: "/iletisim", tone: "gray", icon: "contact" },
    ] as const,
  },
} as const;

export type NavigationLink = { label: string; href: string };
