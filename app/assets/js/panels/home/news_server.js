const { config } = require('./assets/js/utils.js');
let newsForm = document.querySelector(".container-news")


config.news().then(config => {
  newsForm.innerHTML = ``
  if(config.length === 0){
    newsForm.innerHTML = `<div class="newsTitle">Aucune news n'est actuellement disponible.</div>`
  } else {
    for (let i = 0; i < config.length; i++) {
      var newsTitle = config[i].title
      var newsBody = config[i].body
      var newsImage = config[i].img
      var newsAuthor = config[i].author
      var newsDate = config[i].date
      
      if (newsImage === "") {
        newsForm.innerHTML += 
        `<div class="newsTitle">${newsTitle}</div>
        <div class="newsBody">
          <div class="texenewsbody">${newsBody}</div>
        </div>
        <div class="newsAuthor">Par ${newsAuthor}, le ${newsDate}</div>`
      } else {
         newsForm.innerHTML += 
         `<div class="newsTitle">${newsTitle}</div>
         <div class="newsBody">
          <div class="texenewsbody">${newsBody}
            <img class="newsImage" src="${newsImage}">
          </div>
        </div>
        <div class="newsAuthor">Par ${newsAuthor}, le ${newsDate}</div>`
      }
    }
  }
})





