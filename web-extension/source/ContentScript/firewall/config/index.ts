let config: any = {}; 

const EVENT_NAME = 'ScamSniffer/config';

export function getConfig() {
    return config;
}

export const updateFirewallConfig = (config: any) => {
    document.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
            detail: config
        })
    );
};

export const watchConfig = () => {
    document.addEventListener(EVENT_NAME, (event: any) => {
        Object.assign(config, event.detail)
    });
};