const report = require("./report.json");

const doc = [
  `In the past week, we found that NFTs worth more than **${report.totalLostValueInETH.toFixed(
    0
  )} Ξ** were scammed from 29 phishing websites, there sites we aleardy report to metamask phising detect https://github.com/MetaMask/eth-phishing-detect/pulls?q=is%3Apr+author%3Alljxx1, more details:`,

  "*****",
  report.topLostCollections
    .map((_, index) => {
      const { twitterUsers } = report;
      const { victim } = report;
      const collection_name = _.name;

      const victims = _.victims
        .map((addr) => {
          const victimSummary = victim.find((c) => c.user === addr);
          if (victimSummary) {
            const collectionSummary = victimSummary.details.find(
              (c) => c.name === collection_name
            );
            const userTwitter = twitterUsers.find(
              (c) => c.address.toLowerCase() === addr.toLowerCase()
            );
            // console.log(userTwitter);
            return {
              address: addr,
              ens_name: victimSummary.ens_name[0],
              tokens: collectionSummary.counts,
              ...(userTwitter ? userTwitter.user : {}),
            };
          }
          // const victimDetails = victim.find((c) => c.user === _);
          // const detail = victimDetails ?
          //   victimDetails.find((c) => c.name === collection_name) : null;
          // const userTwitter = twitterUsers.find(
          //   (c) => c.address.toLowerCase() === _.toLowerCase()
          // );
          //   return {
          //     ...detail,
          //     userTwitter,
          //   };
        })
        .sort((a, b) => (a.screen_name ? -1 : 1));

      console.log(victims);
      return [
        [
          // "### ",
          //   index + 1,
          //   ". ",
          `**${_.name}**`,
          ` x ${_.tokens} worth **`,
          _.lostValue.toFixed(0),
          "Ξ** ",
        ].join(""),
        victims
          .filter((_) => _)
          .slice(0, 5)
          .map((_, index) => {
            console.log(_);
            return [
              " - ",
              `[${_.address}](https://etherscan.io/address/${_.address})`,
              _.ens_name ? `(${_.ens_name}) ` : "",
              _.screen_name
                ? ` [@${_.screen_name}](https://twitter.com/@${_.screen_name})`
                : " ",
              " lost **" + _.tokens + "**",
            ].join("");
          })
          .reduce((all, item) => {
            if (all.join("\n").length + item.length < 3000) {
              all.push(item);
            }
            return all;
          }, [])
          .join("\n"),
      ].join("\n");
    })
    .join("\n\n"),
  "*****",
  `**How to avoid this?**

Check the authorization address every time \`setApprovalForAll\` is signed
Remember your own opensea registry address, if you find that the address is wrong, reject it directly
`,

  `Or install the some plugins developed by us like:

**Twitter Phishing Sniffer**
a plugin based on @realMaskNetwork, it's can help people to find the tweets suspected of scam in time, will be online soon!
[https://github.com/scamsniffer/scamsniffer](https://github.com/scamsniffer/scamsniffer)

**Wallet Firewall**
A firewall built between wallet and dapp, it can help people to observe the requests between dapp and wallet,
on top of that we can add some protection rules like: if we find dapp request \`setApprovalForAll\`, and the domain name of dapp is not in the domain whitelist, remind the user to confirm the risk, etc.
[https://github.com/scamsniffer/Wallet-Firewall](https://github.com/scamsniffer/Wallet-Firewall)
  `,
  "*****",
  "**About us**",
  `The goal of Scam Sniffer is to help users identify potential phishing risks, such as common Twitter phishing and discord phishing, in order to protect users' assets, and at the same time, once we find phishing websites, we will promptly report to MetaMask Anti-Phishing Center, so as to block related websites and phishing addresses in time and minimize Crypto Phishing risk to users


At present, we have already tried to:

**Twitter Phishing Sniffer**
build a plugin on Mask Network to try to help users find Twitter phishing

**Wallet firewall**
Helps people observe the behavior between wallet and DAPP, and build security policies to prevent security risks

In the future we will try to explore if we can better help the group of users to find potential threats through technical means.`,

  `*****
> 
> ![image](https://github.com/scamsniffer/landingpage/blob/main/assets/logo-black-small.png?raw=true)
> 
> Let's fight against evil !
> 
> [Twitter](https://twitter.com/scamsniffer_), [Discord](https://discord.com/invite/q6pJMAbeH7), [GitHub](https://github.com/scamsniffer), [GitCoin](https://gitcoin.co/grants/6049/scam-sniffer), [WebSite](https://scamsniffer.io/?utm_source=mirror-xyz)`,
].join("\n\n");

console.log(doc);
