const { lookup } = require("./whois");

const parseRawData = require("./parsed");


async function test() {
    domain = "wtfgoblin.xyz";
     const data = await new Promise((resolve, reject) => {
      lookup(domain, { timeout: 10 * 1000 }, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    })
    const parsed = parseRawData(data, domain);
    console.log(parsed);
}

test();