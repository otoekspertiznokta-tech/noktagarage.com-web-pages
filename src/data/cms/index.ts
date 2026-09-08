import { existsSync, readFileSync } from "node:fs";
import { createStaticContentRepository } from "./repository";
import { staticSiteContent } from "./static-content";
import { adaptWordPressBundle } from "./wordpress-adapter";
import { siteConfig } from "../site-config";

const cmsApiUrl = import.meta.env.CMS_API_URL?.trim();
const generatedContentPath = new URL("../../../.cms/content.json", import.meta.url);
const generatedMediaPath = new URL("../../../.cms/media.json", import.meta.url);

const loadBuildTimeContent = () => {
  if (!cmsApiUrl) return staticSiteContent;
  if (!existsSync(generatedContentPath)) {
    throw new Error("CMS_API_URL ayarlı fakat .cms/content.json yok. Önce npm run cms:sync çalıştırılmalı.");
  }

  return adaptWordPressBundle(JSON.parse(readFileSync(generatedContentPath, "utf8")));
};

// Tarayıcı fetch yapmaz. WordPress verisi build öncesinde yerelleştirilir; CMS ayarlı
// değilse yalnız geliştirme ortamında sürümlenmiş onaylı snapshot kullanılır.
export const contentRepository = createStaticContentRepository(loadBuildTimeContent());
export const siteContent = contentRepository.getSnapshot();
export const primaryBranch = siteContent.branch;
export const siteSettings = {
  ...siteConfig,
  primaryPhone: primaryBranch.phone,
  phoneHref: primaryBranch.phoneHref,
  whatsappBaseUrl: primaryBranch.whatsapp,
  email: primaryBranch.email,
  mapsUrl: primaryBranch.mapsUrl,
  workingHours: primaryBranch.workingHours,
  defaultWhatsappMessage: primaryBranch.defaultWhatsappMessage,
  defaultSocialImage: siteContent.home.heroImage ?? siteConfig.defaultSocialImage,
};
export const cmsMediaSources: Record<string, string> = cmsApiUrl && existsSync(generatedMediaPath)
  ? JSON.parse(readFileSync(generatedMediaPath, "utf8"))
  : {};

export * from "./schema";
export { adaptWordPressBundle, wordpressContentEndpoint } from "./wordpress-adapter";
