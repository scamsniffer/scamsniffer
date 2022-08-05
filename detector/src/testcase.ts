import builtInDatabase from "./database/lite.json";
import { getTopDomainFromUrl, Detector } from "./detector";
import { TEST_TWEETS, TEST_TWEETS_ALL } from "./__fixtures__/testTweets";
import { BLACK_LIST } from "./__fixtures__/blackList";
import fs from 'fs';

async function testWhite() {
  const detector = new Detector({});
  const listScam = [];
  for (let index = 0; index < TEST_TWEETS.length; index++) {
    const startTime = Date.now();
    const result = await detector.detectScam(TEST_TWEETS[index]);
    const spend = Date.now() - startTime;
    if (result) {
      console.error("shouldWhite", TEST_TWEETS[index], result);
      listScam.push(result);
    } else {
    }
    console.log("spend", spend, index, "isWhite", result === null);
  }
  console.log(TEST_TWEETS.length, listScam.length, listScam);
}

async function testAll() {
  const detector = new Detector({});
  const listScam = [];
  for (let index = 0; index < TEST_TWEETS_ALL.length; index++) {
    const startTime = Date.now();
    const result = await detector.detectScam(TEST_TWEETS_ALL[index]);
    const spend = Date.now() - startTime;
    if (result) {
      listScam.push(result);
    } else {}
    console.log("spend", spend, index, "isWhite", result === null);
  }

  console.log(TEST_TWEETS_ALL.length, listScam.length);
  fs.writeFileSync(
    __dirname + "/../test-results/results.json",
    JSON.stringify(listScam, null, 2)
  );
}

async function testBlack() {
  const detector = new Detector({});
  const listScam = [];
  for (let index = 0; index < BLACK_LIST.length; index++) {
    const startTime = Date.now();
    const result = await detector.detectScam(BLACK_LIST[index]);
    const spend = Date.now() - startTime;
    if (result) {
      listScam.push(result);
    } else {
      console.error("shouldBlack", BLACK_LIST[index], result);
    }
    console.log("spend", spend, index, "isBlack", result !== null);
  }
  console.log(listScam.length, BLACK_LIST.length);
}

