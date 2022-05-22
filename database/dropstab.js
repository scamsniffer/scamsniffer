
async function loadList(page = 0) {
    const req = await fetch("https://api.icodrops.com/portfolio/api/markets", {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
        "content-type": "application/json",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
      },
      referrer: "https://dropstab.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify({
        sort: "rank",
        fields: [
          "currencyId",
          "rank",
          "name",
          "symbol",
          "image",
          "slug",
          "price",
          "change",
          "links",
          "marketCap",
          "category",
          "volume",
        ],
        filters: {
          eligibleForTop: true,
          trading: true,
        },
        order: "ASC",
        page: page,
        size: 100,
      }),
      method: "POST",
      mode: "cors",
      credentials: "omit",
    });
    return await req.json();
}

// async function fetchDetail(slug) {
//     const api = `https://api.icodrops.com/portfolio/api/markets/coin?slug=${slug}`;
//     const req = await fetch(api);
//     const raw = await req.json();
//     return {
//       name: raw.name,
//       symbol: raw.symbol,
//       links: raw.links,
//       category: raw.category,
//       fdvMarketCap: raw.fdvMarketCap,
//     };
// }

(async () => {
    const maxPage = 15;
    allMarkets = []
    for (let index = 0; index < maxPage; index++) {
        const list = await loadList(index)
        for (let index = 0; index < list.markets.content.length; index++) {
          const market = list.markets.content[index];
          allMarkets.push({
            slug: market.slug,
            name: market.name,
            category: market.category,
            links: market.links,
            symbol: market.symbol,
            marketCap: market.marketCap.USD,
          });
        }
    }
    const liteMarkets = allMarkets.map((_) => {
      return {
        slug: _.slug,
        name: _.name,
        //   symbol: _.symbol,
        externalUrl: _.links.reduce((state, item) => {
          if (item.type === "WEBSITE") {
            state = item.link.replace("?utm_source=dropstab", "");
          }
          return state;
        }, null),
        twitterUsername: _.links.reduce((state, item) => {
          if (item.type === "TWITTER") {
            state = item.link.split("/")[3];
            if (state) {
              state = state.split("?")[0];
            }
          }
          return state;
        }, null),
      };
    });
    console.log("liteMarkets", liteMarkets);
})();