export const siteEventNames = [
  "click_phone",
  "click_whatsapp",
  "click_directions",
  "report_verification_submit",
  "package_compare",
  "appointment_intent",
  "franchise_contact",
] as const;

export type SiteEventName = (typeof siteEventNames)[number];

export interface SiteEventDetail {
  name: SiteEventName;
  path: string;
  context?: string;
}

const eventNameSet = new Set<string>(siteEventNames);

export function emitSiteEvent(name: SiteEventName, context?: string) {
  window.dispatchEvent(new CustomEvent<SiteEventDetail>("nokta:site-event", {
    detail: { name, path: window.location.pathname, ...(context ? { context } : {}) },
  }));
}

export function installSiteEventHooks() {
  const emitFromElement = (element: Element | null) => {
    if (!(element instanceof HTMLElement)) return;
    const name = element.dataset.trackEvent;
    if (!name || !eventNameSet.has(name)) return;
    emitSiteEvent(name as SiteEventName, element.dataset.trackContext);
  };

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track-event]:not([data-track-trigger='submit']):not([data-track-trigger='change'])") : null;
    emitFromElement(target);
  });
  document.addEventListener("submit", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track-event][data-track-trigger='submit']") : null;
    emitFromElement(target);
  });
  document.addEventListener("change", (event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track-event][data-track-trigger='change']") : null;
    emitFromElement(target);
  });
}
