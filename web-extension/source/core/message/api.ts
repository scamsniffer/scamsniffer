import type {ScamResult, PostDetail} from '@scamsniffer/detector';
import {reportScam, Detector} from '@scamsniffer/detector';
import byPassedOriginManager from '../features/phasing-warning/byPassedOriginManager';
import type { CheckResponse } from "../bridge/types";
import { parseDomain, ParseResultType } from "parse-domain";
import {
  enableAutoReport,
  getConfig,
  getDisabledFeatures,
  setConfig,
  setDisableFeature,
} from '../storage';
import tabInfoManager from '../tab/infoManager';
import urlParser from "url";
import punycode from "punycode";

const checkEndpoint = 'https://check-api.scamsniffer.io/v1/checkRequest';
const configEndpoint = 'https://check-api.scamsniffer.io/v1/getConfig';

// twitter card

const cacheCards = new Map();

export function getTopDomainFromUrl(url: string) {
  let topDomain = null;
  let domainName = null;
  let topLevelDomainsName: string[] = [];
  let subDomainsName: string[] = [];
  let isPunyCode = false;
  const host = urlParser.parse(url).host;
  if (host === null) return null;
  const parseResult = parseDomain(host);
  switch (parseResult.type) {
    case ParseResultType.Listed: {
      const { domain, topLevelDomains, subDomains } = parseResult;
      if (subDomains) subDomainsName = subDomains;
      topDomain = [domain].concat(topLevelDomains).join(".");
      if (domain) domainName = domain;
      if (topLevelDomains) topLevelDomainsName = topLevelDomains;
      break;
    }
    case ParseResultType.Reserved:
    case ParseResultType.NotListed: {
      const { hostname } = parseResult;
      break;
    }
    // default:
    //   throw new Error(`${host} is an ip address or invalid domain`);
  }

  if (domainName) {
    const unicodeName = punycode.toUnicode(domainName);
    isPunyCode = unicodeName != domainName;
    if (isPunyCode) {
      domainName = unicodeName
    }
  }
  return {
    isPunyCode,
    topDomain,
    domainName,
    subDomainsName,
    topLevelDomainsName,
    host,
  };
}

export async function setTwitterCardAction(info: any) {
  cacheCards.set(info.link, info);
  setTimeout(() => {
    cacheCards.delete(info.link);
  }, 20 * 1000);
}

export async function checkTabIsMismatch(tabId: number, url: string) {
  try {
    const tabData = tabInfoManager.queryInital(tabId);
    if (!tabData) return null;
    const cardInfo = cacheCards.get(tabData.url);
    if (!cardInfo) return null;
    cacheCards.delete(tabData.url);
    const domainInfo = getTopDomainFromUrl(url);
    const cardDomainInfo = getTopDomainFromUrl(`https://${cardInfo.domain}`)
    const isMisMacth = domainInfo?.topDomain != cardDomainInfo?.topDomain
    if (isMisMacth) {
      return {
        ...cardInfo,
      };
    }
  } catch (e) {
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

export async function checkSiteStatus(url: string) {
  initDetector();
  const result = await detector?.checkSiteStatus(url);
  return result;
}

export async function checkRequest(payload: Request) : Promise<CheckResponse> {
  const response = await fetch(checkEndpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(c => c.json());

  return response as CheckResponse;
}

export async function getRemoteConfig() {
  const response = await fetch(configEndpoint).then(c => c.json());
  return response as any;
}


