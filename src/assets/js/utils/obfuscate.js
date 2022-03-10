'use strict';
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require("fs");

class Index {
    constructor() {
        this.obf = true
        process.argv.forEach(val => {
            if (val.startsWith('--obf')) this.obf = JSON.parse(val.split('=')[1])
        });
        this.Fileslist = this.getFiles("./src");
        this.CleanFiles();
        this.CreateFolders();
        this.coppyFiles();
        this.Obfuscate();
    }

    CleanFiles() {
        if (fs.existsSync("./app")) {
            for (let file of this.getFiles("./app")) {
                try {
                    if (fs.statSync(file).isDirectory()) {
                        fs.rmdirSync(file);
                    } else {
                        fs.unlinkSync(file);
                        let folder = file.split("/").slice(0, -1).join("/");
                        while (true) {
                            if (folder == (`${path.resolve(this.client.path)}`).replace(/\\/g, "/")) break;
                            let content = fs.readdirSync(folder);
                            if (content.length == 0) fs.rmdirSync(folder);
                            folder = folder.split("/").slice(0, -1).join("/");
                        }
                    }
                } catch (e) {}
            }
        }
    }

    CreateFolders() {
        for (let i of this.Fileslist) {
            let file = i.split("/");
            let path = "";
            for (let i = 0; i < file.length - 1; i++) {
                file[1] = 'app'
                path += `${file[i]}/`;
                if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
            }
        }
    }

    coppyFiles() {
        for (let i of this.Fileslist) {
            if (i.split("/").pop().split(".").pop() != "js") {
                let file = i.split("/");
                let path = "";
                for (let i = 0; i < file.length - 1; i++) {
                    file[1] = 'app'
                    path += `${file[i]}/`;
                }
                fs.copyFileSync(i, `${path}${file[file.length - 1]}`);
            }
        }
    }

    async Obfuscate() {
        for (let i of this.Fileslist) {
            if (i.split("/").pop() === 'obfuscate.js') continue
            if (i.split("/").pop().split(".").pop() == "js") {
                let file = i.split("/");
                let path = "";
                for (let i = 0; i < file.length - 1; i++) {
                    file[1] = 'app'
                    path += `${file[i]}/`;
                }
                let code = fs.readFileSync(i, "utf8");
                code = code.replace(/src\//g, 'app/');
                if (this.obf) {
                    await new Promise((resolve) => {
                        console.log(`Obfuscate ${path}${file[file.length - 1]}`);
                        var obf = JavaScriptObfuscator.obfuscate(code, { optionsPreset: 'low-obfuscation' });
                        resolve(fs.writeFileSync(`${path}${file[file.length-1]}`, obf.getObfuscatedCode(), { encoding: "utf-8" }));
                    })
                } else {
                    fs.writeFileSync(`${path}${file[file.length-1]}`, code, { encoding: "utf-8" });
                }
            }
        }
    }

    getFiles(path, file = []) {
        if (fs.existsSync(path)) {
            let files = fs.readdirSync(path);
            if (files.length == 0) file.push(path);
            for (let i in files) {
                let name = `${path}/${files[i]}`;
                if (fs.statSync(name).isDirectory())
                    this.getFiles(name, file);
                else
                    file.push(name);
            }
        }
        return file;
    }
}
new Index();