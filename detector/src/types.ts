export type PostDetail = {
    id?: string;
    userId: string | undefined;
    nickname: string | null;
    content: string | null;
    links: string[];
}

export type ScamResult = {
    slug: string;
    name: string;
    matchType: string,
    externalUrl: string | null;
    twitterUsername: string | null;
    post: PostDetail;
}

export type Project = {
    slug: string;
    name: string;
    externalUrl: string | null;
    twitterUsername: string | null;
}

export type BlackList = {
    twitter: string[]
    domains: string[]
}

export type Database = {
    ProjectList: Project[],
    BlackList: BlackList,
    commonWords: string[]
    genTime: number
}