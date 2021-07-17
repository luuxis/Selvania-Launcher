download = require('download');
decompress = require('decompress');

java = require("../web/launcher/jre-download.json")
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


async function test(){
  await download(url, '.arche');
  decompress('.arche/OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.zip', '.arche')
}


test()
