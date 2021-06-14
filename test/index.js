const fs = require("fs");

const dataDirectory = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME)
const login = (patch + "/login.json" )

const user = ""
const password = ""

let data ={ 
    "user": user,
    "password": password,
}; 

let dataStringified = JSON.stringify(data);
fs.mkdirSync(patch)
fs.writeFileSync(login, dataStringified);