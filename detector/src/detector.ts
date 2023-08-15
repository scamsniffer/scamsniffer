import builtInDatabase from "./database/lite.json";
import metamaskDatabase from "./database/whitelist.json";
import type {
  PostDetail,
  Project,
  DomainDetail,
  ScamResult,
  Database,
  NFTCheckResult,
} from "./types";
import fetch from "isomorphic-fetch";
import { parseDomain, ParseResultType } from "parse-domain";
import urlParser from "url";
import { fixWordsIfHasUnicode, compareTwoStrings } from "./confusables";
import punycode from "punycode";
import { checkDNSProvider } from "./site-status/check";

const TOKEN_ENDPOINT =
  "https://cdn.jsdelivr.net/gh/scamsniffer/explorer-database@main/data/v1";

// const TOKEN_ENDPOINT =
//   "https://raw.githubusercontent.com/scamsniffer/explorer-database/main/data/v1";

const REPORT_ENDPOINT = "https://api.scamsniffer.io/report";
const REPORT_ENDPOINT_DEV = "http://localhost/report";
const remoteDatabase =
  "https://raw.githubusercontent.com/scamsniffer/scamsniffer/main/database/generated/lite.json";
const blackListDatabase =
  "https://raw.githubusercontent.com/scamsniffer/scam-database/main/blacklist/all.json";
const siteStatusDatabase =
  "https://raw.githubusercontent.com/scamsniffer/SiteWatcher/main/database/status.json";
const miniumWordsLength = 5;

export class DataCache {
  fetchDate;
  millisecondsToLive;
  fetchFunction;
  cache: any;
  constructor(fetchFunction: any, minutesToLive = 10) {
    this.millisecondsToLive = minutesToLive * 60 * 1000;
    this.fetchFunction = fetchFunction;
    this.cache = null;
    this.getData = this.getData.bind(this);
    this.resetCache = this.resetCache.bind(this);
    this.isCacheExpired = this.isCacheExpired.bind(this);
    this.fetchDate = new Date(0);
  }
  isCacheExpired() {
    return (
      this.fetchDate.getTime() + this.millisecondsToLive < new Date().getTime()
    );
  }
  getData() {
    if (!this.cache || this.isCacheExpired()) {
      return this.fetchFunction().then((data: any) => {
        this.cache = data;
        this.fetchDate = new Date();
        return data;
      });
    } else {
      // console.log("cache hit");
      return Promise.resolve(this.cache);
    }
  }
  resetCache() {
    this.fetchDate = new Date(0);
  }
}

export function getTopDomainFromUrl(url: string): DomainDetail | null {
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
      const { hostname, domain, topLevelDomains, subDomains } = parseResult;
      // if (url.indexOf("io-0x13d8faf4a690f5aed2c529.in") > -1)
      //   console.log("parseResult", parseResult);
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
      domainName = unicodeName;
    }
    // if (isPunyCode) {
    //   console.log({
    //     isPunyCode,
    //     unicodeName,
    //   })
    // }
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

function getTopDomain(url: string) {
  const host = urlParser.parse(url).host;
  return {
    topDomain: host,
  };
}

function includeName(name: string, projectName: string) {
  name = name.toLowerCase();
  projectName = projectName.toLowerCase();
  return (
    name.length > miniumWordsLength &&
    projectName.length > miniumWordsLength &&
    (name.includes(projectName) || projectName.includes(name))
  );
}

//  _.twitterUsername.length > miniumWordsLength && userId.includes(_.twitterUsername)
function includeNameCheck(findName: string, name: string) {
  findName = findName.toLowerCase();
  name = name.toLowerCase();
  return name.length > miniumWordsLength && findName.includes(name);
}

function compareName(name: string, name2: string) {
  name = name.toLowerCase();
  name2 = name2.toLowerCase();
  // LossLess Labs (Shujin) match Lossless
  const diffLimit = 4;
  const diff = Math.abs(name2.length - name.length);
  return (
    name.length > miniumWordsLength &&
    name2.length > miniumWordsLength &&
    name.includes(name2) &&
    diff < diffLimit
  );
}

// adidas Originals
// adidas Originals Into the Metaverse
function matchNameInWords(nickName: string, projectName: string) {
  const words = nickName.split(" ");
  return (
    words.length > 1 &&
    projectName.toLowerCase().includes(nickName.toLowerCase())
  );
}

