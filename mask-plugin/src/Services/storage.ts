import { KeyValue } from '@masknet/web3-providers'
import { PLUGIN_ID } from '../constants'
import type { ScamResult } from '../detector/'

const storage = KeyValue.createJSON_Storage(PLUGIN_ID)
const reportKey = 'auto_report'
// const API_ENDPOINT = 'https://api.scamsniffer.io/report'
const API_ENDPOINT = 'http://localhost:8081/report'

export async function enableAutoReport(enabled: boolean) {
    await storage.set(reportKey, enabled ? 1 : 0)
}

export async function isAutoReportEnabled(): Promise<boolean> {
    try {
        const state = await storage.get(reportKey)
        if (state === 1) return true
    } catch (error) {}
    return false
}

export async function reportScam(result: ScamResult) {
    await fetch(API_ENDPOINT, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
        },
        body: JSON.stringify(result),
    })
}
