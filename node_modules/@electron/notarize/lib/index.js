var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const helpers_1 = require("./helpers");
const legacy_1 = require("./legacy");
const notarytool_1 = require("./notarytool");
const staple_1 = require("./staple");
const d = debug('electron-notarize');
var validate_args_1 = require("./validate-args");
exports.validateAuthorizationArgs = validate_args_1.validateLegacyAuthorizationArgs;
function notarize(_a) {
    var { appPath } = _a, otherOptions = __rest(_a, ["appPath"]);
    return __awaiter(this, void 0, void 0, function* () {
        if (otherOptions.tool === 'notarytool') {
            d('notarizing using the new notarytool system');
            if (!(yield notarytool_1.isNotaryToolAvailable())) {
                throw new Error('notarytool is not available, you must be on at least Xcode 13');
            }
            yield notarytool_1.notarizeAndWaitForNotaryTool(Object.assign({ appPath }, otherOptions));
        }
        else {
            d('notarizing using the legacy notarization system, this will be slow');
            const { uuid } = yield legacy_1.startLegacyNotarize(Object.assign({ appPath }, otherOptions));
            /**
             * Wait for Apples API to initialize the status UUID
             *
             * If we start checking too quickly the UUID is not ready yet
             * and this step will fail.  It takes Apple a number of minutes
             * to actually complete the job so an extra 10 second delay here
             * is not a big deal
             */
            d('notarization started, waiting for 10 seconds before pinging Apple for status');
            yield helpers_1.delay(10000);
            d('starting to poll for notarization status');
            yield legacy_1.waitForLegacyNotarize(Object.assign({ uuid }, otherOptions));
        }
        yield staple_1.stapleApp({ appPath });
    });
}
exports.notarize = notarize;
//# sourceMappingURL=index.js.map