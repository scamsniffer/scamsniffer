import builtInDatabase from './database/lite.json'
import type { PostDetail, ScamResult, Database } from './types'
import fetch from 'isomorphic-fetch'

// const REPORT_ENDPOINT = 'http://api.scamsniffer.io/report'
const REPORT_ENDPOINT_DEV = 'http://localhost:8081/report'
const remoteDatabase = 'https://raw.githubusercontent.com/scamsniffer/scamsniffer/main/database/generated/lite.json'
const miniumWordsLength = 4 
const callToActionsKeywords = [
    'Mint',
    'minting',
    'Supply',
    'GIVEAWAY',
    'claim'
]

function includeName(name: string, projectName: string) {
    name = name.toLowerCase()
    projectName = projectName.toLowerCase()
    return name.includes(projectName) || projectName.includes(name)
}


function compareName(name: string, name2: string) {
    name = name.toLowerCase()
    name2 = name2.toLowerCase()
    return name.includes(name2)
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

    const { userId, links } = post
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
    const allProjects = database.ProjectList
    // links
    if (links.length === 0) return null

    const flags = {
        checkName: true,
        checkUserId: true,
        checkContent: false
    }

    // check nick name
    let matchProject = null
    if (nickname !== null && flags.checkName) {
        // full match
        matchProject = allProjects.find((_) => _.name === nickname)
        if (!matchProject && userId) {
            matchProject = allProjects.find((_) => _.twitterUsername && userId.includes(_.twitterUsername))
        }
        console.log(
            'matchProject',
            matchProject,
            nickname,
        )

        if (!matchProject) {
            matchProject = allProjects.find((_) => compareName(nickname, _.name))
        }

        if (!matchProject) {
            // careful
            matchProject = allProjects.find((_) => matchNameInWords(nickname, _.name))
        }

        if (matchProject?.twitterUsername && userId) {
            const verified = verifyProjectMeta(matchProject, post)
            if (!verified) {
                // console.log('scam', matchProject, links)
                return {
                    ...matchProject,
                    post,
                }
            }
        }
    }

    // check userId
    if (userId !== undefined  && flags.checkUserId) {
        const matchProject = allProjects.find((_) => _.twitterUsername && includeName(userId, _.twitterUsername))
        console.log('userId', matchProject, links)
        if (matchProject?.twitterUsername && userId) {
            const verified = verifyProjectMeta(matchProject, post)
            if (!verified) {
                // console.log('scam', matchProject, links)
                return {
                    ...matchProject,
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
        // console.log('projectsWithScore', projectsWithScore)
        if (projectsWithScore.length) {
            const matchProject = projectsWithScore[0].project
            if (projectsWithScore[0].callScore == 0) return null
            const verified = verifyProjectMeta(matchProject, post)
            if (!verified) {
                // console.log('scam', matchProject);
                return {
                    ...matchProject,
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
    const API_ENDPOINT = REPORT_ENDPOINT_DEV 
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