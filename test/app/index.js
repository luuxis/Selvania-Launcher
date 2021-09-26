const config = {
  "news": [
    {
      "title": "salut",
      "body": "news",
      "img": "https://raw.githubusercontent.com/luuxis/Uzurion-Launcher/V2/app/assets/images/background/wallpaper.jpg",
      "author": "luuxis",
      "date": "pas de date"
    }
  ]
}

let newsForm = document.querySelector(".news")

news()

document.querySelector(".user-head").src = `https://mc-heads.net/avatar/${config.news[0].author}/100/nohelm.png`



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

