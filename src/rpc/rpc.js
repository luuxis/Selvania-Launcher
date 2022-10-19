const rpc = require("custom-discord-rpc")

async function startRPC() {
    const RPC = await new rpc.ClientRPC()
    .setClientId('1031171429070278696') // Application ID in the Discord Developper Panel
    .setDetails('Serveur Pvp Faction Moddé')
    .setState('Joue à OmniversalMC')
    .setButton([{
        label: 'OmniversalMC',
        url: 'https://omniversal-mc.maltospeak.com'
    }])
    .setLargeImageKey('logo')
    .setLargeImageText("OmniversalMC")
    .setSmallImageKey('logo')
    .setSmallImageText("Joue en Solo")
    .startRpcRenderer() // To Create the RPC
}

function destroy() {
    rpc.functions.destroyRpcClient()
}

module.exports = {
    destroy,
    startRPC
}