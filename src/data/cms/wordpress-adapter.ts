import { parseCmsContent, type SiteContentSnapshot } from "./schema";

export const wordpressContentEndpoint = "/wp-json/nokta-garage/v2/content";

/** V2 yanıtı doğrudan public içerik sözleşmesidir; eksik CMS verisi sessizce fallback'e düşmez. */
export const adaptWordPressBundle = (bundle: unknown): SiteContentSnapshot => parseCmsContent(bundle);