function compareUserId(id: string, id2: string) {
  return id.toLowerCase() === id2.toLowerCase();
}

function compareText(keyword: string, fullText: string) {
  return (
    keyword &&
    keyword.length > miniumWordsLength &&
    compareName(fullText, keyword)
  );
}

function verifyProjectMeta(project: any, post: PostDetail) {
  const { twitterUsername, externalUrl } = project;

  const { userId, links, content } = post;
  if (!userId) return true;
  if (!twitterUsername) return true;

  let isSame = compareUserId(twitterUsername, userId);
  // TODO verify links
  // if (isSame) {
  //     const domainDetail = getTopDomain(externalUrl);
  //     if (domainDetail && domainDetail.topDomain) {
  //         const domain = domainDetail.topDomain;
  //         const hasOfficialLinks = links.filter((link) => {
  //             return link.indexOf(domain) > -1;
  //         });
  //         isSame = hasOfficialLinks.length !== 0 && links.length > 0;
  //         console.log("isSame", hasOfficialLinks);
  //     }
  // }
  return isSame;
}

async function computeCallToScore(
  text: string,
  callToActionsKeywords: string[]
) {
  let start = Date.now();
  let result = null;
  result = await fixWordsIfHasUnicode(text, callToActionsKeywords);
  const comparText = result ? result.content : text;
  const txtWords = comparText
    .split("\n")
    .map((_) => _.split(" "))
    .reduce((all, words) => {
      words.forEach((w) =>
        all.add(
          w.toLowerCase().replace(new RegExp(",", "g"), "").split(".").join("")
        )
      );
      return all;
    }, new Set());

  const matchWords: string[] = [];
  const callActionScore = callToActionsKeywords
    .map((keyword) => {
      const isMatch = txtWords.has(keyword.toLowerCase());
      if (isMatch) {
        matchWords.push(keyword.toLowerCase());
      }
      return isMatch ? 2 : 0;
    })
    .reduce((totalScore: number, score) => totalScore + score, 0);
  return {
    txtWords,
    callActionScore,
    matchWords,
  };
}

function getDomain(url: string) {
  const regex = /(?:[\w-]+\.)+[\w-]+/;
  const result = regex.exec(url);
  return result && result[0];
}

async function getDomainMeta(domains: string[]) {
  const req = await fetch(`https://whois.scamsniffer.io/?` + domains[0]);
  const res = await req.json();
  return res;
}

