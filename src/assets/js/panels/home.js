import ("./home/start_game.js")
import ("./home/start_game.js")
import ("./home/skin.js")
import ("./home/news_server.js")

document.querySelector(".user-head").addEventListener("click", () => {
    changePanel("home", "skin")
})

document.querySelector(".settings-btn").addEventListener("click", () => {
    changePanel("home", "settings")
})