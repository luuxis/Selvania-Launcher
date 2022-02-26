'use strict';
const JsConfuser = require("js-confuser");
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

    Obfuscate(){
        for(let i of this.Fileslist){
            if(i.split("/").pop().split(".").pop() == "js"){
                let file = i.split("/");
                let path = "";
                for(let i = 0; i < file.length - 1; i++){
                    file[1] = 'app'
                    path += `${file[i]}/`;
                }
                let confuser = new JsConfuser({
                    source: fs.readFileSync(`${path}${file[file.length - 1]}`, 'utf8'),
                    seed: Math.random() * 1000000,
                    obfuscate: true,
                    compress: true
                });
                fs.writeFileSync(`${path}${file[file.length - 1]}`, confuser.obfuscate());
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


// // Read the file's code
// const file = (fs.readFileSync("./src/assets/js/index.js", "utf-8").replace('src/', "app/")).replace('src/', "app/");

// // Obfuscate the code
// JsConfuser.obfuscate(file, {
//   target: "node",
//   preset: "medium",
// }).then((obfuscated) => {
//   fs.writeFileSync("./index.js", obfuscated, { encoding: "utf-8" });
// });
