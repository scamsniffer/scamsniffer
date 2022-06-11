async function getRemoteDatabase() {
  const req = await fetch(
    "https://raw.githubusercontent.com/MetaMask/eth-phishing-detect/master/src/config.json"
  );
  const json = await req.json()
  return json
}

async function getNewDomains(lastId = 27) {
  const req = await fetch("https://api.scamsniffer.io/domainSummary?sort=-id");
  const allDomains = await req.json();
  const newId = allDomains[0].id
  console.log("last", newId);
  localStorage.setItem('last_id', newId)
  return allDomains.filter((_) => _.id > lastId).map((_) => _.host);
}

async function getScamList(hosts = []) {
  const req = await fetch(
    "https://api.scamsniffer.io/scamList?limit=100&host=" + hosts.join(",")
  );
  const list = await req.json();
  return list.reduce((all, _) => {
    // if (_.projectUrl != "https://rtfkt.com")
    if (_.project != "RTFKT - CloneX Mintvial")
      all[_.topDomain] = {
        link: _.link,
        tweet: _.tweet,
        matchType: _.matchType,
        projectUrl: _.projectUrl,
        projectName: _.project,
      };
    return all;
  }, {});
}

async function getIssueTemplate(lastId = 41) {
  if (!lastId) {
    lastId = localStorage.getItem("last_id");
  }
  const newDomains = await getNewDomains(lastId);
  const domains = await getScamList(newDomains);
  const remoteData = await getRemoteDatabase();
  const { blacklist } = remoteData;

 
  const notInBlackList = Object.keys(domains).filter(
    (_) => blacklist.indexOf(_) === -1
  );
  const report = JSON.stringify(notInBlackList, null, 2);

  return [
    "# [Scam Sniffer] add " + notInBlackList.slice(0, 5) + "...",
    "## Phishing Report",
    "```json\n" + report + "\n```",
    notInBlackList
      .map((domain) => {
        const meta = domains[domain];
        return [
          `### ${meta.projectName}`,
          "- phishing link: [" + meta.link + "](" + meta.link + ")",
          "- phishing domain: `" + domain + "`",
          meta.projectUrl
            ? "- official site: [" +
              meta.projectUrl +
              "](" +
              meta.projectUrl +
              ")"
            : null,
          "- phishing tweet: https://twitter.com/adidasoriginals/status/" +
            meta.tweet.replace("retweet", ""),
        ]
          .filter((_) => _)
          .join("\n");
      })
      .join("\n\n"),
    "> ",
    `*****
> Report from the [Scam Sniffer](https://scamsniffer.io/?utm_source=pr-footer). 
> 
> ![image](https://github.com/scamsniffer/landingpage/blob/main/assets/logo-black-small.png?raw=true)`,
  ].join("\n\n");
}


console.log(await getIssueTemplate(70));