import liteProjects from './database/lite.json'

export type PostDetail = {
    id?: string
    userId: string | undefined
    nickname: string | null
    content: string | null
    links: string[]
}
export type ScamResult = {
    slug: string
    name: string
    externalUrl: string | null
    twitterUsername: string | null
    post: PostDetail
}

function includeName(name: string, projectName: string) {
    name = name.toLowerCase()
    projectName = projectName.toLowerCase()
    // split word
    // NAH FUNGIBLE BONES === fun
    // const nameWords = name.split(' ')
    // const projectNames = projectName.split(' ')
    return name.includes(projectName) || projectName.includes(name)
}

function compareUserId(id: string, id2: string) {
    return id.toLowerCase() === id2.toLowerCase()
}

export function detectScam(post: PostDetail): ScamResult | null {
    console.log('detectScam', post)
    const { nickname, userId, links } = post

    // links
    if (links.length === 0) return null

    // const fullMatch

    let matchProject = null

    if (nickname !== null) {
        // full match
        matchProject = liteProjects.find((_) => _.name === nickname)
        if (!matchProject && userId) {
            matchProject = liteProjects.find((_) => _.twitterUsername && userId.includes(_.twitterUsername))
        }
        console.log(
            'matchProject',
            matchProject,
            nickname,
            liteProjects.map((_) => _.name),
        )
        // like match
        if (!matchProject) {
            matchProject = liteProjects.find((_) => includeName(nickname, _.name))
        }
        console.log(
            'matchProject.nickname',
            nickname,
            liteProjects,
            liteProjects.filter((_) => includeName(nickname, _.name)),
        )
        if (matchProject?.twitterUsername && userId) {
            const userIdIsMatch = compareUserId(matchProject.twitterUsername, userId)
            if (!userIdIsMatch) {
                console.log('scam', matchProject, links)
                return {
                    ...matchProject,
                    post,
                }
            }
        }
    }
    if (userId !== undefined) {
        const matchProject = liteProjects.find((_) => _.twitterUsername && includeName(userId, _.twitterUsername))
        console.log('scam', matchProject, links)
        if (matchProject?.twitterUsername && userId) {
            const userIdIsMatch = compareUserId(matchProject.twitterUsername, userId)
            if (!userIdIsMatch) {
                console.log('scam', matchProject, links)
                return {
                    ...matchProject,
                    post,
                }
            }
        }
    }
    return null
}

function test() {
    //     detectScam({
    //         nickname: 'Karafuru NFT',
    //         userId: 'KarafuroNFT',
    //         content: `Fair Dutch Auction is LIVE \u{1F64C}\u{1F3FB}
    // https://3d-karafuru.io/mint/
    // \u{1F4CC} Supply: 4000 NFTs
    // \u{1F4CC} Starting Price: 0.5 E (Going down 0.025 E every 30 mins)
    // \u{1F4CC} Bottom Price: 0.25 E
    // \u{1F4CC} Max mint 2 NFTs / wallet
    // \u{1F4CC} 6 hours window \u23F3
    // Enjoy the minting experience! LFG Furus \u{1F680}`,
    //         links: ['https://3d-karafuru.io/mint/'],
    //     })
    //     detectScam({
    //         nickname: 'Karafuru NFTs',
    //         userId: 'KarafurulNFTs',
    //         content: `\u{1F4AB} 2x 3D Karafuru NFT GIVEAWAY \u{1F4AB}
    // \u{1F4E3} Last Before The Mint \u{1F4E3}
    // To Enter:
    // \u{1F680} Claim through https://karafurunfts.io`,
    //         links: ['https://karafurunfts.io'],
    //     })

    detectScam({
        nickname: 'Other Side Meta (Official)',
        userId: 'OthersideMeta_3',
        content: `\u{1F6A8} KODA AIRDROP is LIVE!

Claim your KODA AIRDROP if you own #Otherdeeds NFT holders.

\u{1F517} http://otheraside.com/koda

Note: Private Mint also available for None Otherdeed NFT holders.
#OthersideMeta
#Otherside #Kodas`,
        links: ['http://otheraside.com/koda'],
    })

    detectScam({
        nickname: 'doodles',
        userId: 'doodles___app',
        content: `Doop Life \u{1F525}\u{1F35E}\u{1F337}\u{1F4A9}\u2754

To celebrate the recent community growth, we're releasing some early Dooplicators!

1,000 Lucky Doodles holders may now claim their Dooplicator 1 day early`,
        links: [],
    })

    const name = '\u{1D5D4}peCoin'
}

// test()
