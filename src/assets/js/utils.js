import config from './utils/config.js';
import database from './utils/database.js';
import logger from './utils/logger.js';
import slider from './utils/slider.js';

export {
    config as config,
    database as database,
    logger as logger,
    changePanel as changePanel,
    addAccount as addAccount,
    slider as slider,
    headplayer as headplayer
}

function changePanel(id) {
    let panel = document.querySelector(`.${id}`);
    let active = document.querySelector(`.active`)
    if (active) active.classList.toggle("active");
    panel.classList.add("active");
}

function addAccount(data) {
    let div = document.createElement("div");
    div.classList.add("account");
    div.id = data.uuid;
    div.innerHTML = `
        <img class="account-image" src="https://mc-heads.net/head/${data.name}">
        <div class="account-name">${data.name}</div>
        <div class="account-uuid">${data.uuid}</div>
        <div class="account-delete"><div class="icon-account-delete icon-account-delete-btn"></div></div>
    `
    document.querySelector('.accounts').appendChild(div);
}

function headplayer(pseudo) {
    document.querySelector(".player-head").style.backgroundImage = `url(https://mc-heads.net/avatar/${pseudo}/100)`;
}