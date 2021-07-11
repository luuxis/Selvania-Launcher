config = require("./config")


/*async function test() {
    const test = await new Promise((resolve, reject) => config.config().then(res => resolve(res.dataDirectory)))
    console.log(test)
}*/

var test = function() {
    return new Promise(resolve => {
        config.config().then(res => 
            resolve(res.dataDirectory))
    });
};

console.log(test)