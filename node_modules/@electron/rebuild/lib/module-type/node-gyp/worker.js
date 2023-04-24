"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_gyp_1 = __importDefault(require("node-gyp"));
const util_1 = require("util");
process.on('message', async ({ nodeGypArgs, devDir, extraNodeGypArgs, }) => {
    const nodeGyp = (0, node_gyp_1.default)();
    nodeGyp.parseArgv(nodeGypArgs);
    nodeGyp.devDir = devDir;
    let command = nodeGyp.todo.shift();
    try {
        while (command) {
            if (command.name === 'configure') {
                command.args = command.args.filter((arg) => !extraNodeGypArgs.includes(arg));
            }
            else if (command.name === 'build' && process.platform === 'win32') {
                // This is disgusting but it prevents node-gyp from destroying our MSBuild arguments
                command.args.map = (fn) => {
                    return Array.prototype.map.call(command.args, (arg) => {
                        if (arg.startsWith('/p:'))
                            return arg;
                        return fn(arg);
                    });
                };
            }
            await (0, util_1.promisify)(nodeGyp.commands[command.name])(command.args);
            command = nodeGyp.todo.shift();
        }
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
//# sourceMappingURL=worker.js.map