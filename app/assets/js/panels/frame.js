let win = nw.Window.get();
window.isDev = (window.navigator.plugins.namedItem('Native Client') !== null);

if (process.platform == "win32") {
    document.querySelector(".frame").style.display = "none";
    const div = document.querySelector('frame');
    div.setAttribute('style', ' display: none');

}

function close() {
    win.close();
}

function minimize() {
    win.minimize();
}

