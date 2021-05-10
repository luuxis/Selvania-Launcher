let win = nw.Window.get();
window.isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

if (process.platform == "win32") {
/*document.querySelector(".frame").classList.toggle("hide");
document.querySelector(".dragbar").classLis.toggle("hide");*/
}

function close() {
    win.close();
}

function minimize() {
    win.minimize();
}

