export interface PolicyConfig {
  storageName: string;
  storageUnit: string;
  spaceUsedPercent: number;
  totalSpaceGB: number;
  location: string;
  networkInterface: string;
  retentionLock: boolean;
  sla?: string;
  schedule: {
    type: string; // e.g., "Synthetic full"
    frequency: string; // e.g., "every Day"
    retentionDays: number;
    windowStart: string;
    windowEnd: string;
    description: string;
  };
}

export interface RecommendationRequest {
  description: string;
}

export enum AppState {
  IDLE,
  ANALYZING,
  RECOMMENDING,
  ERROR
}