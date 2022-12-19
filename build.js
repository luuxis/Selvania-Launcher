const builder = require('electron-builder')
const { preductname } = require('./package.json')


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
        }],
    },
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: false
    },
    mac: {
        icon: "./src/assets/images/icon.icns",
        category: "public.app-category.games",
        target: [{
            target: "dmg",
            arch: ["x64", "arm64"]
        }]
    },
    linux: {
        icon: "./src/assets/images/icon.png",
        target: [{
            target: "AppImage",
            arch: ["x64"]
        }, {
            target: "tar.gz",
            arch: ["x64"]
        }]
    }
}

builder.build({
    config: configBuild
}).then(() => {
    console.log('Build Exitosa')
}).catch(err => {
    console.error('Error en la Build', err)
})