const config = require("../../web/launcher/news-launcher/news-launcher.json")
let newsForm = document.querySelector(".news")

news()


async function news () {
for (let i = 0; i < config.news.length; i++) {
        var newsTitle = config.news[i].title
        var newsBody = config.news[i].body
        var newsImage = config.news[i].img
        var newsAuthor = config.news[i].author
        var newsDate = config.news[i].date
        
        if (newsImage === null) {
            newsForm.innerHTML += `
            <div class="newsTitle">${newsTitle}</div>
            <div class="newsTitle">${newsBody}</div>
            <div class="newsTitle">${newsAuthor}</div>
            <div class="newsTitle">${newsDate}</div>
            `
        } else {
            newsForm.innerHTML += `
            <div class="newsTitle">${newsTitle}</div>
            <div class="newsTitle">${newsBody}</div>
            <img class="newsTitle" src="${newsImage}" alt="">
            <div class="newsTitle">${newsAuthor}</div>
            <div class="newsTitle">${newsDate}</div>
            `
        }
    }
}

