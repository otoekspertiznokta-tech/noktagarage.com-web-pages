import { primaryBranch, siteSettings } from "./cms";

const siteOrigin = "https://noktagarage.com";
const hoursMatch = primaryBranch.workingHours.match(/(\d{2}:\d{2})\D+(\d{2}:\d{2})/);

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
    streetAddress: primaryBranch.address,
    addressLocality: primaryBranch.district,
    addressRegion: primaryBranch.city,
    addressCountry: "TR",
  },
  ...(hoursMatch ? { openingHours: `Mo-Su ${hoursMatch[1]}-${hoursMatch[2]}` } : {}),
  hasMap: primaryBranch.mapsUrl,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteSettings.primaryPhone,
    contactType: "customer service",
    availableLanguage: "Turkish",
  },
};
