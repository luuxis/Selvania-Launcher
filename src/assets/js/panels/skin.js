const { skin } = require('minecraft-java-core');
const fs = require('fs');
document.querySelector('.skin-file-button').addEventListener('click', () => {
    let img = fs.readFileSync(document.querySelector('.skin-file').value)
    console.log(img)
})