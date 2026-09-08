import { z } from "zod";

const requiredText = (label: string) => z.string().trim().min(1, `${label} boş bırakılamaz.`);
const slug = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Geçersiz slug biçimi.");
const order = z.number().int().nonnegative();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih YYYY-AA-GG biçiminde olmalı.").refine((value) => {
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}, "Geçersiz takvim tarihi.");
const absoluteUrl = z.url("Geçerli bir URL girilmeli.");
const mediaUrl = z.string().refine((value) => value.startsWith("/") || URL.canParse(value), "Geçersiz görsel adresi.");
const linkUrl = z.string().refine(
  (value) => /^\/(?!\/)/.test(value) || /^(https:|tel:|mailto:)/.test(value),
  "Bağlantı / ile başlamalı veya https, tel ya da mailto adresi olmalı.",
);

export const serviceIconKeys = [
  "wrench", "search", "car", "paint", "scan", "box", "gauge", "brake",
  "suspension", "alignment", "interior", "light", "tire", "airbag",
] as const;

const packageSchema = z.strictObject({
  slug, name: requiredText("Paket adı"), price: requiredText("Paket fiyatı"),
  serviceSlugs: z.array(slug).min(1, "Pakete en az bir hizmet bağlanmalı."), order,
});

const serviceSchema = z.strictObject({
  slug, name: requiredText("Hizmet adı"), category: requiredText("Hizmet kategorisi"),
  description: requiredText("Hizmet açıklaması"), icon: z.enum(serviceIconKeys), order,
});

const campaignSchema = z.strictObject({
  slug, title: requiredText("Kampanya başlığı"), summary: requiredText("Kampanya özeti"),
  contentHtml: requiredText("Kampanya içeriği"), contentText: requiredText("Kampanya içeriği"),
  image: mediaUrl.nullable(), startsAt: date, endsAt: date, order,
  detailCta: z.strictObject({ label: requiredText("Aksiyon yazısı"), href: linkUrl }).nullable(),
  whatsappMessage: z.string().trim().nullable(),
}).superRefine((campaign, context) => {
  if (campaign.startsAt > campaign.endsAt) {
    context.addIssue({ code: "custom", path: ["endsAt"], message: "Kampanya bitiş tarihi başlangıçtan önce olamaz." });
  }
});

const gallerySchema = z.strictObject({
  id: slug, image: mediaUrl.nullable(), alt: requiredText("Galeri alternatif metni"),
  caption: z.string().trim().nullable(), order,
});

const blogCategorySchema = z.enum([
  "Araç Alım Rehberi", "Ekspertiz Bilgileri", "Bakım ve Teknik Bilgiler", "Nokta Garage'dan",
]);
const blogSectionSchema = z.strictObject({
  heading: requiredText("Blog bölüm başlığı"), paragraphs: z.array(requiredText("Blog paragrafı")),
  bullets: z.array(requiredText("Blog liste maddesi")).optional(),
});
const blogPostSchema = z.strictObject({
  slug, title: requiredText("Blog başlığı"), summary: requiredText("Blog özeti"), category: blogCategorySchema,
  publishedAt: date, displayDate: requiredText("Blog tarihi"), coverImage: mediaUrl,
  coverAlt: requiredText("Blog görsel alt metni"), seoTitle: requiredText("SEO başlığı"),
  seoDescription: requiredText("SEO açıklaması"), intro: requiredText("Blog giriş metni"),
  sections: z.array(blogSectionSchema), contentHtml: z.string().optional(),
});

const branchSchema = z.strictObject({
  name: requiredText("İşletme adı"), city: requiredText("İl"), district: requiredText("İlçe"),
  address: requiredText("Adres"), shortAddress: requiredText("Kısa adres"), phone: requiredText("Telefon"),
  phoneHref: z.string().regex(/^tel:\+?\d+$/, "Geçersiz telefon bağlantısı."),
  whatsapp: absoluteUrl, email: z.email("Geçersiz e-posta adresi."), mapsUrl: absoluteUrl,
  workingHours: requiredText("Çalışma saatleri"), defaultWhatsappMessage: requiredText("WhatsApp hazır mesajı"),
});

const homeSchema = z.strictObject({ heroImage: mediaUrl.nullable() });

const uniqueBy = <T>(items: T[], key: (item: T) => string, label: string, context: z.RefinementCtx) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    const value = key(item);
    if (seen.has(value)) context.addIssue({ code: "custom", path: [index, "slug"], message: `Mükerrer ${label}: ${value}` });
    seen.add(value);
  });
};

export const cmsContentSchema = z.strictObject({
  packages: z.array(packageSchema).min(1, "En az bir paket yayınlanmalı."),
  services: z.array(serviceSchema).min(1, "En az bir hizmet yayınlanmalı."), campaigns: z.array(campaignSchema),
  gallery: z.array(gallerySchema), blogPosts: z.array(blogPostSchema), branch: branchSchema, home: homeSchema,
}).superRefine((content, context) => {
  uniqueBy(content.packages, (item) => item.slug, "paket slug'ı", context);
  uniqueBy(content.services, (item) => item.slug, "hizmet slug'ı", context);
  uniqueBy(content.campaigns, (item) => item.slug, "kampanya slug'ı", context);
  uniqueBy(content.blogPosts, (item) => item.slug, "blog slug'ı", context);
  uniqueBy(content.gallery, (item) => item.id, "galeri kimliği", context);
  const services = new Set(content.services.map((service) => service.slug));
  content.packages.forEach((item, packageIndex) => item.serviceSlugs.forEach((serviceSlug, serviceIndex) => {
    if (!services.has(serviceSlug)) context.addIssue({
      code: "custom", path: ["packages", packageIndex, "serviceSlugs", serviceIndex],
      message: `Paketin hizmet referansı bulunamadı: ${serviceSlug}`,
    });
  }));
});

export type ServiceIconKey = (typeof serviceIconKeys)[number];
export type PackageRecord = z.infer<typeof packageSchema>;
export type ServiceRecord = z.infer<typeof serviceSchema>;
export type CampaignRecord = z.infer<typeof campaignSchema>;
export type GalleryRecord = z.infer<typeof gallerySchema>;
export type BranchRecord = z.infer<typeof branchSchema>;
export type SiteContentSnapshot = z.infer<typeof cmsContentSchema>;

export const parseCmsContent = (input: unknown): SiteContentSnapshot => {
  const result = cmsContentSchema.safeParse(input);
  if (result.success) return result.data;
  const details = result.error.issues.map((issue) => `${issue.path.join(".") || "içerik"}: ${issue.message}`).join("\n");
  throw new Error(`CMS içerik sözleşmesi geçersiz:\n${details}`);
};
