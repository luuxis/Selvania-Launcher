const fetch = require("node-fetch")
let newsForm = document.getElementById("news")

news()


async function news () {
let response = await fetch("http://minecraft-launcher.medianewsonline.com/servers/pentagone2/news/news.json").then(res => res.json());
for (let i = 0; i < response.news.length; i++) {
        var newsTitle = response.news[i].title
        var newsBody = response.news[i].body
        var newsImage = response.news[i].img
        var newsAuthor = response.news[i].author
        var newsDate = response.news[i].date
        
        if (newsImage === null) {
            newsForm.innerHTML += "<div class='news-title-form'><p class='news-title'><b>" + newsTitle + "</b></p><div class='news-body-form'><p style='line-height: 25px; margin: 0px;'>" + newsBody + "</p></div><p class='news-date'>Par " + newsAuthor + ", le " + newsDate + "</p></div>"
        } else {
            newsForm.innerHTML += "<div class='news-title-form'><p class='news-title'><b>" + newsTitle + "</b></p><div class='news-body-form'><p style='line-height: 25px; margin: 0px;'>" + newsBody + "</p><img class='news-img' src='" + newsImage + "' alt='image'></div><p class='news-date'>Par " + newsAuthor + ", le " + newsDate + "</p></div>"
        }
    }
}

