import { getPageSimilarity } from "./page";

jest.setTimeout(300 * 1000)

describe("Page", () => {
  describe("getPageSimilarity", () => {
    test("test getPageSimilarity", async () => {
        const result = await getPageSimilarity(
          "https://www.safepal.io/",
          "https://safepalp.com"
        );
    });
  })
});