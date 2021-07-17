download = require('download');
decompress = require('decompress');

java = require("../web/launcher/jre-download.json")
minecraft = "1.17"


function compare(v1, v2) {
  if (v1===v2)
    return 0;
  const nbs1 = v1.split(".");
  const nbs2 = v2.split(".");
  const nbElem = Math.max(nbs1.length, nbs1.length)
  for(i=0;i<nbElem ;++i) {
      if(nbs2[i] === undefined)
           return 1;
      if(nbs1[i] === undefined)
           return -1;
      let nb1 = parseInt(nbs1[i]);
      let nb2 = parseInt(nbs2[i]);
      if(nb1 > nb2)
           return 1;
      if(nb1 < nb2)
           return -1;
  }
  if(nbs2.length > nbs1.length)
       return -1;
  return 0;
}


if(compare(minecraft, "1.17") == 1){
  if(["win32"].includes(process.platform)){
      url = java.jre16.windows
    } else if(["darwin"].includes(process.platform)){
      url = java.jre16.mac
    } else if(["linux"].includes(process.platform)){
      url = java.jre16.linux    
    }
} else {
  if(["win32"].includes(process.platform)){
      url = java.jre8.windows
    } else if(["darwin"].includes(process.platform)){
      url = java.jre8.mac
    } else if(["linux"].includes(process.platform)){
      url = java.jre8.linux   
    }
}


async function test(){
  await download(url, '.arche');
  //decompress('.arche/' + files, '.arche')
}


test()
