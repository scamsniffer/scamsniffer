const bearToken =
  "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function searchTwitter(keyword) {
  const req = await fetch(
    "https://twitter.com/i/api/2/search/adaptive.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_has_nft_avatar=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&include_ext_sensitive_media_warning=true&include_ext_trusted_friends_metadata=true&send_error_codes=true&simple_quoted_tweet=true&q=" +
      encodeURIComponent(keyword) +
      "&count=20&query_source=typed_query&pc=1&spelling_corrections=1&ext=mediaStats%2ChighlightedLabel%2ChasNftAvatar%2CvoiceInfo%2Cenrichments%2CsuperFollowMetadata%2CunmentionInfo",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
        authorization: bearToken,
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": getCookie("ct0"),
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session",
        "x-twitter-client-language": "zh-cn",
      },
      referrer:
        "https://twitter.com/search?q=" +
        encodeURIComponent(keyword) +
        "&src=typed_query",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );

  const data = await req.json();
  const { globalObjects, timeline } = data;
  // console.log(timeline, globalObjects);
  const users = [];
  const tweets = timeline.instructions[0].addEntries.entries
    .filter((_) => _.content && _.content.item)
    .map((_) => {
      const tweet = globalObjects.tweets[_.content.item.content.tweet.id];
      const user = globalObjects.users[tweet.user_id_str];
      const userDetail = {
        user: user.name,
        screen_name: user.screen_name,
        followers: user.followers_count,
        description: user.description,
      };
      users.push(userDetail);
      const lines = tweet.full_text.split("\n");
      const isName = lines.length === 1;
      const firstLine = lines[0]
      if (
        isName &&
        tweet.full_text.toLowerCase().indexOf("hacker") === -1 &&
        tweet.full_text.toLowerCase().indexOf("sold") === -1 &&
        tweet.full_text.toLowerCase().indexOf("bought") === -1 &&
        tweet.full_text.toLowerCase().indexOf("jamais") === -1 &&
        firstLine.toLowerCase().indexOf(keyword.toLowerCase()) > -1
      )
        return {
          ...userDetail,
          text: tweet.full_text,
        };
    }).filter(_ => _);
  return {
    users,
    tweets,
  };
}

async function lookupTwitter(list) {

    const found = [];
  for (let index = 0; index < list.length; index++) {
    const [address, ens] = list[index];
    let users = [];
    let res = await searchTwitter(address);
    users = res.users;
    if (users.length == 0 && ens) {
      res = await searchTwitter(ens);
      users = res.users;
    }
    if (res.tweets.length)

    found.push({
      address,
      user: users[0],
      tweet: res.tweets[0]
    });
      console.log(
        "searchTwitter",
        address,
        users[0],
        res.tweets.length ? res.tweets[0] : null
      );
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  }

  return found;

  // [
  //   ["0x939cac27d5944bafa6571fe7a3552effa72db1de", "girbal.eth"],
  //   ["0x3c2014b6a53c2931cf1e90622ee2aea491a52d36", null],
  //   ["0x440dc98aae2b8954ea5893021bb84891a066ab39", "0x7cjimmy.eth"],
  //   ["0xf271fca7f2896c43db0251676c5bfc61e6e51042", "petering.eth"],
  //   ["0x3eada2069a429b8566c116c0ed99396cdc788b0c", null],
  //   ["0x1079061d37f7f3fd3295e4aad02ece4a3f20de2d", null],
  //   ["0xd7b5ec8559c6ded6494bca70f7a0a004ee011b30", null],
  //   ["0xe6e885a354c8c173d430e3ac8315fe8399d65181", null],
  //   ["0x47973d9f4c92d69fc170bae4b5f88bab05cf3b78", "kimchiburger.eth"],
  //   ["0x4cd3a35ee7eec89ae168180ea4d0fb6cf8b2c72e", null],
  // ];
}

await lookupTwitter([
  ["0x767e47b65604305b1d81a756a003700c55bfe7d2", undefined],
  ["0x70412fa0515063f3435f008bf89c9d87edf26548", undefined],
  ["0x2970e851db41c76be622f9862d16c3310206451e", undefined],
  ["0x7c00c9f0e7aed440c0c730a9bd9ee4f49de20d5c", "kryptonik.eth"],
  ["0xfd4d633bf8c27bf4ff83e2180592ba764aedd1ba", undefined],
  ["0x7a147c88ba775c566366698a164ae018de9867b6", undefined],
  ["0x5bbce58940e10a953ad691659c84b203167bfd3e", undefined],
  ["0x74d430673640c39e0d1141a5430f40c22d3f1ffe", undefined],
  ["0x8664b714ee145f12f69c7146d99d717ae6c1a1f2", undefined],
  ["0xdad19177128fc63b9de5aac7c9afb08ede8830dd", undefined],
  ["0xf8e4c363c10eee4ad50b1fafb19aba4643c48101", undefined],
  ["0x083cd964bc0397a233acd79c5e25409cdd73be0d", undefined],
  ["0x0e3bcd1efd366092248ac733af93f57fdaba5a12", "wannabewhale.eth"],
  ["0xcca6f823d1d4da10646ff397722dff94e825214f", undefined],
  ["0x6cf266157f268b8a32ee5f0df10a43a944d2fb10", undefined],
  ["0xbe69dde0a051e72e18871be52cf506e419058f11", undefined],
  ["0x98fca56dac18c2b7639642000c4471eb836c2925", "lianli.eth"],
  ["0x48ae3c4e1f933e781bf7bb444e32267fda5eaf4e", "jpgjeff.eth"],
  ["0x7813d37cb9d88a42c9a97b6deee1951eb5c08a21", undefined],
  ["0xccab108a65e134c5f76a7bf349b99374b17de2c7", undefined],
  ["0x63f160ae33cf1b5a9b75c11ca7ea5a7c01a7627e", undefined],
  ["0x3d67b36b0561263cdc46063819498932e74b5684", undefined],
  ["0x49fc3b4cd2c7208b6b7e51e0d231fbdba9a18409", "买我发财哦老板.eth"],
  ["0x912c3afb20b8ac9c2a4f157a817db16a8bef4d6d", "clickpop.eth"],
  ["0xa2c73ccfe236890f1c975827134ccdee39ee4771", undefined],
  ["0xc8cdd1edc7cdd932a17c7fbefe416b29a6b5ae45", undefined],
  ["0x2e5e5064b9302e03c7dbe5f80b434cece61099d4", undefined],
  ["0x4981b305ed3f71f24345af979d9e651d5692e3b6", undefined],
  ["0x00000007d259e6b322766529ac387b53a1584724", undefined],
  ["0xb529c10199aaccb0cc417a53555fdd61ebd285e7", undefined],
  ["0xfb6df3b2cc383abee7070e36a982166e45f71289", undefined],
  ["0x73c1851533ec949fb22df7e672e547e8404650a8", undefined],
  ["0xcaf26f178d777a1a735b3cbb8a306101e06c4907", undefined],
  ["0xd3ed4e39917805550a3fe4bfbc02455fee945e9d", undefined],
  ["0x5fa0c65e6e8f2d1ce5c7ba6e9a2d559031b81967", undefined],
  ["0x6b46f0a41b18cdf803a9f91b3a6df5101629eed8", undefined],
  ["0x8f8008aa1444966e83cb08752697ea7022e88d25", undefined],
  ["0x9218a98c54b31befa734cfd2a469e34f68dad5e0", "michaelrusakov.eth"],
]);
// await searchTwitter("0x47973d9f4c92d69fc170bae4b5f88bab05cf3b78");
