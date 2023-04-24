import { AllPublishOptions } from "builder-util-runtime";
import { AppAdapter } from "./AppAdapter";
import { DownloadUpdateOptions } from "./AppUpdater";
import { BaseUpdater, InstallOptions } from "./BaseUpdater";
export declare class NsisUpdater extends BaseUpdater {
    /**
     * Specify custom install directory path
     *
     */
    installDirectory?: string;
    constructor(options?: AllPublishOptions | null, app?: AppAdapter);
    /*** @private */
    protected doDownloadUpdate(downloadUpdateOptions: DownloadUpdateOptions): Promise<Array<string>>;
    private verifySignature;
    protected doInstall(options: InstallOptions): boolean;
    private differentialDownloadInstaller;
    private differentialDownloadWebPackage;
}
