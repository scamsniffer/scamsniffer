import type {ScamResult, PostDetail} from '@scamsniffer/detector';
import {reportScam, Detector} from '@scamsniffer/detector';
import byPassedOriginManager from '../features/phasing-warning/byPassedOriginManager';
import {
  enableAutoReport,
  getConfig,
  getDisabledFeatures,
  setConfig,
  setDisableFeature,
} from '../storage';
import tabInfoManager from '../tab/infoManager';

// twitter card

const cacheCards = new Map();

export async function setTwitterCardAction(info: any) {
  cacheCards.set(info.link, info);
  setTimeout(() => {
    cacheCards.delete(info.link);
  }, 20 * 1000);
}

export async function checkTabIsMismatch(tabId: number, url: string) {
  try {
    const tabData = tabInfoManager.query(tabId);
    if (!tabData) return null;
    const cardInfo = cacheCards.get(tabData.url);
    if (!cardInfo) return null;
    cacheCards.delete(tabData.url);
    const currentHost = new URL(url);
    // check host
    if (currentHost.host !== cardInfo.domain) {
      return {
        ...cardInfo,
      };
    }
  } catch (e) {
    console.log('checkTabIsMismatch', e);
  }
  return null;
}

// Settings

export async function isFeatureDisabled(feature: string): Promise<boolean> {
  const disableFeature = await getDisabledFeatures();
  return disableFeature.includes(feature);
}

export async function isAutoReportEnabled() {
  return true;
}

export {
  getDisabledFeatures,
  setDisableFeature,
  setConfig,
  getConfig,
  enableAutoReport,
};

export function byPassOrigin(origin: string) {
  byPassedOriginManager.add(origin);
}

// detector

let detector: Detector | null = null;

function initDetector() {
  if (detector === null) {
    detector = new Detector({
      onlyBuiltIn: false,
    });
  }
}

export async function sendReportScam(result: ScamResult) {
  return reportScam(result);
}

export async function detectScam(post: PostDetail) {
  initDetector();
  const result = await detector?.detectScam(post);
  return result;
}

export async function checkUrlInBlacklist(link: string) {
  initDetector();
  const result = await detector?.checkUrlInBlacklist(link);
  return result;
}

export async function checkNFT(contract: string, tokenId: string) {
  initDetector();
  const result = await detector?.checkNFTToken(contract, tokenId);
  return result;
}
