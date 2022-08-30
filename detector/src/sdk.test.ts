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
  })
});