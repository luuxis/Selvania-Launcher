import { AllPublishOptions } from "builder-util-runtime";
import { AppAdapter } from "./AppAdapter";
import { AppUpdater, DownloadExecutorTask } from "./AppUpdater";
export declare abstract class BaseUpdater extends AppUpdater {
    protected quitAndInstallCalled: boolean;
    private quitHandlerAdded;
    protected constructor(options?: AllPublishOptions | null, app?: AppAdapter);
    quitAndInstall(isSilent?: boolean, isForceRunAfter?: boolean): void;
    protected executeDownload(taskOptions: DownloadExecutorTask): Promise<Array<string>>;
    protected abstract doInstall(options: InstallOptions): boolean;
    protected install(isSilent: boolean, isForceRunAfter: boolean): boolean;
    protected addQuitHandler(): void;
}
export interface InstallOptions {
    readonly installerPath: string;
    readonly isSilent: boolean;
    readonly isForceRunAfter: boolean;
    readonly isAdminRightsRequired: boolean;
}
