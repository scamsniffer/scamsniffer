import { DetectorAPI } from "./sdk";

jest.setTimeout(300 * 1000)

describe("DetectorAPI", () => {
  const detectorApi = new  DetectorAPI({
    apiKey: '',
    endpoint: ''
  });

  describe("detectScam", () => {
    test("test performance", async () => {
        const testUrl = 'https://digidaigaku-stake.freemintclaim.com/';
        const result = await detectorApi.detect(testUrl);
        console.log('result', result)
    });
    test("test no-wait", async () => {
      const testUrl = 'https://digidaigaku-stake.freemintclaim.com/?'+ Math.random();
      const result = await detectorApi.detect(testUrl, false, {
        wait: false
      });
      console.log('result', result)
    });
    test("test wait-result", async () => {
      const testUrl = 'https://digidaigaku-stake.freemintclaim.com/?1111';
      const result = await detectorApi.detect(testUrl, false, {
        wait: true
      });
      console.log('result', result)
    });
  })
});