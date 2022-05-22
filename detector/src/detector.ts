import builtInProjects from './database/lite.json'
import type { PostDetail, ScamResult, Project } from './types'
import fetch from 'isomorphic-fetch'

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


async function _detectScam(post: PostDetail, allProjects: Array<Project>): Promise<ScamResult | null> {
    // console.log('detectScam', post)
    const { nickname, content, userId, links } = post
    // links
    if (links.length === 0) return null

    const flags = {
        checkName: false,
        checkUserId: false,
        checkContent: true
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
    allProjects: Array<Project>;
    lastFetch: number | null;
    database: string;

    constructor({ onlyBuiltIn = true, database = null }) {
        this.onlyBuiltIn = onlyBuiltIn
        this.allProjects = builtInProjects
        this.database = database || remoteDatabase
        this.lastFetch = null
    }

    async update() {
        const timeLeft = this.lastFetch ? Date.now() - this.lastFetch : 0
        if (timeLeft < 1000 * 60 * 10) {
            return
        }
       try {
            const req = await fetch(this.database)
            const remoteData = await req.json()
            this.allProjects = remoteData 
       } catch(e) {
           console.error('fetch from remote failed', e)
       }
        this.lastFetch = Date.now()
    }

    async detectScam(post: PostDetail): Promise<ScamResult | null> {
        if (!this.onlyBuiltIn) await this.update();
        return _detectScam(post, this.allProjects)
    }
}


export const detector = new Detector({})

export async function detectScam(post: PostDetail): Promise<ScamResult | null> {
    return detector.detectScam(post)
}