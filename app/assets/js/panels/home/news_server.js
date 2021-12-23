const { config } = require('./assets/js/utils.js');
let newsForm = document.querySelector(".container-news")


config.news().then(config => {
  newsForm.innerHTML = ``
  if(config.news.length === 0){
    newsForm.innerHTML = `<div class="newsTitle">Aucune news n'est actuellement disponible.</div>`
  } else {
    for (let i = 0; i < config.news.length; i++) {
      var newsTitle = config.news[i].title
      var newsBody = config.news[i].body
      var newsImage = config.news[i].img
      var newsAuthor = config.news[i].author
      var newsDate = config.news[i].date
      
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





