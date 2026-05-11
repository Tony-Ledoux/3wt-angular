export interface AppConfig {
    app: {
        name: string;
        version: string
    },
    api: {
        url: string
    },
    auth0: Auht0Config;
}

export interface Auht0Config {
    domain: string;
    client_id: string;
    audience: string;
    roleClaims: string;
}