export type PostDetail = {
  id?: string;
  userId?: string | undefined;
  nickname?: string | null;
  content?: string | null;
  links: string[];
  pageDetails?: PageDetail | null;
};

export type PageDetail = {
  title: string;
  metaHeads: any;
  canonicalLink: string | null;
  topSourceDomains: any[];
};

export type CallActionTest = {
  callActionScore: number;
  matchWords: string[];
};

export type ScamResult = {
  slug: string;
  name: string;
  matchType: string;
  externalUrl: string | null;
  twitterUsername: string | null;
  post: PostDetail;
  callActionTest?: CallActionTest | null;
  domainMeta?: any
};

export type Project = {
    slug: string;
    name: string;
    externalUrl: string | null;
    twitterUsername: string | null;
}

export type BlackList = {
    twitter: string[]
    domains: string[]
}

export type Database = {
  ProjectList: Project[]
  BlackList: BlackList
  commonWords: string[]
  callToActionsKeywords: string[]
  genTime: number
};

export type DomainDetail = {
  topDomain: string | null;
  domainName: string | null;
  topLevelDomainsName: string[] | null;
  subDomainsName: string[] | null;
  host: string | null;
};

export type NFTCheckResult = {
  firstTime: string;
  receivers: string[];
};
