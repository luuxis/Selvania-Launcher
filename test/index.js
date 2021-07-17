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

const fs = require('fs');
const download = require('download');
 
(async () => {
    await download('http://unicorn.com/foo.jpg', 'dist');
 
    fs.writeFileSync('dist/foo.jpg', await download('http://unicorn.com/foo.jpg'));
 
    download('unicorn.com/foo.jpg').pipe(fs.createWriteStream('dist/foo.jpg'));
 
    await Promise.all([
        'unicorn.com/foo.jpg',
        'cats.com/dancing.gif'
    ].map(url => download(url, 'dist')));
})();