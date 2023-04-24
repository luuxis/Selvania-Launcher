export interface LegacyNotarizePasswordCredentials {
    appleId: string;
    appleIdPassword: string;
}
export interface NotaryToolPasswordCredentials {
    appleId: string;
    appleIdPassword: string;
    teamId: string;
}
export interface LegacyNotarizeApiKeyCredentials {
    appleApiKey: string;
    appleApiIssuer: string;
}
export interface NotaryToolApiKeyCredentials {
    appleApiKey: string;
    appleApiKeyId: string;
    appleApiIssuer: string;
}
export interface NotaryToolKeychainCredentials {
    keychainProfile: string;
    keychain?: string;
}
export declare type LegacyNotarizeCredentials = LegacyNotarizePasswordCredentials | LegacyNotarizeApiKeyCredentials;
export declare type NotaryToolCredentials = NotaryToolPasswordCredentials | NotaryToolApiKeyCredentials | NotaryToolKeychainCredentials;
export declare type NotarizeCredentials = LegacyNotarizeCredentials | NotaryToolCredentials;
export interface LegacyNotarizeAppOptions {
    appPath: string;
    appBundleId: string;
}
export interface NotaryToolNotarizeAppOptions {
    appPath: string;
}
export interface TransporterOptions {
    ascProvider?: string;
}
export interface NotarizeResult {
    uuid: string;
}
export declare type LegacyNotarizeStartOptions = LegacyNotarizeAppOptions & LegacyNotarizeCredentials & TransporterOptions;
export declare type NotaryToolStartOptions = NotaryToolNotarizeAppOptions & NotaryToolCredentials;
export declare type LegacyNotarizeWaitOptions = NotarizeResult & LegacyNotarizeCredentials;
export declare type NotarizeStapleOptions = Pick<LegacyNotarizeAppOptions, 'appPath'>;
export declare type NotarizeOptions = ({
    tool?: 'legacy';
} & LegacyNotarizeStartOptions) | ({
    tool: 'notarytool';
} & NotaryToolStartOptions);
