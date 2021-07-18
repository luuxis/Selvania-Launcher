const Downloader = require('nodejs-file-downloader');
url = "https://github.com/luuxis/java/releases/download/jre-8/jre8-windows-1.8.0_51-b16.tar.gz"


async function test(){
    const downloader = new Downloader({
        url: url,
        directory: "./.arche-rp",
        fileName:'java.tar.gz',
        onProgress:function(percentage){
            setProgress(percentage, "100.00")
            setStatus("Téléchargement de Java")
        }     
      })
      try {
        await downloader.download();
        setStatus("Décompression de Java")
        decompress(dataDirectory + "/" + res.dataDirectory + "/runtime/" + 'java.tar.gz', dataDirectory + "/" + res.dataDirectory + "/runtime/java/").then(decompress_java => {
            fs.unlinkSync(dataDirectory + "/" + res.dataDirectory + "/runtime/" + 'java.tar.gz')
            startLauncher();
        })
      } catch (error) {
        return shutdown("Une erreur est survenue,<br>veuillez réessayer ultérieurement.");
      }
}

test()
  