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
const d = debug('electron-notarize:notarytool');
function authorizationArgs(rawOpts) {
    const opts = validate_args_1.validateNotaryToolAuthorizationArgs(rawOpts);
    if (validate_args_1.isNotaryToolPasswordCredentials(opts)) {
        return [
            '--apple-id',
            helpers_1.makeSecret(opts.appleId),
            '--password',
            helpers_1.makeSecret(opts.appleIdPassword),
            '--team-id',
            helpers_1.makeSecret(opts.teamId),
        ];
    }
    else if (validate_args_1.isNotaryToolApiKeyCredentials(opts)) {
        return [
            '--key',
            helpers_1.makeSecret(opts.appleApiKey),
            '--key-id',
            helpers_1.makeSecret(opts.appleApiKeyId),
            '--issuer',
            helpers_1.makeSecret(opts.appleApiIssuer),
        ];
    }
    else {
        // --keychain is optional -- when not specified, the iCloud keychain is used by notarytool
        if (opts.keychain) {
            return ['--keychain', opts.keychain, '--keychain-profile', opts.keychainProfile];
        }
        return ['--keychain-profile', opts.keychainProfile];
    }
}
function isNotaryToolAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield spawn_1.spawn('xcrun', ['--find', 'notarytool']);
        return result.code === 0;
    });
}
exports.isNotaryToolAvailable = isNotaryToolAvailable;
function notarizeAndWaitForNotaryTool(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        d('starting notarize process for app:', opts.appPath);
        return yield helpers_1.withTempDir((dir) => __awaiter(this, void 0, void 0, function* () {
            const zipPath = path.resolve(dir, `${path.parse(opts.appPath).name}.zip`);
            d('zipping application to:', zipPath);
            const zipResult = yield spawn_1.spawn('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', path.basename(opts.appPath), zipPath], {
                cwd: path.dirname(opts.appPath),
            });
            if (zipResult.code !== 0) {
                throw new Error(`Failed to zip application, exited with code: ${zipResult.code}\n\n${zipResult.output}`);
            }
            d('zip succeeded, attempting to upload to Apple');
            const notarizeArgs = [
                'notarytool',
                'submit',
                zipPath,
                ...authorizationArgs(opts),
                '--wait',
                '--output-format',
                'json',
            ];
            const result = yield spawn_1.spawn('xcrun', notarizeArgs);
            if (result.code !== 0) {
                try {
                    const parsed = JSON.parse(result.output.trim());
                    if (parsed && parsed.id) {
                        const logResult = yield spawn_1.spawn('xcrun', [
                            'notarytool',
                            'log',
                            parsed.id,
                            ...authorizationArgs(opts),
                        ]);
                        d('notarization log', logResult.output);
                    }
                }
                catch (e) {
                    d('failed to pull notarization logs', e);
                }
                throw new Error(`Failed to notarize via notarytool\n\n${result.output}`);
            }
            d('notarization success');
        }));
    });
}
exports.notarizeAndWaitForNotaryTool = notarizeAndWaitForNotaryTool;
//# sourceMappingURL=notarytool.js.map