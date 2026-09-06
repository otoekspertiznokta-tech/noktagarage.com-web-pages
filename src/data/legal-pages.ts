export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  notice?: string;
}

export interface LegalPageContent {
  slug: "kvkk" | "aydinlatma-metni" | "gizlilik-politikasi";
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  sections: LegalSection[];
}

export const legalPages: Record<LegalPageContent["slug"], LegalPageContent> = {
  kvkk: {
    slug: "kvkk",
    eyebrow: "Kişisel Veri Başvuruları",
    title: "KVKK kapsamındaki haklar ve iletişim.",
    description: "Nokta Garage web sitesiyle ilgili kişisel veri başvuruları, haklar ve iletişim kanalları hakkında bilgilendirme.",
    intro: "Kişisel verilerinizle ilgili talep ve sorularınızı aşağıdaki kanallardan bize iletebilirsiniz. Başvurunun niteliğine göre kimlik ve yetki doğrulaması istenebilir.",
    sections: [
      {
        title: "Veri sorumlusu bilgisi",
        paragraphs: [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu Burak Akyüz’dür. İşletme, Lüleburgaz Nokta Garage Ekspertiz adıyla faaliyet göstermektedir.",
          "Vergi dairesi: Lüleburgaz Vergi Dairesi. İletişim adresi: Atatürk Mahallesi, Yeni Sanayi Sitesi, A/4 Blok, 6. Sokak, No:64, Lüleburgaz/Kırklareli. E-posta: otoekspertiznokta@gmail.com. Telefon: +90 553 218 21 36.",
        ],
      },
      {
        title: "Başvurabileceğiniz konular",
        bullets: [
          "Kişisel verinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme",
          "İşleme amacını ve verilerin amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Aktarım yapılan üçüncü kişiler hakkında bilgi isteme",
          "Eksik veya yanlış işlenen verilerin düzeltilmesini talep etme",
          "Mevzuattaki şartlar oluştuğunda silme, yok etme veya anonimleştirme talep etme",
          "Kanunda belirtilen diğer ilgili kişi haklarını kullanma",
        ],
      },
      {
        title: "Başvuru nasıl yapılır?",
        paragraphs: [
          "Talebinizi e-posta ile veya yukarıdaki işletme adresine yazılı olarak iletebilirsiniz. Talebinizin konusu, ilgili iletişim bilgileriniz ve talebi açıklayan yeterli bilgi başvurunun değerlendirilebilmesi için gereklidir.",
          "Başvurular yürürlükteki mevzuat ve talebin niteliği dikkate alınarak değerlendirilir. Güvenlik amacıyla ek doğrulama istenebilir.",
        ],
      },
    ],
  },
  "aydinlatma-metni": {
    slug: "aydinlatma-metni",
    eyebrow: "Kişisel Verilerin İşlenmesi",
    title: "Aydınlatma metni.",
    description: "Nokta Garage iletişim, randevu ve hizmet süreçlerinde işlenebilecek kişisel verilere ilişkin aydınlatma metni.",
    intro: "Bu metin; web sitesi, telefon, WhatsApp ve e-posta üzerinden kurulan iletişim sırasında işlenebilecek kişisel verilere ilişkin bilgi sunar.",
    sections: [
      {
        title: "İşlenebilecek veri grupları",
        bullets: [
          "Ad, soyad ve iletişim bilgileri",
          "Randevu ve hizmet talebine ilişkin bilgiler",
          "Kişinin kendisinin paylaştığı araç, plaka veya rapor bilgileri",
          "Talep, şikâyet ve müşteri iletişimi kayıtları",
          "Barındırma ve güvenlik hizmetlerince oluşabilecek sınırlı teknik kayıtlar",
        ],
      },
      {
        title: "İşleme amaçları",
        bullets: [
          "İletişim ve randevu taleplerini yanıtlamak",
          "Talep edilen ekspertiz hizmetini planlamak ve yürütmek",
          "Rapor doğrulama ve müşteri destek süreçlerini gerçekleştirmek",
          "İşlem güvenliğini sağlamak ve kötüye kullanımı önlemek",
          "Uygulanabilir yasal yükümlülükleri yerine getirmek",
        ],
      },
      {
        title: "Hukuki sebep ve toplama yöntemi",
        paragraphs: [
          "Veriler; kişinin telefon, WhatsApp, e-posta veya web sitesi üzerinden bilgi paylaşmasıyla elektronik ya da sözlü yöntemlerle elde edilebilir.",
          "Kişisel veriler; bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, hukuki yükümlülüklerin yerine getirilmesi ve ilgili kişinin temel haklarına zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri hukuki sebeplerine dayanılarak işlenebilir. Açık rıza gerektiren işlemler ayrıca açık rızaya dayanır.",
        ],
      },
      {
        title: "Aktarım ve saklama",
        paragraphs: [
          "Kişisel veriler; hizmetin yürütülmesi için gerekli olduğu ölçüde barındırma, bilişim, e-posta, telefon ve mesajlaşma hizmeti sağlayıcılarıyla, hizmet tedarikçileriyle ve hukuken yetkili kurumlarla paylaşılabilir.",
          "Veriler, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen saklama süreleri boyunca muhafaza edilir; süre sonunda güvenli biçimde silinir, yok edilir veya anonimleştirilir.",
        ],
      },
      {
        title: "Haklarınız",
        paragraphs: [
          "Kişisel verilerinizle ilgili talepleriniz için KVKK sayfasında yer alan iletişim kanallarını kullanabilirsiniz.",
        ],
      },
    ],
  },
  "gizlilik-politikasi": {
    slug: "gizlilik-politikasi",
    eyebrow: "Web Sitesi Gizliliği",
    title: "Gizlilik politikası.",
    description: "Nokta Garage web sitesinin mevcut iletişim bağlantıları, teknik veri akışı ve üçüncü taraf yönlendirmeleri hakkında genel bilgi.",
    intro: "Bu politika, Nokta Garage web sitesini ziyaret ettiğinizde oluşabilecek temel veri akışını ve kullanılan üçüncü taraf bağlantılarını açıklar.",
    sections: [
      {
        title: "Sitede hangi bilgiler bulunur?",
        paragraphs: [
          "Site; hizmet, paket, kampanya, blog ve işletme iletişim bilgilerini sunar. Sitede genel iletişim formu bulunmaz. Telefon, WhatsApp, e-posta ve yol tarifi bağlantıları ziyaretçiyi ilgili uygulama veya üçüncü taraf hizmete yönlendirir.",
        ],
      },
      {
        title: "Teknik kayıtlar",
        paragraphs: [
          "Site barındırma ve güvenlik altyapısı; hizmetin sunulması, performansın korunması ve kötüye kullanımın önlenmesi için IP adresi, istek zamanı, tarayıcı türü ve benzeri sınırlı teknik kayıtlar oluşturabilir.",
          "Teknik kayıtlar, hizmetin güvenli biçimde sunulması ve yasal yükümlülüklerin yerine getirilmesi için gerekli süre boyunca saklanır.",
        ],
      },
      {
        title: "Üçüncü taraf bağlantıları",
        bullets: [
          "WhatsApp bağlantıları Meta/WhatsApp hizmetine",
          "Yol tarifi bağlantısı Google Maps hizmetine",
          "E-posta ve telefon bağlantıları cihazınızdaki ilgili uygulamaya yönlendirebilir",
        ],
        notice: "Bu hizmetlerin kendi gizlilik koşulları geçerlidir. Bağlantıya tıklamadan önce ilgili hizmetin politikasını inceleyebilirsiniz.",
      },
      {
        title: "Analiz ve reklam araçları",
        paragraphs: [
          "Sitede şu anda Google Analytics, Google Ads, Meta Pixel veya benzeri üçüncü taraf analiz ve reklam araçları kullanılmamaktadır.",
        ],
      },
      {
        title: "İletişim",
        paragraphs: [
          "Gizlilikle ilgili sorularınızı otoekspertiznokta@gmail.com adresine iletebilirsiniz.",
        ],
      },
    ],
  },
};
