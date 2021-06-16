const fs = require("fs");

const login = ("/data" + "/login.json")

const user = ""
const password = ""

let data ={ 
    "user": user,
    "password": password,
}; 

let dataStringified = JSON.stringify(data);
fs.mkdirSync(patch)
fs.writeFileSync(login, dataStringified);