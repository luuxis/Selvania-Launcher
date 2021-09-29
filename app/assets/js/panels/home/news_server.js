const { config } = require('./assets/js/utils.js');
let newsForm = document.querySelector(".news")


config.news().then(config => {
    for (let i = 0; i < config.news.length; i++) {
        var newsTitle = config.news[i].title
        var newsBody = config.news[i].body
        var newsImage = config.news[i].img
        var newsAuthor = config.news[i].author
        var newsDate = config.news[i].date
        
        if (newsImage === "") {
            newsForm.innerHTML += 
            `<div class="newsTitle">${newsTitle}</div>
            <div class="newsBody">${newsBody}</div>
            <div class="newsAuthor">${newsAuthor}</div>
            <div class="newsDate">${newsDate}</div>`
        } else {
            newsForm.innerHTML += 
            `<div class="newsTitle">${newsTitle}</div>
            <div class="newsBody">${newsBody}</div>
            <img class="newsImage" src="${newsImage}">
            <div class="newsAuthor">${newsAuthor}</div>
            <div class="newsDate">${newsDate}</div>`
        }
    }
})