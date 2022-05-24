import builtInDatabase from './database/lite.json'
import type { PostDetail, ScamResult, Database } from './types'
import fetch from 'isomorphic-fetch'

const REPORT_ENDPOINT = 'https://api.scamsniffer.io/report'
const REPORT_ENDPOINT_DEV = 'http://localhost/report'
const remoteDatabase = 'https://raw.githubusercontent.com/scamsniffer/scamsniffer/main/database/generated/lite.json'
const miniumWordsLength = 4 

function includeName(name: string, projectName: string) {
    name = name.toLowerCase()
    projectName = projectName.toLowerCase()
    return name.length > miniumWordsLength && projectName.length > miniumWordsLength && (name.includes(projectName) || projectName.includes(name))
}

//  _.twitterUsername.length > miniumWordsLength && userId.includes(_.twitterUsername)
function includeNameCheck(findName: string, name: string) {
    findName = findName.toLowerCase()
    name = name.toLowerCase()
    return name.length > miniumWordsLength && (findName.includes(name))
}


function compareName(name: string, name2: string) {
    name = name.toLowerCase()
    name2 = name2.toLowerCase()
    return name.length > miniumWordsLength && name2.length > miniumWordsLength && name.includes(name2)
}

// adidas Originals
// adidas Originals Into the Metaverse
function matchNameInWords(nickName: string, projectName: string) {
    const words = nickName.split(' ')
    return words.length > 1 && projectName.toLowerCase().includes(nickName.toLowerCase())
}

function compareUserId(id: string, id2: string) {
    return id.toLowerCase() === id2.toLowerCase()
}

function compareText(keyword:string, fullText: string) {
    return keyword && keyword.length > miniumWordsLength && compareName(fullText, keyword)
}

function verifyProjectMeta(project: any, post: PostDetail) {
    const {
        twitterUsername,
        externalUrl
    } = project

    const { userId, links,  content } = post
    if (!userId) return true
    if (!twitterUsername) return true

   
    let isSame = compareUserId(twitterUsername, userId)
    // TODO verify links
    if (!isSame) {
        const domain = externalUrl.replace('https://', '').replace('http://', '');;
        const hasOfficialLinks = links.map(link => {
            return link.indexOf(domain) > -1
        })
        isSame = hasOfficialLinks.length == 0
    }

   

    return isSame
}