async function _detectScam(
  post: PostDetail,
  database: Database,
  options: any = {}
): Promise<ScamResult | null> {
  const { nickname, content, userId, links, pageDetails } = post;
  const {
    ProjectList: allProjects,
    commonWords,
    BlackList,
    callToActionsKeywords,
  } = database;

  // short links
  let outLinks = links.filter((link) => {
    return (
      !link.includes("twitter.com/") &&
      !link.includes("t.co/") &&
      !link.includes("bit.ly/")
    );
  });

  // links
  if (outLinks.length === 0) {
    console.error("no links");
    return null;
  }

  let matchType = "unknown";

  const flags = {
    checkName: true,
    checkUserId: true,
    checkBySim: true,
    checkContent: false,
    checkPage: true,
    checkSubdomain: true,
  };

  if (userId) {
    const twitterInBlackList = BlackList.twitter.find((id) =>
      id.includes(`${userId}:`)
    );

    if (twitterInBlackList) {
      const [twitter, projectSlug] = twitterInBlackList.split(":");
      const project = allProjects.find((_) => _.slug === projectSlug);
      if (project) {
        return {
          ...project,
          matchType: "twitter_in_black_list",
          post,
        };
      }
    }
  }

  let matchProject = null;
  let callActionScore = 0;
  let callActionTest = null;
  if (content) {
    callActionTest = await computeCallToScore(content, callToActionsKeywords);
    callActionScore = callActionTest.callActionScore;
  }

  const fuzzyTwitterCheck = content && callActionScore != 0;
  const hasContext = content ? true : false;

  let fuzzyCheckResult = null;

  if (fuzzyTwitterCheck) {
    const skipCheck =
      nickname && userId
        ? commonWords.find(
            (word) => nickname.includes(word) || userId.includes(word)
          )
        : false;

    if (skipCheck) {
      return null;
    }

    // check nick name
    if (nickname && flags.checkName) {
      // full match
      matchProject = allProjects.find((_) => _.name === nickname);
      matchType = "name_full_match";

      if (!matchProject && userId) {
        matchProject = allProjects.find(
          (_) =>
            _.twitterUsername && includeNameCheck(userId, _.twitterUsername)
        );
        matchType = "userId_match_twitter";
      }

      if (!matchProject) {
        matchProject = allProjects.find((_) => compareName(nickname, _.name));
        matchType = "nickname_match_name";
      }

      if (!matchProject) {
        // careful
        matchProject = allProjects.find((_) =>
          matchNameInWords(nickname, _.name)
        );
        matchType = "nickname_match_name_words";
      }

      if (matchProject && matchProject.twitterUsername && userId) {
        const verified = verifyProjectMeta(matchProject, post);
        if (!verified) {
          fuzzyCheckResult = {
            matchProject,
            matchType,
            post,
            callActionTest,
          };
        }
      }
    }

    // check userId
    if (userId && flags.checkUserId && !fuzzyCheckResult) {
      const matchProject = allProjects.find(
        (_) => _.twitterUsername && includeName(userId, _.twitterUsername)
      );
      matchType = "userId_match_twitter_name";
      if (matchProject && matchProject.twitterUsername && userId) {
        const verified = verifyProjectMeta(matchProject, post);
        if (!verified) {
          fuzzyCheckResult = {
            matchProject,
            matchType,
            post,
            callActionTest,
          };
        }
      }
    }
  }

  if (flags.checkPage && pageDetails) {
    let metaUrl = pageDetails.canonicalLink;
    if (!metaUrl) {
      const ogUrl = pageDetails.metaHeads["og:url"];
      if (ogUrl) {
        metaUrl = ogUrl;
      }
    }

    if (metaUrl) {
      const siteDomain = getTopDomainFromUrl(links[0]);
      const metaDomain = getTopDomainFromUrl(metaUrl);
      if (
        metaDomain &&
        siteDomain &&
        siteDomain.topDomain !== metaDomain.topDomain
      ) {
        const matchProject = allProjects.find(
          (_) =>
            _.externalUrl &&
            metaDomain.topDomain &&
            _.externalUrl.includes(metaDomain.topDomain)
        );
        if (matchProject) {
          return {
            ...matchProject,
            matchType: "check_page_hit",
            post,
            callActionTest,
          };
        }
      }
    }
  }

  if (flags.checkBySim) {
    const whitelistDomainList = metamaskDatabase.whitelist;
    const uniqueDomains: {
      domainName: string;
      topDomain: string;
      subDomainsName: string[];
    }[] = [];
    outLinks.forEach((link: string) => {
      const domainDetail = getTopDomainFromUrl(link);
      if (domainDetail && domainDetail.domainName && domainDetail.topDomain) {
        const isInWhiteList = whitelistDomainList.find(
          (topDomain) => domainDetail.topDomain === topDomain
        );
        if (
          !uniqueDomains.find((_) => _.topDomain === domainDetail.topDomain) &&
          !isInWhiteList
        )
          uniqueDomains.push({
            domainName: domainDetail.domainName,
            topDomain: domainDetail.topDomain,
            subDomainsName: domainDetail.subDomainsName
              ? domainDetail.subDomainsName
              : [],
          });

        if (isInWhiteList) {
        }
      }
    });

    const projectsWithDomain: { project: Project; domain: DomainDetail }[] = [];
    const scoreLimit = 10;
    const similarProjects = allProjects
      .map((_) => {
        let score = 0;
        let matchItems = [];
        let simLimit = 0.65;

        const projectName = _.name;
        // const projectDomain = _.externalUrl && getDomain(_.externalUrl);
        if (_.domainDetail) {
          // console.log('has index')
        }

        const projectDomainDetail = _.domainDetail
          ? _.domainDetail
          : _.externalUrl && getTopDomainFromUrl(_.externalUrl);

        const compareItems: [string, string, number][] = [];

        if (projectDomainDetail)
          projectsWithDomain.push({
            project: _,
            domain: projectDomainDetail,
          });

        if (nickname) {
          compareItems.push([_.name, nickname, 1]);
        }

        if (_.twitterUsername && userId) {
          compareItems.push([_.twitterUsername, userId, 1]);
        }

        const nameInContent = content && content.split(" ").includes(_.name);
        if (nameInContent) {
          score += 5;
        }

        let hasSimLink = false;
        let isSame = false;

        uniqueDomains.forEach((domain) => {
          if (!isSame) {
            isSame =
              projectDomainDetail &&
              projectDomainDetail.topDomain === domain.topDomain
                ? true
                : false;
          }

          if (projectDomainDetail && projectDomainDetail.domainName) {
            compareItems.push([
              domain.domainName,
              projectDomainDetail.domainName,
              2,
            ]);
            if (projectDomainDetail.topDomain) {
              compareItems.push([
                domain.domainName,
                projectDomainDetail.topDomain,
                2,
              ]);
            }
            if (projectDomainDetail.subDomainsName) {
              if (projectDomainDetail.subDomainsName[0] != "www")
                compareItems.push([
                  domain.domainName,
                  projectDomainDetail.subDomainsName[0],
                  2,
                ]);
            }

            // if (domain.subDomainsName.length) {
            //   const firstSubDomain = domain.subDomainsName[0];
            //   if (firstSubDomain != "www") {
            //     compareItems.push([
            //       firstSubDomain,
            //       projectDomainDetail.domainName,
            //       2,
            //     ]);
            //   }
            // }
          }

          if (projectName)
            compareItems.push([
              domain.domainName,
              projectName.toLowerCase(),
              1,
            ]);
        });

        for (let index = 0; index < compareItems.length; index++) {
          const [string1, string2, type] = compareItems[index];
          const sim =
            (string1 && string2 && compareTwoStrings(string1, string2)) || 0;
          score += sim > simLimit ? 5 : 0;
          if (sim > simLimit && simLimit <= 1)
            matchItems.push({
              item: compareItems[index],
              sim,
            });
          if (type == 2) hasSimLink = true;
        }
        return {
          hasSimLink: isSame ? false : hasSimLink,
          matchItems,
          uniqueDomains,
          project: _,
          score: isSame ? 0 : score,
        };
      })
      .filter((_) => _.score > scoreLimit)
      .sort((a, b) => b.score - a.score);

    if (similarProjects.length && (fuzzyTwitterCheck || options.onlyLink)) {
      matchProject = similarProjects[0].project;
      matchType = "check_by_sim";
      const verified = verifyProjectMeta(matchProject, post);
      if (similarProjects[0].hasSimLink && !verified) {
        fuzzyCheckResult = {
          matchProject,
          matchType,
          post,
          callActionTest,
        };
      }
    }

    const checkDomain = projectsWithDomain.length;

    if (checkDomain) {
      const simThreshold = 0.65;
      const domainRegLimit = options.registerDays || 10;
      const simRegLimit = options.registerDaysSim || 30;
      const simDayLimit = options.simDayLimit || 0.8;

      const domainResult = fuzzyCheckResult
        ? [
            {
              linkDomain: uniqueDomains[0],
              contain: false,
              sim: 0.6,
              projectWithDomain: {
                domain: fuzzyCheckResult.matchProject.domainDetail,
                project: fuzzyCheckResult.matchProject,
              },
            },
          ]
        : uniqueDomains.map((linkDomain) => {
            const domainInProjectList = projectsWithDomain.find(
              (_) => _.domain.topDomain === linkDomain.topDomain
            );

            const highSimilarProjects = domainInProjectList
              ? []
              : projectsWithDomain
                  .map((projectWithDomain) => {
                    const subDomains = projectWithDomain.domain.subDomainsName;
                    let aString = projectWithDomain.domain.domainName;
                    const bString = linkDomain.domainName;
                    const simSizeThreshold = 4;

                    let sim = 0;
                    let contain = false;

                    function checkMatchItems(aString: string, bString: string) {
                      if (aString) {
                        let canDoSimTest =
                          bString.length > simSizeThreshold &&
                          aString.length > simSizeThreshold;
                        contain = canDoSimTest && bString.includes(aString);
                        sim = canDoSimTest
                          ? compareTwoStrings(aString, bString)
                          : 0;
                      }
                      // if (projectWithDomain.project.slug === "otherdeed") {
                      //   console.log("project", [aString, bString, sim, contain]);
                      // }
                    }

                    if (aString) {
                      checkMatchItems(aString, bString);
                    }

                    // subdomain-case  eg. murakamiflowers.kaikaikiki.com
                    if (sim < simThreshold && subDomains && subDomains.length) {
                      // if (projectWithDomain.project.slug === "premint") {
                      //   console.log("compare subdomain", sim, simThreshold);
                      // }
                      let aString = subDomains[0];
                      let projectName = projectWithDomain.project.name.replace(
                        new RegExp(".", ""),
                        ""
                      );
                      let subdomainInName = projectName
                        .toLowerCase()
                        .includes(aString);

                      if (aString != "www" && subdomainInName) {
                        checkMatchItems(aString, bString);
                      }
                    }

                    // subdomain case  eg. nfttrader.io-0x13d8faf4a690f5aed2c529.in match nfttrader.io
                    const projectDomainName =
                      projectWithDomain.domain.domainName;
                    if (
                      sim < simThreshold &&
                      linkDomain.subDomainsName.length
                    ) {
                      let linkSub = linkDomain.subDomainsName[0];
                      if (linkSub != "www" && projectDomainName) {
                        checkMatchItems(projectDomainName, linkSub);
                      }
                    }

                    return {
                      contain,
                      projectWithDomain,
                      sim,
                    };
                  })
                  .sort((a, b) => b.sim - a.sim)
                  .filter((_) => _.sim > simThreshold || _.contain);

            return highSimilarProjects[0]
              ? {
                  linkDomain,
                  contain: highSimilarProjects[0].contain,
                  sim: highSimilarProjects[0].sim,
                  projectWithDomain: highSimilarProjects[0].projectWithDomain,
                }
              : null;
          });

      let similarProject = null;
      let creationDaysOfDomain = -1;
      let domainMeta = null;
      for (let index = 0; index < domainResult.length; index++) {
        const domainSim = domainResult[index];
        if (!domainSim) continue;
        if (!domainSim.linkDomain) continue;
        // full match xxx.com xxx.io
        const isFullyMatch = domainSim.sim === 1;
        // contain match cc-xxx.com xxx.io
        const simAndMatch = domainSim.contain && domainSim.sim > 0.7;
        const isCommonWords = commonWords.includes(
          domainSim.linkDomain.domainName
        );
        if (isFullyMatch || simAndMatch) {
          if (hasContext) {
            // in twitter context
            if (fuzzyTwitterCheck) similarProject = domainSim;
          } else {
            similarProject = domainSim;
          }
          if (!isCommonWords) {
            continue;
          }
        }
        try {
          domainMeta = options.skipDomainMeta
            ? null
            : await getDomainMeta([domainSim.linkDomain.topDomain]);
          if (!domainMeta) continue;
          const domainDetail = domainMeta.data;
          if (!domainDetail) {
            continue;
          }

          const createDate =
            domainDetail.creationDate || domainDetail.updatedDate;
          creationDaysOfDomain = createDate
            ? Math.floor(
                (Date.now() - new Date(createDate).getTime()) / 1000 / 86400
              )
            : -1;
          const isRecentRegister =
            creationDaysOfDomain != -1 &&
            creationDaysOfDomain <
              (domainSim.sim > simDayLimit ? simRegLimit : domainRegLimit);
          if (isRecentRegister) {
            similarProject = domainSim;
            if (hasContext && !fuzzyTwitterCheck) similarProject = null;
            break;
          } else {
            // console.log("not recent", domainMeta);
          }
        } catch (er) {
          console.error("check failed", er);
        }
      }

      if (similarProject) {
        const matchProject = similarProject.projectWithDomain.project;
        const matchType =
          "match_by_domain_sim_days:" +
          creationDaysOfDomain +
          ":sim:" +
          similarProject.sim.toFixed(2);
        return {
          ...matchProject,
          matchType,
          post,
          callActionTest,
          domainMeta: domainMeta ? domainMeta.data : null,
        };
      }
    }
  }

  return null;
}

