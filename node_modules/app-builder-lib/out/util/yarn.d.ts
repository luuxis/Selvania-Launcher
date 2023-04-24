/// <reference types="node" />
import { Arch } from "builder-util";
import { Configuration } from "../configuration";
export declare function installOrRebuild(config: Configuration, appDir: string, options: RebuildOptions, forceInstall?: boolean): Promise<void>;
export interface DesktopFrameworkInfo {
    version: string;
    useCustomDist: boolean;
}
export declare function getGypEnv(frameworkInfo: DesktopFrameworkInfo, platform: NodeJS.Platform, arch: string, buildFromSource: boolean): any;
export declare function nodeGypRebuild(frameworkInfo: DesktopFrameworkInfo, arch: Arch): Promise<void>;
export interface RebuildOptions {
    frameworkInfo: DesktopFrameworkInfo;
    platform?: NodeJS.Platform;
    arch?: string;
    buildFromSource?: boolean;
    additionalArgs?: Array<string> | null;
}
