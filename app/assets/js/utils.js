module.exports = {
    config: require("./utils/config.js"),
    auth: require("./utils/auth.js"),
    Slider: require("./utils/slider.js")
}

module.exports.compare = compare
function compare(v1, v2) {
    if (v1===v2)
      return 1;
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

  /**
* Classe slider : permet de créer un slider à deux valeurs (utile pour créer des bornes)
* @author LoganTann, Luuxis

*/
