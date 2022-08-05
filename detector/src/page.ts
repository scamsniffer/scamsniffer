
import fetch from "isomorphic-fetch";
import cheerio from "cheerio";

export async function getPageSimilarity(url: string, url2: string) {
    const [
        page1Req,
        page2Req
    ] = await Promise.all([
      fetch(`https://cors.r2d2.to/?${url}`),
      fetch(`https://cors.r2d2.to/?${url2}`),
    ]);

    const [content1, content2] = await Promise.all([
      page1Req.text(),
      page2Req.text(),
    ]);

    const dom1 = cheerio.load(content1);
    const dom2 = cheerio.load(content2);

    console.log({
      body: dom1("html").text(),
      body2: dom2("html").text(),
    });
}

// "externalUrl": "https://www.safepal.io/",
//     "twitterUsername": "iSafePal",
//     "domainDetail": {
//       "topDomain": "safepal.io",
//       "domainName": "safepal",
//       "subDomainsName": [
//         "www"
//       ],
//       "topLevelDomainsName": [
//         "io"
//       ],
//       "host": "www.safepal.io"
//     },
//     "matchType": "match_by_domain_sim_days:-1:sim:0.92",
//     "post": {
//       "links": [
//         "https://safepalp.com"
//       ]