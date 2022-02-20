import ("./home/start_game.js")
import ("./home/status_server.js")
import ("./home/news_server.js")

document.querySelector(".settings-btn").addEventListener("click", () => {
    changePanel("home", "settings")
})