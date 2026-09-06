import { primaryBranch, siteSettings } from "./cms";

const siteOrigin = "https://noktagarage.com";

export const localBusinessStructuredData = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${siteOrigin}/#business`,
  name: primaryBranch.name,
  url: siteOrigin,
  logo: `${siteOrigin}/logo-640.webp`,
  telephone: primaryBranch.phone,
  email: primaryBranch.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Atatürk Mahallesi, Yeni Sanayi Sitesi, A/4 Blok, 6. Sokak, No:64",
    postalCode: "39750",
    addressLocality: primaryBranch.district,
    addressRegion: primaryBranch.city,
    addressCountry: "TR",
  },
  openingHours: "Mo-Su 08:00-18:00",
  hasMap: primaryBranch.mapsUrl,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteSettings.primaryPhone,
    contactType: "customer service",
    availableLanguage: "Turkish",
  },
};
