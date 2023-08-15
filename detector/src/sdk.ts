import fetch from "isomorphic-fetch";

export type DetectorAPIOptions = {
  apiKey: string;
  endpoint: string;
  checkInterval?: number;
};

export type hitDetectionRule = {
  ruleId: string;
  title: string;
}

export type DetectDetailMeta = {
  hitDetectionRule?: hitDetectionRule;
}

export type DetectDetail = {
  actions: string[];
  relatedAddress: string[];
  meta?: DetectDetailMeta;
}

export type DetectResult = {
  link: string;
  isSafe?: boolean;
  lastDetect?: string;
  details?: DetectDetail;
  status?: string;
  estimateFinish?: number;
}

export type Options = {
  desc?: string
  wait?: boolean
}

export class DetectorAPI {
  apiKey: string;
  endpoint: string;
  checkInterval: number;

  constructor({ apiKey, endpoint, checkInterval = 15 } : DetectorAPIOptions) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.checkInterval = checkInterval;
  }

  async detect(link: string, force = false, opts: Options = {
    wait: true
  }) {
    let detectRes: DetectResult | null = null;
    for (let index = 0; index < 30; index++) {
      let waitTime = this.checkInterval * 1000;
      try {
        const forceDetect = index === 0 ? force : false;
        const result = await this._callAPI(link, forceDetect, 10 * 1000, opts);
        if (!opts.wait) {
          detectRes = result;
          break;
        }
        if (result.details) {
          detectRes = result;
          break;
        }
      } catch(e) {
        waitTime = 10 * 1000;
      }
      await new Promise((resolve) => {
        setTimeout(resolve, waitTime);
      })
    }

    return detectRes;
  }

  async _callAPI(url: string, force = false, timeout = 10 * 1000, opts: Options) {
    const callUrl = `${this.endpoint}/api/detect?link=`+ encodeURIComponent(url) 
    + '&force='+ (force ? '1' : '0') 
    + (opts.desc ? '&desc='+ encodeURIComponent(opts.desc) : '');
    const response = await Promise.race([
        fetch(callUrl, {
          headers: {
            'X-API-Key': this.apiKey
          },
        }), 
        new Promise(((_resolve, reject) => {
          setTimeout(() => reject(new Error('request timeout')), timeout)
        })
      ),
    ])
    const result = await (response as any).json();
    return result as DetectResult;
  }
}

