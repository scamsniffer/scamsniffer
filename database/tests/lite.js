// const rawMarkets = require('./merged/markets-raw.json');
// (async () => {
//     const liteMarkets = rawMarkets.map(_ => {
//         return {
//           slug: _.slug,
//           name: _.name,
//         //   symbol: _.symbol,
//           externalUrl: _.links.reduce((state, item) => {
//             if (item.type === "WEBSITE") {
//               state = item.link.replace("?utm_source=dropstab", "");
//             }
//             return state;
//           }, null),
//           twitterUsername: _.links.reduce((state, item) => {
//             if (item.type === "TWITTER") {
//               state = item.link.split('/')[3]
//               if (state) {
//                   state = state.split('?')[0]
//               }
//             }
//             return state;
//           }, null),
//         };
//     })
//     console.log(liteMarkets);
// })();