let nextStep = document.querySelector('.next-step');
nextStep.addEventListener('click', () => {
    document.querySelector('.welcome').classList.toggle('hide');
    document.querySelector('.config-database').classList.toggle('hide');
});

document.querySelector('.valide-db').addEventListener("click", async () => {
    let db = await Bdd('check_db');
    if (db.status == 'success') {
        document.querySelector('.config-database').classList.toggle('hide');
        document.querySelector('.config-user').classList.toggle('hide');
    } else {

    }
});

document.querySelector('.save-db').addEventListener("click", async () => {
    let db = await Bdd('valide_db');
    if (db.status == 'success') {
        location.reload();
    } else {
        console.log(db);
    }
});

function Bdd(type) {
    let db = fetch("assets/php/controller.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: [
            `adress=${document.querySelector('.db_ip').value}`,
            `&port=${document.querySelector('.db_port').value}`,
            `&name=${document.querySelector('.db_name').value}`,
            `&user=${document.querySelector('.db_user').value}`,
            `&password=${document.querySelector('.db_password').value}`,
            `&user_name=${SHA1(document.querySelector('.user_name').value)}`,
            `&user_password=${SHA1(document.querySelector('.user_password').value)}`,
            `&type=${type}`
        ].join(''),
    }).then(res => res.json());
    return db;
}