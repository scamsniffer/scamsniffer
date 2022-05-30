import { Detector } from "./detector";
import { TEST_TWEETS } from "./__fixtures__/testTweets";
import { BLACK_LIST } from './__fixtures__/blackList'
import fs from 'fs';

jest.setTimeout(60 * 1000)

describe("Detector", () => {
  const detector = new Detector({});
  describe("detectScam", () => {
    test("test whiteList Tweets", async () => {
        const listScam = []
        for (let index = 0; index < TEST_TWEETS.length; index++) {
            const result = await detector.detectScam(TEST_TWEETS[index]);
            if (result) {
                console.log(TEST_TWEETS[index], result);
                listScam.push(result)
            } else {
            }
        }
        expect(listScam.length).toEqual(0);
    });

    test("test blackList Tweets", async () => {
        const listScam = []
        for (let index = 0; index < BLACK_LIST.length; index++) {
            const result = await detector.detectScam(BLACK_LIST[index]);
            if (result) {
                listScam.push(result)
            } else {
                console.log(BLACK_LIST[index], result);
            }
        }
        // console.log(listScam.length,  BLACK_LIST.length === listScam.length)
        expect(listScam.length).toEqual(BLACK_LIST.length);
    });
  });
});