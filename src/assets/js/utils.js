import config from './utils/config.js';
import database from './utils/database.js';
import logger from './utils/logger.js';

export {
    config as config,
    database as database,
    logger as logger,
    changePanel as changePanel,
    addAccount as addAccount
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
    <img class="account-image" src="https://mc-heads.net/head/${data.uuid}">
    <div class="account-name">${data.name}</div>
    <div class="account-uuid">${data.uuid}</div>
    `
    document.querySelector('.accounts').appendChild(div);
}