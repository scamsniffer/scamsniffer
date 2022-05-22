// https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en
// https://safebrowsing.google.com/safebrowsing/clientreport/crx-report
const fetch = require('node-fetch')

async function reportScam(
  link = "https://otheraside.com/koda/",
  reasons = ["redirectsFromOutsideProgramOrWebmail", "notVisitedBefore"]
) {
  const req = await fetch(
    "https://safebrowsing.google.com/safebrowsing/clientreport/crx-report",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
        "content-type": "text/plain;charset=UTF-8",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "none",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: JSON.stringify([link, null, null, null, [], reasons]),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  await req.text();
}

function test() {
  // reportScam();
}

module.exports = {
  reportScam,
};