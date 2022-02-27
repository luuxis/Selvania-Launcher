document.querySelector(".user-head").addEventListener("click", () => {
    changePanel("home", "skins")
    import ("./skins/skin3D.js")
})

document.querySelector('.btn-cancel').addEventListener('click', () => {
    changePanel("skins", "home")
})