async function fetchScamDatabase() {
  const req = await fetch(blackListDatabase);
  return await req.json();
}

// 5 minutes ttl
const fetchScamDatabaseWithCache = new DataCache(fetchScamDatabase, 3);

async function checkIsInBlacklist(type: string, value: string) {
  let isHit = false;
  try {
    const database = await fetchScamDatabaseWithCache.getData();
    isHit = database[type].includes(value);
  } catch (e) {}
  return isHit;
}

async function fetchSiteStatusDatabase() {
  const req = await fetch(siteStatusDatabase);
  return await req.json();
}

// 5 minutes ttl
const fetchSiteStatusDatabaseWithCache = new DataCache(
  fetchSiteStatusDatabase,
  3
);

async function checkSiteStatus(host: string) {
  try {
    const database = await fetchSiteStatusDatabaseWithCache.getData();
    const dnsResult = await checkDNSProvider(host, database);
    return {
      dns: dnsResult,
    };
  } catch (e) {}
  return null;
}

export class Detector {
  onlyBuiltIn: boolean;
  database: Database;
  lastFetch: number | null;
  databaseUrl: string;
  fetching: boolean;

  constructor({ onlyBuiltIn = true, databaseUrl = null }) {
    this.onlyBuiltIn = onlyBuiltIn;
    this.database = builtInDatabase;
    this.databaseUrl = databaseUrl || remoteDatabase;
    this.lastFetch = null;
    this.fetching = false;
    this.buildIndex();
  }

