import { existsSync, readFileSync } from "node:fs";
import { createStaticContentRepository } from "./repository";
import { staticSiteContent } from "./static-content";
import { adaptWordPressBundle, type WordPressRestBundle } from "./wordpress-adapter";

const cmsApiUrl = import.meta.env.CMS_API_URL?.trim();
const generatedContentPath = new URL("../../../.cms/content.json", import.meta.url);
const generatedMediaPath = new URL("../../../.cms/media.json", import.meta.url);

const loadBuildTimeContent = () => {
  if (!cmsApiUrl) return staticSiteContent;
  if (!existsSync(generatedContentPath)) {
    throw new Error("CMS_API_URL ayarlı fakat .cms/content.json yok. Önce npm run cms:sync çalıştırılmalı.");
  }

  const bundle = JSON.parse(readFileSync(generatedContentPath, "utf8")) as WordPressRestBundle;
  return adaptWordPressBundle(bundle, staticSiteContent);
};

// Tarayıcı fetch yapmaz. WordPress verisi build öncesinde yerelleştirilir; CMS ayarlı
// değilse yalnız geliştirme ortamında sürümlenmiş onaylı snapshot kullanılır.
export const contentRepository = createStaticContentRepository(loadBuildTimeContent());
export const siteContent = contentRepository.getSnapshot();
export const siteSettings = siteContent.settings;
export const primaryBranch = siteContent.branches.find((branch) => branch.active) ?? siteContent.branches[0];
export const cmsMediaSources: Record<string, string> = cmsApiUrl && existsSync(generatedMediaPath)
  ? JSON.parse(readFileSync(generatedMediaPath, "utf8"))
  : {};

export * from "./schema";
export { adaptWordPressBundle, wordpressContentEndpoint } from "./wordpress-adapter";
