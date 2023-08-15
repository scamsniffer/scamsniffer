import {browser} from 'webextension-polyfill-ts';

enum StorageKeys {
  Report = 'auto_report',
  DisableFeatures = 'disable_feature',
  Config = 'config',
  ByPassedOrigin = 'by_passed_origin',
}

const memoryStorage = new Map();

async function getValue(key: StorageKeys) {
  const values = await browser.storage.local.get(key);
  return values[key];
}

async function setValue(key: StorageKeys, value: string) {
  await browser.storage.local.set({
    [key]: value,
  });
}

export async function enableAutoReport(enabled: boolean) {
  await memoryStorage.set(StorageKeys.Report, enabled ? 1 : 0);
}

export async function setDisableFeature(features: string[]): Promise<void> {
  await setValue(StorageKeys.DisableFeatures, features.join(','));
}

export async function getDisabledFeatures(): Promise<string[]> {
  const disableFeature = await getValue(StorageKeys.DisableFeatures);
  if (disableFeature) {
    const features = disableFeature.split(',');
    return features;
  }
  return [];
}

export async function setConfig(config: any): Promise<void> {
  await setValue(StorageKeys.Config, JSON.stringify(config));
}

export async function getConfig(): Promise<any> {
  const configStr = await getValue(StorageKeys.Config);
  if (configStr) {
    try {
      return JSON.parse(configStr);
    } catch {
      // 
    }
  }
  return {};
}

export async function setByPassedOrigin(origins: string[]) {
  await setValue(StorageKeys.ByPassedOrigin, JSON.stringify(origins));
}

export async function getByPassedOrigin(): Promise<string[]> {
  try {
    const localData = await getValue(StorageKeys.ByPassedOrigin);
    return JSON.parse(localData);
  } catch {
    return [];
  }
}
