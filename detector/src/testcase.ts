import { Detector } from "./detector";
import { TEST_TWEETS } from "./__fixtures__/testTweets";
import { BLACK_LIST } from "./__fixtures__/blackList";

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
       console.log("spend", spend, index, 'isWhite', result === null);
     }

     console.log(TEST_TWEETS.length, listScam, listScam);
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
       console.error('shouldBlack', BLACK_LIST[index], result);
     }
     console.log(
       "spend",
       spend,
       index,
       "isBlack",
       result !== null
     );
   }
   console.log(listScam.length, BLACK_LIST.length, listScam);
}


async function test() {
    await testWhite();
    await testBlack();
}

test();