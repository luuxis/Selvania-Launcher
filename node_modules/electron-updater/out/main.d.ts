/// <reference types="node" />
import { CancellationToken, PackageFileInfo, ProgressInfo, UpdateFileInfo, UpdateInfo } from "builder-util-runtime";
import { EventEmitter } from "events";
import { URL } from "url";
import { AppUpdater } from "./AppUpdater";
import { LoginCallback } from "./electronHttpExecutor";
export { AppUpdater, NoOpLogger } from "./AppUpdater";
export { CancellationToken, PackageFileInfo, ProgressInfo, UpdateFileInfo, UpdateInfo };
export { Provider } from "./providers/Provider";
export { AppImageUpdater } from "./AppImageUpdater";
export { MacUpdater } from "./MacUpdater";
export { NsisUpdater } from "./NsisUpdater";
export declare const autoUpdater: AppUpdater;
export interface ResolvedUpdateFileInfo {
    readonly url: URL;
    readonly info: UpdateFileInfo;
    packageInfo?: PackageFileInfo;
}
export interface UpdateCheckResult {
    readonly updateInfo: UpdateInfo;
    readonly downloadPromise?: Promise<Array<string>> | null;
    readonly cancellationToken?: CancellationToken;
    /** @deprecated */
    readonly versionInfo: UpdateInfo;
}
export declare type UpdaterEvents = "login" | "checking-for-update" | "update-available" | "update-not-available" | "update-cancelled" | "download-progress" | "update-downloaded" | "error";
export declare const DOWNLOAD_PROGRESS = "download-progress";
export declare const UPDATE_DOWNLOADED = "update-downloaded";
export declare type LoginHandler = (authInfo: any, callback: LoginCallback) => void;
export declare class UpdaterSignal {
    private emitter;
    constructor(emitter: EventEmitter);
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(handler: LoginHandler): void;
    progress(handler: (info: ProgressInfo) => void): void;
    updateDownloaded(handler: (info: UpdateDownloadedEvent) => void): void;
    updateCancelled(handler: (info: UpdateInfo) => void): void;
}
export interface UpdateDownloadedEvent extends UpdateInfo {
    downloadedFile: string;
}
export interface Logger {
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
    debug?(message: string): void;
}
