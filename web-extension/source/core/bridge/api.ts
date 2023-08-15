import type { Request, CheckResponse } from "./types";
import type {ScamResult, PostDetail} from '@scamsniffer/detector';
import {RPC} from '../message/client';

// API
export async function checkRequest(payload: Request) : Promise<CheckResponse> {
  return RPC.checkRequest(payload);
}

export async function sendReportScam(result: ScamResult) {
  return RPC.sendReportScam(result);
}

export async function checkSiteStatus(url: string) {
  return RPC.checkSiteStatus(url);
}

export async function detectScam(post: PostDetail, options?: any) {
  return RPC.detectScam(post);
}

export async function log(...args: any[]) {
}

let approver: any = null;
export async function setHandler(cb: any) {
  approver = cb;
}

export async function sendRequest(action: any) {
  const isBlock = approver ? await approver(action) : false;
  return isBlock;
}