async function _detectScam(post: PostDetail, database: Database): Promise<ScamResult | null> {
    // console.log('detectScam', post)
    const { nickname, content, userId, links } = post
    const {
      ProjectList: allProjects,
      commonWords,
      BlackList,
      callToActionsKeywords,
    } = database;
    // links
    if (links.length === 0) return null
    let matchType = 'unknown'

    const flags = {
        checkName: true,
        checkUserId: true,
        checkContent: false
    }
    let callActionScore = 0

    if (content) {
        callActionScore = callToActionsKeywords.map(keyword => {
            const isMatch = compareText(keyword, content)
            return isMatch ? 2 : 0
        }).reduce((totalScore: number, score) => totalScore + score, 0)
    }

    if (callActionScore === 0) {
        return null
    }

    const twitterInBlackList = BlackList.twitter.find(id => id === userId)
    if (twitterInBlackList) {
        return {
            slug: 'blocked',
            name: 'Twitter blocked',
            externalUrl: null,
            twitterUsername: null,
            post,
            matchType: 'twitter_in_black_list',
        }
    }

    const skipCheck = nickname && userId ? commonWords.find(word => nickname.includes(word) || userId.includes(word)) : false;
    if (skipCheck) {
        // console.log('skip check')
        return null
    }

    // check nick name
    let matchProject = null
    if (nickname !== null && flags.checkName) {
        // full match
        matchProject = allProjects.find((_) => _.name === nickname)
        matchType = 'name_full_match'
        // console.log('name_full_match')

        if (!matchProject && userId) {
            matchProject = allProjects.find((_) => _.twitterUsername && includeNameCheck(userId, _.twitterUsername))
            matchType = 'userId_match_twitter'
            // console.log('userId_match_twitter')
        }


        if (!matchProject) {
            matchProject = allProjects.find((_) => compareName(nickname, _.name))
            matchType = 'nickname_match_name'
            // console.log(matchType)
        }

        if (!matchProject) {
            // careful
            matchProject = allProjects.find((_) => matchNameInWords(nickname, _.name))
            matchType = 'nickname_match_name_words'
            // console.log(matchType)
        }

        if (matchProject?.twitterUsername && userId) {
            const verified = verifyProjectMeta(matchProject, post)
            if (!verified) {
                // console.log('scam', matchProject, links)
                return {
                    ...matchProject,
                    matchType,
                    post,
                }
            }
        }
    }

    // check userId
    if (userId !== undefined  && flags.checkUserId) {
        const matchProject = allProjects.find((_) => _.twitterUsername && includeName(userId, _.twitterUsername))
        matchType = 'userId_match_twitter_name'
        // console.log(matchType)
        if (matchProject?.twitterUsername && userId) {
            const verified = verifyProjectMeta(matchProject, post)
            if (!verified) {
                return {
                    ...matchProject,
                    matchType,
                    post,
                }
            }
        }
    }

    // check content
    if (content !== null  && flags.checkContent) {
        const projectsWithScore = allProjects.map((_) => {
            const score = [_.name, _.twitterUsername].map(keyword => {
                const isMatch = keyword ? compareText(keyword, content) : false
                return isMatch ? 5 : 0
            }).reduce((totalScore: number, score) => totalScore + score, 0)
            return {
                project: _,
                score
            }
        }).filter(_ => _.score > 0)
        .map(_ => {
            const callActionScore = callToActionsKeywords.map(keyword => {
                const isMatch = compareText(keyword, content)
                return isMatch ? 2 : 0
            }).reduce((totalScore: number, score) => totalScore + score, 0)
            return {
                ..._,
                callScore: callActionScore
            }
        })
        .sort((a, b) => b.score - a.score)
        if (projectsWithScore.length) {
            const matchProject = projectsWithScore[0].project
            if (projectsWithScore[0].callScore == 0) return null
            const verified = verifyProjectMeta(matchProject, post)
            matchType = 'content_match'
            // console.log(matchType)
            if (!verified) {
                return {
                    ...matchProject,
                    matchType,
                    post,
                }
            }
        }
    }
    return null
}


export class Detector {

    onlyBuiltIn: boolean;
    database: Database;
    lastFetch: number | null;
    databaseUrl: string;
    fetching: boolean;

    constructor({ onlyBuiltIn = true, databaseUrl = null }) {
        this.onlyBuiltIn = onlyBuiltIn
        this.database = builtInDatabase
        this.databaseUrl = databaseUrl || remoteDatabase
        this.lastFetch = null
        this.fetching = false
    }

    async update() {

        if (this.fetching) return;
        if (this.lastFetch) {
            const timeLeft = Date.now() - this.lastFetch
            if (timeLeft < 1000 * 60 * 5) {
                return
            }
        }

        this.fetching = true;

        try {
            const req = await fetch(this.databaseUrl)
            const remoteData = await req.json()
            this.database = remoteData 
        } catch(e) {
            console.error('fetch from remote failed', e)
        }

        this.fetching = false;
        this.lastFetch = Date.now()
    }

    async detectScam(post: PostDetail): Promise<ScamResult | null> {
       try {
            if (!this.onlyBuiltIn) this.update();
            return await _detectScam(post, this.database)
       } catch(e) {
           console.error('error', e)
       }
       return null
    }
}


export const detector = new Detector({})

export async function detectScam(post: PostDetail): Promise<ScamResult | null> {
    return detector.detectScam(post)
}


const REPORT_CACHE: string[] = []
const CACHE_SIZE = 100;

export async function reportScam(result: ScamResult) {
    const API_ENDPOINT = typeof process !== 'undefined' && process.env.DEV ? REPORT_ENDPOINT_DEV : REPORT_ENDPOINT
    const postId = result.post.id
    if (REPORT_CACHE.length > CACHE_SIZE) {
        REPORT_CACHE.shift();
    }
    if (postId && REPORT_CACHE.includes(postId)) {
        return 
    }
    try {
        await fetch(API_ENDPOINT, {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Accept: 'application/json',
            },
            body: JSON.stringify(result),
        })
    } catch (error) {
        console.error('report failed')
    }
    if (postId) REPORT_CACHE.push(postId)
}