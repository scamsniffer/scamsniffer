import { EventBasedChannel } from 'async-call-rpc'
import type { ScamResult, PostDetail } from '@scamsniffer/detector';

export type ETHCall = {
    method: string;
    params: any[];
}

export type Request = {
    chainId?: number;
    url?: string;
    origin?: string;
    detail: ETHCall
}

export type RiskIssue = {
    order?: number,
    status: number,
    name: string,
    type: string,
    address?: string | null,
    shareText?: string,
    message?: string | null,
    richMessage?: string;
    descriptionLink?: string;
}

export enum Directon {
    In = 'in',
    Out = 'out'
}

export type BalanceChange = {
    token: string;
    type: string;
    address: string;
    tokenId?: string;
    amount: string;
    direction: Directon;
    isSigner: boolean;
    decimals?: number;
    name?: string;
    image?: string;
    price?: string;
    valueInUSD?: string;
    detail?: string;
}

export type CheckResponse = {
    issues: RiskIssue[];
    balanceChange: BalanceChange[];
}

export interface BridgeAPI {
    checkRequest(payload: Request): Promise<CheckResponse>;
    sendReportScam(result: ScamResult): Promise<void>;
    checkSiteStatus(url: string) : Promise<any>;
    detectScam(post: PostDetail, options?: any) : Promise<ScamResult | null>;
    log(...args: any[]) : Promise<void>;
    sendRequest(action: any) : Promise<boolean>;
}

const EVENT_UserScript = '@scamsniffer/sdk-raw/us'
const EVENT_ContentScript = '@scamsniffer/sdk-raw/cs'

export function createScamSnifferSDKChannel(side: 'user' | 'content'): EventBasedChannel {
    const thisSide = side === 'content' ? EVENT_ContentScript : EVENT_UserScript
    const otherSide = side === 'content' ? EVENT_UserScript : EVENT_ContentScript
    return {
        on(callback: any) {
            const f = (e: Event) => {
                if (e instanceof CustomEvent) callback(e.detail)
            }
            document.addEventListener(thisSide, f)
            return () => document.removeEventListener(thisSide, f)
        },
        send(data: any) {
            document.dispatchEvent(new CustomEvent(otherSide, { detail: data }))
        },
    }
}