  async buildIndex() {
    const { ProjectList: allProjects } = this.database;
    for (let index = 0; index < allProjects.length; index++) {
      const allProject = allProjects[index];
      if (allProject.domainDetail) {
        continue;
      }
      const domainDetail =
        allProject.externalUrl && getTopDomainFromUrl(allProject.externalUrl);
      if (domainDetail) {
        allProject.domainDetail = domainDetail;
      }
    }
  }

  async update() {
    if (this.fetching) return;
    if (this.lastFetch) {
      const timeLeft = Date.now() - this.lastFetch;
      if (timeLeft < 1000 * 60 * 5) {
        return;
      }
    }

    this.fetching = true;
    try {
      const req = await fetch(this.databaseUrl);
      const remoteData = await req.json();
      this.database = remoteData;
      await this.buildIndex();
    } catch (e) {
      console.error("fetch from remote failed", e);
    }

    this.fetching = false;
    this.lastFetch = Date.now();
  }

  async detectScam(
    post: PostDetail,
    options: any = {}
  ): Promise<ScamResult | null> {
    try {
      if (!this.onlyBuiltIn) this.update();
      return await _detectScam(post, this.database, options);
    } catch (e) {
      console.error("error", e);
    }
    return null;
  }

  async checkUrlInBlacklist(url: string): Promise<Boolean> {
    const domain = getTopDomainFromUrl(url);
    if (!domain || domain === null) return false;
    if (domain.host === null) return false;
    return await checkIsInBlacklist("domains", domain.host);
  }

