export interface CampaignWindow {
  startsAt: string;
  endsAt: string;
}

export const isCampaignVisible = (campaign: CampaignWindow, now = Date.now()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const datePart = (type: "year" | "month" | "day") => parts.find((part) => part.type === type)?.value ?? "";
  const today = `${datePart("year")}-${datePart("month")}-${datePart("day")}`;

  return (
    /^\d{4}-\d{2}-\d{2}$/.test(campaign.startsAt) &&
    /^\d{4}-\d{2}-\d{2}$/.test(campaign.endsAt) &&
    campaign.startsAt <= campaign.endsAt &&
    today >= campaign.startsAt &&
    today <= campaign.endsAt
  );
};
