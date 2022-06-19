const builder = require('electron-builder')
const { url, preductname } = require('./package.json')
const Platform = builder.Platform

function getCurrentPlatform(){
    switch(process.platform){
        case 'win32':
            return Platform.WINDOWS
        case 'darwin':
            return Platform.MAC
        case 'linux':
            return Platform.linux
        default:
            console.error('Cannot resolve current platform!')
            return undefined
    }
}

let configBuild = {
    appId: preductname,
    productName: preductname,
    artifactName: "${productName}-${os}-${arch}.${ext}",
    files: ["src/**/*", "package.json", "LICENSE.md"],
    directories: { "output": "dist" },
    compression: 'maximum',
    asar: true,
    win: {
        icon: "./src/assets/images/icon.ico",
        target: [{
            target: "nsis",
            arch: ["x64"]
        }, {
            target: "zip",
            arch: ["x64"]
        }]
    },
    mac: {
        icon: "./src/assets/images/icon.icns",
        category: "public.app-category.games",
        target: [{
            target: "dmg",
            arch: ["x64", "arm64"]
        }, {
            target: "zip",
            arch: ["x64", "arm64"]
        }]
    },
    linux: {
        icon: "./src/assets/images/icon.png",
        target: [{
            target: "AppImage",
            arch: ["x64"]
        }, {
            target: "deb",
            arch: ["x64"]
        }, {
            target: "rpm",
            arch: ["x64"]
        }, {
            target: "zip",
            arch: ["x64"]
        }]
    },
    publish: {
        provider: "generic",
        url: `${url}/launcher/update-launcher`,
        updaterCacheDirName: "${productName}-updaterer"
    }
}

builder.build({
    targets: (process.argv[2] != null && Platform[process.argv[2]] != null ? Platform[process.argv[2]] : getCurrentPlatform()).createTarget(),
    config: configBuild
}).then(() => {
    console.log('le build est terminé')
}).catch(err => {
    console.error('Error during build!', err)
})