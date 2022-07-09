import { Detector } from "./detector";
import { TEST_DOMAINS } from "./__fixtures__/testDomains";
import fs from 'fs';

jest.setTimeout(300 * 1000)

describe("Detector", () => {
  const detector = new Detector({});
  describe("detectScam", () => {
    test("test performance", async () => {
      const listScam = [];
      const startTime = Date.now();
      const testCaseDomains = TEST_DOMAINS.slice(0, 20)
      for (let index = 0; index < testCaseDomains.length; index++) {
        const checkStart = Date.now();
        const result = await detector.detectScam({
          links: [`https://${testCaseDomains[index]}`],
        });
        const spendCheck = Date.now() - checkStart;
        // console.log("spendCheck", spendCheck);
      }
      const spend = Date.now() - startTime
      const timePer = spend / testCaseDomains.length;
      console.log('total spend', {
        spend,
        timePer
      })
      // console.log(listScam.length,  BLACK_LIST.length === listScam.length)
      // expect(listScam.length).toEqual(BLACK_LIST.length);
    });
  })
});