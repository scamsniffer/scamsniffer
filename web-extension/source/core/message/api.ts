import type {ScamResult, PostDetail} from '@scamsniffer/detector';
import {reportScam, Detector} from '@scamsniffer/detector';
import { browser } from "webextension-polyfill-ts";
import { tabInfo } from "../tab";
import urlParser from "url";

const storage = new Map();
const reportKey = 'auto_report';

const cacheCards = new Map();

export async function setTwitterCardAction(info: any) {
  cacheCards.set(info.link, info);
  setTimeout(() => {
    cacheCards.delete(info.link)
  }, 20 * 1000);
}

export async function checkTabIsMismatch(tabId: number, url: string) {
  try {
    const tabData = tabInfo.get(tabId);
    if (!tabData) return null;
    const cardInfo = cacheCards.get(tabData.url);
    if (!cardInfo) return null;
    cacheCards.delete(tabData.url)
    const currentHost = urlParser.parse(url);
    // check host
    if (currentHost.host != cardInfo.domain) {
      return {
        ...cardInfo
      }
    }
  } catch (e) {
    console.log('checkTabIsMismatch', e)
  }
  return null;
} 

async function getValue(key: string) {
  const values = await browser.storage.local.get(key);
  return values[key];
}

async function setValue(key: string, value: string) {
  return await browser.storage.local.set({
    [key]: value
  });
}

let detector: Detector | null = null;

function initDetector() {
  if (detector === null) {
    detector = new Detector({
      onlyBuiltIn: false,
    });
  }
}

export async function enableAutoReport(enabled: boolean) {
  await storage.set(reportKey, enabled ? 1 : 0);
}

export async function isAutoReportEnabled(): Promise<boolean> {
  return true;
}

export async function setDisableFeature(features: string[]): Promise<void> {
  await setValue("disable_feature", features.join(","));
}

export async function setConfig(config: any): Promise<void> {
  await setValue("config", JSON.stringify(config));
}

export async function getConfig(): Promise<any> {
  const configStr = await getValue("config");
  if (configStr) {
    try {
      return JSON.parse(configStr)
    } catch (e) {}
  }
  return {};
}

export async function getDisabledFeatures(): Promise<string[]> {
  const disable_feature = await getValue("disable_feature");
  if (disable_feature) {
    const features = disable_feature.split(",");
    return features
  }
  return [];
}

export async function isFeatureDisabled(feature: string): Promise<boolean> {
  const disable_features = await getDisabledFeatures();
  return disable_features.includes(feature);
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
  console.log('checkUrlInBlacklist', result)
  return result;
}

export async function checkNFT(contract: string, tokenId: string) {
  initDetector();
  const result = await detector?.checkNFTToken(contract, tokenId);
  return result;
}
