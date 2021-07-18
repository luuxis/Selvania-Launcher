const Downloader = require('nodejs-file-downloader');
url = "https://github.com/luuxis/java/releases/download/jre-8/jre8-windows-1.8.0_51-b16.tar.gz"


async function test(){
    const downloader = new Downloader({
        url: url,
        directory: "./downloads",      
      })
      try {
        await downloader.download();
        console.log('All done');
      } catch (error) {
          
      }
}      

test()
  