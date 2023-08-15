import type { Request, CheckResponse } from "./types";
import type {ScamResult, PostDetail} from '@scamsniffer/detector';
import {reportScam, Detector} from '@scamsniffer/detector';
import fetch from "isomorphic-fetch";

let detector: Detector | null = null;
const checkEndpoint = 'https://check-api.scamsniffer.io/v1/checkRequest';

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