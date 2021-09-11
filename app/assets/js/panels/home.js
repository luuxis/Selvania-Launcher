let opts = {
    url: "http://146.59.227.140/files/",
    overrides: {
      detached: false
    },
    authorization: authenticator,
    root: "C:/test/",
    version: "1.12.2",
    forge: "1.12.2-forge-14.23.5.2855",
    checkFiles: true,
    memory: {
        max: "6G",
        min: "4G"
    }
  }
  launcher.launch(opts);