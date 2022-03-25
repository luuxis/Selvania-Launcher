'use strict';

class Settings {
    static id = "settings";
    init() {
        document.querySelector('.accounts').addEventListener('click', (e) => {
            let uuid = e.target.id;
            console.log(uuid);
        });
    }
}
export default Settings;