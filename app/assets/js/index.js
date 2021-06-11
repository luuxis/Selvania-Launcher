'use strict';

const { config } = require('./assets/js/utils.js');


let win = nw.Window.get();

    nw.Window.open("app/launcher.html", {
      "title": "Arche Launcher",
      "width": 980,
      "height": 552,
      "min_width": 980,
      "min_height": 552,
      "frame": (process.platform == "win32") ? false : true,
      "position": "center",
      "icon": "app/assets/images/icons/icon.png"
    });
    win.close();
 
