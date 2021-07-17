java = require("./java.json")
minecraft = "1.17"

if ((minecraft) >= "1.17"){
    jdk = java.jre16
    if(["win32"].includes(process.platform)){
        url = jdk.windows
      } else if(["darwin"].includes(process.platform)){
        url = jdk.mac
      } else if(["linux"].includes(process.platform)){
        url = jdk.linux      
      }
} else {
    jdk = java.jre8
    if(["win32"].includes(process.platform)){
        url = jdk.windows
      } else if(["darwin"].includes(process.platform)){
        url = jdk.mac
      } else if(["linux"].includes(process.platform)){
        url = jdk.linux      
      }
}

const download = require('download');
 
(async () => {
    await download(url, 'dist');
    
})();