download = require('download');
decompress = require('decompress');

java = require("../web/launcher/jre-download.json")
minecraft = "1.17"


if ((minecraft) >= "1.17"){
  jdk = java.jre16
  if(["win32"].includes(process.platform)){
      url = jdk.windows
      files = "OpenJDK16U-jre_x64_windows_hotspot_16.0.1_9.zip"
    } else if(["darwin"].includes(process.platform)){
      url = jdk.mac
      files = "OpenJDK16U-jre_x64_mac_hotspot_16.0.1_9.tar.gz"
    } else if(["linux"].includes(process.platform)){
      url = jdk.linux  
      files = "OpenJDK16U-jre_x64_linux_hotspot_16.0.1_9.tar.gz"   
    }
} else {
  jdk = java.jre8
  if(["win32"].includes(process.platform)){
      url = jdk.windows
      files = "OpenJDK8U-jre_x64_windows_hotspot_8u292b10.zip"
    } else if(["darwin"].includes(process.platform)){
      url = jdk.mac
      files = "OpenJDK8U-jre_x64_mac_hotspot_8u292b10.tar.gz"
    } else if(["linux"].includes(process.platform)){
      url = jdk.linux 
      files = "OpenJDK8U-jre_x64_linux_hotspot_8u292b10.tar.gz"   
    }
}


async function test(){
  await download(url, '.arche');
  decompress('.arche/' + files, '.arche')
}


test()
