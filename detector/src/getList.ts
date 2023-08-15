import fetch from 'isomorphic-fetch'
import fs from 'fs'
import type { PostDetail } from "./types";
const TWEETS_API = process.env.TWEETS_API || '';

(async () => {
    let allTweets: PostDetail[] = []
    let pageSize = 50;
    for (let index = 0; index < 100; index++) {
        const offset = pageSize * index;
        const req = await fetch(`${TWEETS_API}=`+ offset)
        const tweets = await req.json()
        const formatted = tweets.map((_: any) => {
            const raw = JSON.parse(_.detail);
            const links =  raw.entities && raw.entities.urls && raw.entities.urls.map((c:any) => c.expanded_url)
            return {
                id: _.tweet_id,
                nickname: raw.author.name,
                userId: raw.author.screen_name,
                content: raw.text,
                links
            } as PostDetail
        }).filter((_: any) => _.links)
        // console.log(formatted)
        // break;
        allTweets = allTweets.concat(formatted)
        console.log(allTweets.length)
    }
    console.log(allTweets.length)
    fs.writeFileSync('./tweets.json', JSON.stringify(allTweets, null, 2))
})();