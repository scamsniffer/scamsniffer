const { lookup } = require("./index");

const parseRawData = require("./parsed");


async function test() {
    domain = "boki.gift";
     const data = await new Promise((resolve, reject) => {
      lookup(domain, { timeout: 10 * 1000 }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    })
    console.log("data", data);
    const parsed = parseRawData(data, domain);
    console.log(parsed);
}

// test();


console.log(parseRawData(
  "Domain:\n     discord.gg\n\nDomain Status:\n     Active\r\n     Transfer Prohibited by Registrar\n\nRegistrant:\n     Hammer & Chisel\n\nRegistrar:\n     Gandi SAS (http://www.gandi.net)\n\nRelevant dates:\n     Registered on 26th February 2015 at 22:52:30.894\n     Registry fee due on 26th February each year\n\nRegistration status:\n     Registered until cancelled\n\nName servers:\n     gabe.ns.cloudflare.com\r\n     sima.ns.cloudflare.com\r\n     \n\nWHOIS lookup made on Sat, 11 Jun 2022 at 16:45:47 BST\n\nThis WHOIS information is provided for free by CIDR, operator of\nthe backend registry for domain names ending in GG, JE, and AS.\n\nCopyright (c) and database right Island Networks 1996 - 2022.\n\nYou may not access this WHOIS server or use any data from it except\nas permitted by our Terms and Conditions which are published\nat http://www.channelisles.net/legal/whoisterms\n\nThey include restrictions and prohibitions on\n\n- using or re-using the data for advertising;\n- using or re-using the service for commercial purposes without a licence;\n- repackaging, recompilation, redistribution or reuse;\n- obscuring, removing or hiding any or all of this notice;\n- exceeding query rate or volume limits.\n\nThe data is provided on an 'as-is' basis and may lag behind the\nregister. Access may be withdrawn or restricted at any time. \n\r\n"
, "discord.gg"))