const file = document.querySelector("#path-file");

document.querySelector(".path-button").addEventListener("click", async () => {
  file.value = ""
  file.click()
  await new Promise((resolve) => {
    let interval
    interval = setInterval(() => {
      if(file.value != "") resolve(clearInterval(interval))
    }, 100)
  });
  
  config.config().then(res => {
    if(file.value.replace(".exe", "").endsWith("java") || file.value.replace(".exe", "").endsWith("javaw")){
      const files = require(`${dataDirectory}/${res.dataDirectory}/config.json`)
      files.Settings.Java.Directory = file.value.replace(/\\/g, "/")
      fs.writeFileSync(`${dataDirectory}/${res.dataDirectory}/config.json`, JSON.stringify(files, true, 4), 'UTF-8')
    } else {
      
    }
  })
})