async function testLink() {
  const detector = new Detector({});
  console.log(
    await detector.detectScam(
      {
        links: ["https://genesislearn.site"],
      },
      {
        // onlyLink: true
      }
    )
  );

    console.log(
      await detector.detectScam(
        {
          links: ["https://ftx.cool/eu/wallet"],
        },
        {
          // onlyLink: true
        }
      )
    );

  //   console.log(
  //     await detector.detectScam(
  //       {
  //         links: ["https://nfttrader.io-0x13d8faf4a690f5aed2c529.in/"],
  //       },
  //       {
  //         // onlyLink: true
  //       }
  //     )
  //   );

  //    console.log(
  //      await detector.detectScam(
  //        {
  //          links: ["https://miladymaker.mintyoursnfts.com/"],
  //        },
  //        {
  //          // onlyLink: true
  //        }
  //      )
  //    );

  //       console.log(
  //         await detector.detectScam(
  //           {
  //             links: ["https://preemint.com/"],
  //           },
  //           {
  //             // onlyLink: true
  //           }
  //         )
  //       );

  //        console.log(
  //          await detector.detectScam(
  //            {
  //              links: ["https://thesaudisnft.premint.id/?=Freemint"],
  //            },
  //            {
  //              // onlyLink: true
  //            }
  //          )
  //        );

  //        console.log(
  //          await detector.detectScam(
  //            {
  //              links: ["https://play-otherside.org/"],
  //            },
  //            {
  //              // onlyLink: true
  //            }
  //          )
  //        );

  //    console.log(
  //      await detector.detectScam({
  //        id: "1542866407628701696",
  //        nickname: "RSS3",
  //        userId: "rss3_",
  //        links: [
  //          "http://bit.ly/3a8Tcye",
  //          "http://bit.ly/3a8Tcye",
  //          "https://t.co/mSQ47Vh7M6",
  //        ],
  //        content:
  //          "🔥  Giveaway open to ALL \n\nPrizes:\n 💰  1500$ RSS3\n 📈  20x Genesis NFT Avatar\n 😎  15x RSS3 Swag Packs\n\nWinners only have to:\n 1️⃣  Like & retweet this tweet\n 2️⃣  Follow  @rss3_ \n 3️⃣  Tag friends below 👇 \n\n 🚨 2x your win chance 🚨 Exclusive details in our Discord:\n http://bit.ly/3a8Tcye 🔥  Giveaway open to ALL \n\nPrizes:\n 💰  1500$ RSS3\n 📈  20x Genesis NFT Avatar\n 😎  15x RSS3 Swag Packs\n\nWinners only have to:\n 1️⃣  Like & retweet this tweet\n 2️⃣  Follow  @rss3_ \n 3️⃣  Tag friends below 👇 \n\n 🚨 2x your win chance 🚨 Exclusive details in our Discord:\n http://bit.ly/3a8Tcye",
  //      })
  //    );

  //     console.log(
  //       await detector.detectScam(
  //         {
  //           links: ["https://goblendawn.wtf/"],
  //           pageDetails: {
  //             title: "goblintown",
  //             metaHeads: {
  //               "og:title": "goblintown",
  //               "og:description":
  //                 "AAAAAAAUUUUUGGGHHHHH gobblins goblinns GOBLINNNNNNNNns wekm ta goblintown yoo sniksnakr DEJEN RATS oooooh rats are yummmz dis a NEFTEEE O GOBBLINGS on da BLOKCHIN wat?",
  //               "og:url": "https://goblintown.wtf/",
  //               "og:image": "https://goblintown.wtf/i/IMG_1017.jpg",
  //               "og:site_name": "goblintown",
  //               "og:locale": "en_US",
  //               "og:type": "article",
  //               "twitter:card": "photo",
  //               "twitter:site": "@godlintownwtf",
  //               "twitter:title": "goblintown",
  //               "twitter:description":
  //                 "AAAAAAAUUUUUGGGHHHHH gobblins goblinns GOBLINNNNNNNNns wekm ta goblintown yoo sniksnakr DEJEN RATS oooooh rats are yummmz dis a NEFTEEE O GOBBLINGS on da BLOKCHIN wat?",
  //               "twitter:image": "https://goblintown.wtf/i/IMG_1017.jpg?2",
  //               "twitter:url": "https://goblintown.wtf/",
  //               "twitter:creator": "@gobllintownwtf",
  //               viewport: "width=device-width, initial-scale=1",
  //             },
  //             canonicalLink: null,
  //             topSourceDomains: [
  //               {
  //                 domain: "goblintown.wtf",
  //                 count: 458,
  //               },
  //               {
  //                 domain: "www.goblintown.wtf",
  //                 count: 5,
  //               },
  //             ],
  //           },
  //         },
  //         {
  //           // onlyLink: true
  //         }
  //       )
  //     );

  //    console.log(
  //      await detector.detectScam({
  //        links: ["https://gossamerseed.world/"],
  //        pageDetails: {
  //          title:
  //            "Gossamer NFT Collection by BRON Hollywood Studio | Gossamer Seed",
  //          metaHeads: {
  //            robots: "index,follow",
  //            description:
  //              "Gossamer is an 8-part animated movie series interwoven with an NFT collection, by BRON; creators of The Joker, House of Gucci, & many more blockbusters.",
  //            "twitter:card": "summary_large_image",
  //            "og:title": "Gossamer NFT Collection by BRON Hollywood Studio",
  //            "og:description":
  //              "Gossamer is an 8-part animated movie series interwoven with an NFT collection, by BRON; creators of The Joker, House of Gucci, & many more blockbusters.",
  //            "og:url": "https://gossamerseed.world",
  //            "og:type": "website",
  //            "og:image": "https://i.imgur.com/hIrMsdF.png",
  //            "og:image:width": "1200",
  //            "og:image:height": "640",
  //            "og:locale": "en_IE",
  //          },
  //          canonicalLink: "https://gossamerseed.world/",
  //          topSourceDomains: [
  //            {
  //              domain: "gossamerseed.world",
  //              count: 4,
  //            },
  //          ],
  //        },
  //      })
  //    );

  console.log(
    await detector.detectScam({
      id: "1545388228663865344",
      nickname: "CIA Officer",
      userId: "officer_cia",
      links: ["http://tranqui.xyz/posts/100-days-of-code"],
      content:
        "So you want to become a smart contract developer? Here is a condensed guide for learning Web3 development in 100 Days  👀 So you want to become a smart contract developer? Here is a condensed guide for learning Web3 development in 100 Days  👀",
    })
  );
}

async function test() {
  await testAll();
  // await testWhite();
  // await testBlack();
}

test();
// testLink();
