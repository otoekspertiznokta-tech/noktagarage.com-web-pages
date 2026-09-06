export interface CampaignWindow {
  active: boolean;
  startsAt: string;
  endsAt: string;
}

export const isCampaignVisible = (campaign: CampaignWindow, now = Date.now()) => {
  const startsAt = Date.parse(`${campaign.startsAt}T00:00:00`);
  const endsAt = Date.parse(`${campaign.endsAt}T23:59:59`);

  return (
    campaign.active &&
    Number.isFinite(startsAt) &&
    Number.isFinite(endsAt) &&
    startsAt <= endsAt &&
    now >= startsAt &&
    now <= endsAt
  );
};
