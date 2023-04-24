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
const d = debug('electron-notarize:staple');
function stapleApp(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        d('attempting to staple app:', opts.appPath);
        const result = yield spawn_1.spawn('xcrun', ['stapler', 'staple', '-v', path.basename(opts.appPath)], {
            cwd: path.dirname(opts.appPath),
        });
        if (result.code !== 0) {
            throw new Error(`Failed to staple your application with code: ${result.code}\n\n${result.output}`);
        }
        d('staple succeeded');
        return;
    });
}
exports.stapleApp = stapleApp;
//# sourceMappingURL=staple.js.map