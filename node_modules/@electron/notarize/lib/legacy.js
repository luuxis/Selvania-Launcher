var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const path = require("path");
const spawn_1 = require("./spawn");
const helpers_1 = require("./helpers");
const validate_args_1 = require("./validate-args");
const d = debug('electron-notarize:legacy');
function authorizationArgs(rawOpts) {
    const opts = validate_args_1.validateLegacyAuthorizationArgs(rawOpts);
    if (validate_args_1.isLegacyPasswordCredentials(opts)) {
        return ['-u', helpers_1.makeSecret(opts.appleId), '-p', helpers_1.makeSecret(opts.appleIdPassword)];
    }
    else {
        return [
            '--apiKey',
            helpers_1.makeSecret(opts.appleApiKey),
            '--apiIssuer',
            helpers_1.makeSecret(opts.appleApiIssuer),
        ];
    }
}
function startLegacyNotarize(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        d('starting notarize process for app:', opts.appPath);
        return yield helpers_1.withTempDir((dir) => __awaiter(this, void 0, void 0, function* () {
            const zipPath = path.resolve(dir, `${path.basename(opts.appPath, '.app')}.zip`);
            d('zipping application to:', zipPath);
            const zipResult = yield spawn_1.spawn('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', path.basename(opts.appPath), zipPath], {
                cwd: path.dirname(opts.appPath),
            });
            if (zipResult.code !== 0) {
                throw new Error(`Failed to zip application, exited with code: ${zipResult.code}\n\n${zipResult.output}`);
            }
            d('zip succeeded, attempting to upload to Apple');
            const notarizeArgs = [
                'altool',
                '--notarize-app',
                '-f',
                zipPath,
                '--primary-bundle-id',
                opts.appBundleId,
                ...authorizationArgs(opts),
            ];
            if (opts.ascProvider) {
                notarizeArgs.push('-itc_provider', opts.ascProvider);
            }
            const result = yield spawn_1.spawn('xcrun', notarizeArgs);
            if (result.code !== 0) {
                throw new Error(`Failed to upload app to Apple's notarization servers\n\n${result.output}`);
            }
            d('upload success');
            const uuidMatch = /\nRequestUUID = (.+?)\n/g.exec(result.output);
            if (!uuidMatch) {
                throw new Error(`Failed to find request UUID in output:\n\n${result.output}`);
            }
            d('found UUID:', uuidMatch[1]);
            return {
                uuid: uuidMatch[1],
            };
        }));
    });
}
exports.startLegacyNotarize = startLegacyNotarize;
function waitForLegacyNotarize(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        d('checking notarization status:', opts.uuid);
        const result = yield spawn_1.spawn('xcrun', [
            'altool',
            '--notarization-info',
            opts.uuid,
            ...authorizationArgs(opts),
        ]);
        if (result.code !== 0) {
            // These checks could fail for all sorts of reasons, including:
            //  * The status of a request isn't available as soon as the upload request returns, so
            //    it may just not be ready yet.
            //  * If using keychain password, user's mac went to sleep and keychain locked.
            //  * Regular old connectivity failure.
            d(`Failed to check status of notarization request, retrying in 30 seconds: ${opts.uuid}\n\n${result.output}`);
            yield helpers_1.delay(30000);
            return waitForLegacyNotarize(opts);
        }
        const notarizationInfo = helpers_1.parseNotarizationInfo(result.output);
        if (notarizationInfo.status === 'in progress') {
            d('still in progress, waiting 30 seconds');
            yield helpers_1.delay(30000);
            return waitForLegacyNotarize(opts);
        }
        d('notarzation done with info:', notarizationInfo);
        if (notarizationInfo.status === 'invalid') {
            d('notarization failed');
            throw new Error(`Apple failed to notarize your application, check the logs for more info

Status Code: ${notarizationInfo.statusCode || 'No Code'}
Message: ${notarizationInfo.statusMessage || 'No Message'}
Logs: ${notarizationInfo.logFileUrl}`);
        }
        if (notarizationInfo.status !== 'success') {
            throw new Error(`Unrecognized notarization status: "${notarizationInfo.status}"`);
        }
        d('notarization was successful');
        return;
    });
}
exports.waitForLegacyNotarize = waitForLegacyNotarize;
//# sourceMappingURL=legacy.js.map