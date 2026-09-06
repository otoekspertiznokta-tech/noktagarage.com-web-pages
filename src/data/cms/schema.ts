import type { BlogPost } from "../blog-posts";

export interface SeoFields {
  title: string;
  description: string;
  image?: string;
}

export interface CtaFields {
  label: string;
  href: string;
}

export interface PackageRecord {
  name: string;
  slug: string;
  summary: string;
  description: string;
  price: string;
  previousPrice?: string;
  image?: string;
  services: string[];
  featured: boolean;
  active: boolean;
  order: number;
  cta: CtaFields;
  whatsappMessage: string;
  seo: SeoFields;
}

export type ServiceIconKey =
  | "wrench" | "search" | "car" | "paint" | "scan" | "box" | "gauge"
  | "brake" | "suspension" | "alignment" | "interior" | "light" | "tire" | "airbag";

export interface ServiceRecord {
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  icon: ServiceIconKey;
  image?: string;
  active: boolean;
  order: number;
  seo: SeoFields;
}

export interface CampaignRecord {
  title: string;
  slug: string;
  summary: string;
  detail: string;
  image?: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
  order: number;
  cta: CtaFields;
  whatsappMessage: string;
}

export type GalleryIconKey = "building" | "car" | "gauge" | "scan";

export interface GalleryRecord {
  id: string;
  image?: string;
  alt: string;
  caption?: string;
  placeholderLabel: string;
  icon: GalleryIconKey;
  order: number;
  active: boolean;
}

export interface BranchRecord {
  name: string;
  slug: string;
  city: string;
  district: string;
  address: string;
  shortAddress: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  mapsUrl: string;
  mapEmbedUrl?: string;
  workingHours: string;
  images: string[];
  description: string;
  active: boolean;
  seo: SeoFields;
}

export interface PageContentRecord {
  slug: string;
  title: string;
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    image?: string;
    primaryCta?: CtaFields;
    secondaryCta?: CtaFields;
  };
  sections: Record<string, unknown>;
  quickAccess?: Array<{
    label: string;
    href: string;
    tone: "white" | "gray";
    icon: "package" | "service" | "mobile" | "remote" | "report" | "appointment" | "campaign" | "gallery" | "franchise" | "contact";
    visible: boolean;
    order: number;
  }>;
  visibility: Record<string, boolean>;
  seo: SeoFields;
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface SiteSettingsRecord {
  brandName: string;
  brandDescriptor: string;
  logo: string;
  alternateLogo?: string;
  favicon: string;
  primaryPhone: string;
  phoneHref: string;
  whatsappBaseUrl: string;
  email: string;
  socialLinks: NavigationLink[];
  defaultWhatsappMessage: string;
  footerText: string;
  copyright: string;
  mapsUrl: string;
  googleBusinessUrl: string;
  workingHours: string;
  defaultSeo: SeoFields;
  defaultSocialImage?: string;
  navigation: {
    services: NavigationLink[];
    corporate: NavigationLink[];
    mobile: NavigationLink[];
    legal: NavigationLink[];
  };
}

export interface SiteContentSnapshot {
  packages: PackageRecord[];
  services: ServiceRecord[];
  campaigns: CampaignRecord[];
  blogPosts: BlogPost[];
  gallery: GalleryRecord[];
  branches: BranchRecord[];
  pages: Record<string, PageContentRecord>;
  settings: SiteSettingsRecord;
}
