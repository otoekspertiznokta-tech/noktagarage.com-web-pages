import type {
  BranchRecord, CampaignRecord, GalleryRecord, PackageRecord, PageContentRecord,
  ServiceRecord, SiteContentSnapshot, SiteSettingsRecord,
} from "./schema";
import type { BlogPost } from "../blog-posts";

export interface WordPressRestRecord<TFields> {
  id: number;
  slug: string;
  status: "publish" | "draft" | "private";
  modified_gmt: string;
  acf: TFields;
}

export interface WordPressRestBundle {
  packages?: WordPressRestRecord<PackageRecord>[];
  services?: WordPressRestRecord<ServiceRecord>[];
  campaigns?: WordPressRestRecord<CampaignRecord>[];
  blogPosts?: WordPressRestRecord<BlogPost>[];
  gallery?: WordPressRestRecord<GalleryRecord>[];
  branches?: WordPressRestRecord<BranchRecord>[];
  pages?: WordPressRestRecord<PageContentRecord>[];
  settings?: WordPressRestRecord<SiteSettingsRecord>;
}

export const wordpressContentEndpoint = "/wp-json/nokta-garage/v1/content";

const publishedFields = <T>(records: WordPressRestRecord<T>[] | undefined) =>
  records?.filter((record) => record.status === "publish").map((record) => record.acf);

// Bu saf adaptör yalnızca build aşamasında alınmış WP REST verisini normalize eder.
// Tarayıcıda fetch yapmaz; eksik koleksiyonlarda sürümlenmiş statik içerik korunur.
export const adaptWordPressBundle = (
  bundle: WordPressRestBundle,
  fallback: SiteContentSnapshot,
): SiteContentSnapshot => {
  const pages = publishedFields(bundle.pages);
  return {
    packages: publishedFields(bundle.packages) || fallback.packages,
    services: publishedFields(bundle.services) || fallback.services,
    campaigns: publishedFields(bundle.campaigns) || fallback.campaigns,
    blogPosts: publishedFields(bundle.blogPosts) || fallback.blogPosts,
    gallery: publishedFields(bundle.gallery) || fallback.gallery,
    branches: publishedFields(bundle.branches) || fallback.branches,
    pages: pages ? Object.fromEntries(pages.map((page) => [page.slug, page])) : fallback.pages,
    settings: bundle.settings?.status === "publish" ? bundle.settings.acf : fallback.settings,
  };
};
