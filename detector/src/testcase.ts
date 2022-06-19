// import builtInDatabase from "./database/lite.json";
// import { getTopDomainFromUrl, Detector } from "./detector";
// import { TEST_TWEETS } from "./__fixtures__/testTweets";
// import { BLACK_LIST } from "./__fixtures__/blackList";

// async function testWhite() {
//     const detector = new Detector({});
//      const listScam = [];
//      for (let index = 0; index < TEST_TWEETS.length; index++) {
//         const startTime = Date.now();
//        const result = await detector.detectScam(TEST_TWEETS[index]);
//        const spend = Date.now() - startTime;
//        if (result) {
//          console.error("shouldWhite", TEST_TWEETS[index], result);
//          listScam.push(result);
//        } else {

//        }
//        console.log("spend", spend, index, 'isWhite', result === null);
//      }

//      console.log(TEST_TWEETS.length, listScam.length, listScam);
// }


// async function testBlack() {
//     const detector = new Detector({});
//    const listScam = [];
//    for (let index = 0; index < BLACK_LIST.length; index++) {
//        const startTime = Date.now();
//      const result = await detector.detectScam(BLACK_LIST[index]);
//       const spend = Date.now() - startTime;
//      if (result) {
//        listScam.push(result);
//      } else {
//        console.error('shouldBlack', BLACK_LIST[index], result);
//      }
//      console.log(
//        "spend",
//        spend,
//        index,
//        "isBlack",
//        result !== null
//      );
//    }
//    console.log(listScam.length, BLACK_LIST.length);
// }


// async function testLink() {
//    const detector = new Detector({});
//     console.log(
//       await detector.detectScam({
//         links: ["https://airdrop.murakamiflowers.club/"],
//       }, {
//         // onlyLink: true
//       })
//     );

//    console.log( await detector.detectScam({
//       id: "1522002974624534528",
//       nickname: "Luis Naranjo",
//       userId: "luisnaranjo733",
//       content:
//         "If software supply chain attacks through npm don't scare the shit out of you, you're not paying close enough attention.\n" +
//         "\n" +
//         "@SocketSecurity sounds like an awesome product. I'll be using https://t.co/WjjoAF7Yq3 instead of https://t.co/5v5q2ja2Hc to browse npm packages going forward https://t.co/LM5O6hKRck",
//       links: [
//         "http://socket.dev",
//         "http://npmjs.org",
//         "https://twitter.com/SocketSecurity/status/1521876809339580418",
//       ],
//     }))
// }

// async function test() {
//     await testWhite();
//     await testBlack();
//     // await testLink();
// }

// test();
