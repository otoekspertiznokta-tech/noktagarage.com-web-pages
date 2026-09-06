import type { SiteContentSnapshot } from "./schema";

export interface ContentRepository {
  getSnapshot(): SiteContentSnapshot;
}

export const createStaticContentRepository = (snapshot: SiteContentSnapshot): ContentRepository => ({
  getSnapshot: () => snapshot,
});
