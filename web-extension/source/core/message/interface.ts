import type {
  NFTCheckResult,
  PostDetail,
  ScamResult,
} from '@scamsniffer/detector';
import { CheckResponse, Request } from "../bridge/types";

export type API = {
  setTwitterCardAction: (info: any) => void;
  checkTabIsMismatch: (tabId: number, url: string) => null | any;
  isFeatureDisabled: (feature: string) => Promise<boolean>;
  getDisabledFeatures: () => Promise<string[]>;
  setDisableFeature(features: string[]): Promise<void>;
  setConfig(config: any): Promise<void>;
  getConfig(): Promise<any>;
  byPassOrigin(origin: string): void;
  isAutoReportEnabled(): boolean;
  enableAutoReport(enabled: boolean): Promise<void>;
  sendReportScam(result: ScamResult): Promise<void>;
  detectScam(post: PostDetail): Promise<ScamResult | null | undefined>;
  checkUrlInBlacklist(link: string): Promise<boolean | undefined>;
  checkRequest(payload: Request) : Promise<CheckResponse>;
  checkSiteStatus(url: string) : Promise<any>;
  getRemoteConfig() : Promise<any>;
  checkNFT(
    contract: string,
    tokenId: string
  ): Promise<NFTCheckResult | null | undefined>;
};
