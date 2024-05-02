export interface CreateViewCountDto {
  browser: string;
  os: string;
  userAgent: string;
  screenResolution: string;

  lat: number;
  lng: number;

  legislationId: number;
  delegatedLegisaltionId: number;
  amendmentId: number;
}
