'use strict';
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require("fs");

class Index {
    constructor(){
        this.Fileslist = this.getFiles("./src");
        this.CleanFiles();
        this.CreateFolders();
        this.coppyFiles();
        this.Obfuscate();
    }

    CleanFiles(){
        if(fs.existsSync("./app")){
            fs.rmSync("./app", {recursive: true});
        }
    }

    CreateFolders(){
        for(let i of this.Fileslist){
            let file = i.split("/");
            let path = "";
            for(let i = 0; i < file.length - 1; i++){
                file[1] = 'app'
                path += `${file[i]}/`;
                if(!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true});
            }
        }
    }

    coppyFiles(){
        for(let i of this.Fileslist){
            if(i.split("/").pop().split(".").pop() != "js"){
                let file = i.split("/");
                let path = "";
                for(let i = 0; i < file.length - 1; i++){
                    file[1] = 'app'
                    path += `${file[i]}/`;
                }
                fs.copyFileSync(i, `${path}${file[file.length - 1]}`);
            }
        }
    }

    async Obfuscate(){
        for(let i of this.Fileslist){
            if(i.split("/").pop() === 'obfuscate.js')continue
            if(i.split("/").pop().split(".").pop() == "js"){
                let file = i.split("/");
                let path = "";
                for(let i = 0; i < file.length - 1; i++){
                    file[1] = 'app'
                    path += `${file[i]}/`;
                }
                console.log(`Obfuscate ${path}${file[file.length - 1]}`);
                let code = fs.readFileSync(i, "utf8");
                code = code.replace(/src\//g, 'app/');

                await new Promise((resolve) => {
                    var obf = JavaScriptObfuscator.obfuscate(
                        code,
                        {
                            compact: false,
                            controlFlowFlattening: true,
                            controlFlowFlatteningThreshold: 1,
                            numbersToExpressions: true,
                            simplify: true,
                            stringArrayShuffle: true,
                            splitStrings: true,
                            stringArrayThreshold: 1
                        }
                    );
                    resolve(fs.writeFileSync(`${path}${file[file.length - 1]}`, obf.getObfuscatedCode(), { encoding: "utf-8" }));
                })
            }
        }
    }
    
    getFiles(path, file = []){
        if(fs.existsSync(path)){
            let files = fs.readdirSync(path);
            if(files.length == 0) file.push(path);
            for(let i in files){
                let name = `${path}/${files[i]}`;
                if(fs.statSync(name).isDirectory())
                this.getFiles(name, file);
                else
                file.push(name);
            }
        }
        return file;
    }
}

new Index();