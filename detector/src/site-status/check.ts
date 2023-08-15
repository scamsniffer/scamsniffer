// import siteStatusDatabase from "../__fixtures__/status.json";

export async function checkDNSProvider(host: string, database: any) {
    const state = database[host];
    if (!state) {
        return null
    }

    const lastScan = state.lastScan;
    const dataIsExpired = (Date.now() - new Date(lastScan).getTime()) / 1000 > 86400 * 3;
    if (dataIsExpired) {
        return null
    }

    const dnsChanges = state.recent;
    if (dnsChanges.length) {
        const recentChange = dnsChanges[0];
        const recentOrg = recentChange.organization;
        const foundInLast = dnsChanges.slice(1, dnsChanges.length).filter((_:any) => _.organization === recentOrg);

        const topProvider = dnsChanges.slice(1, dnsChanges.length)
        .filter((_:any) => _.organization != recentOrg).reduce((all: any, item: any) => {
            all[item.organization] = all[item.organization] || 0;
            all[item.organization]++;
            return all;
        }, {});
        const lastProviders = Object.keys(topProvider).sort((a, b) => topProvider[b] - topProvider[a]);
        const alwaysSameOne = lastProviders.length === 0;
        const isRecentChange = (Date.now() - new Date(recentChange.date).getTime()) < 86400 * 1000 * 7
        if (!foundInLast.length && !alwaysSameOne && isRecentChange) {
            return {
                host,
                isRecentChange,
                lastProviders,
                recentChange
            }
        }
    }

    return null
}

async function test() {
    // for (const site in siteStatusDatabase) {
    //     console.log(await checkDNSProvider(site, siteStatusDatabase as any))
    // }
}   

// test();