const { getStolenTokensByLinkAddress } = require("./index");
const fs = require("fs");

async function getRemoteDatabase() {
  const req = await fetch(
    "https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json"
  );
  const json = await req.json();
  return json;
}

async function getNewDomains(lastId = 39) {
  const req = await fetch(
    "https://api.scamsniffer.io/domainSummary?sort=-id&needReport=1"
  );
  const allDomains = await req.json();
  const newId = allDomains[0].id;
  return allDomains.filter((_) => _.id > lastId).map((_) => _.host);
}

async function getDetectHistory(host) {
  const req = await fetch(
    "https://api.scamsniffer.io/detectHistory?limit=100&host=" + host
  );
  const list = await req.json();
  return {
    host,
    transferETH: Array.from(
      new Set(
        list
          .map((_) => {
            if (_.linkAddress && _.actions === "transferETH") {
              return _.linkAddress;
            }
          })
          .filter((_) => _)
      )
    ),
    approve: Array.from(
      new Set(
        list
          .map((_) => {
            if (_.linkAddress && _.actions === "setApprovalForAll") {
              return _.linkAddress;
            }
          })
          .filter((_) => _)
      )
    ),
  };
}

async function genReport(lastId = 39) {
  const newDomains = await getNewDomains(lastId);
  const allAttackers = [];
  for (let index = 0; index < newDomains.length; index++) {
    const newDomain = newDomains[index];
    const historyWatch = await getDetectHistory(newDomain);
    if (historyWatch.approve.length) {
      console.log(historyWatch);
      allAttackers.push(historyWatch);
    }
  }
  const allList = Array.from(
    allAttackers.reduce((all, item) => {
      item.approve.forEach((addr) => {
        all.add(addr);
      });
      return all;
    }, new Set())
  );
  console.log("allList", allList);
  const report = await getStolenTokensByLinkAddress(allList);
//   report.allAttackers = allAttackers;
//   const victims = report.victim.map((_) => [_.user, _.ens_name[0]]);
//   console.log(victims);
  fs.writeFileSync("./stolen_tokens.json", JSON.stringify(report, null, 2));
  //   console.log(newDomains);
}

genReport(2);

// console.log(await getIssueTemplate());
