/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

"use strict";
const electron = require("electron");
const path = require("path");
const os = require("os");
let updateWindow = undefined;

function getWindow() {
    return updateWindow;
}

function destroyWindow() {
    if (!updateWindow) return;
    updateWindow.close();
    updateWindow = undefined;
}

function createWindow() {
    destroyWindow();
    updateWindow = new electron.BrowserWindow({
        title: "Mise à jour",
        width: 400,
        height: 500,
        resizable: false,
        icon: `./src/assets/images/icon.${os.platform() === "win32" ? "ico" : "png"}`,
        transparent: os.platform() === 'win32',
        frame: false,
        show: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
    });
    electron.Menu.setApplicationMenu(null);
    updateWindow.setMenuBarVisibility(false);
    updateWindow.loadFile(path.join(electron.app.getAppPath(), 'src', 'index.html'));
    updateWindow.once('ready-to-show', () => {
        if (updateWindow) {
            updateWindow.show();
        }
    });
}

module.exports = {
    getWindow,
    createWindow,
    destroyWindow,
};