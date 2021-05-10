let win = nw.Window.get();
window.isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

if (process.platform == "win32") {

}

function close() {
    win.close();
}

function minimize() {
    win.minimize();
}