  async checkSiteStatus(url: string): Promise<any> {
    const domain = getTopDomainFromUrl(url);
    if (!domain || domain === null) return null;
    if (domain.host === null) return null;
    return await checkSiteStatus(domain.host);
  }

  async checkNFTToken(
    contract: string,
    tokenId: string
  ): Promise<NFTCheckResult | null> {
    let result = null;
    try {
      const dataPath = `${TOKEN_ENDPOINT}/collections/${contract}/${tokenId}.json`;
      const req = await fetch(dataPath);
      const response = (await req.json()) as any;
      const { chain_activity } = response;
      result = {
        firstTime: chain_activity.firstTime as string,
        receivers: chain_activity.receivers as string[],
      };
    } catch (e) {}
    return result;
  }
}

export const detector = new Detector({});

export async function detectScam(
  post: PostDetail,
  options: any = {}
): Promise<ScamResult | null> {
  return detector.detectScam(post, options);
}

export async function detectScamByUrl(
  url: string,
  options: any = {}
): Promise<ScamResult | null> {
  return detector.detectScam(
    {
      links: [url],
    },
    options
  );
}

const REPORT_CACHE: string[] = [];
const CACHE_SIZE = 100;

export async function reportScam(result: ScamResult) {
  const API_ENDPOINT =
    typeof process !== "undefined" && process.env.DEV
      ? REPORT_ENDPOINT_DEV
      : REPORT_ENDPOINT;
  const postId = result.post.id;
  if (REPORT_CACHE.length > CACHE_SIZE) {
    REPORT_CACHE.shift();
  }
  if (postId && REPORT_CACHE.includes(postId)) {
    return;
  }
  try {
    await fetch(API_ENDPOINT, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify(result),
    });
  } catch (error) {}
  if (postId) REPORT_CACHE.push(postId);
}
