<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/install.css">
    <title>install panel for news</title>
</head>
<body>
    <div class="container">
        <div class="welcome">
            <h1>Binvenue !</h1>
            <p>
                À partir de ici, 
                <br>
                on va pouvoir installer votre base de donnée, afin de pouvoir utiliser le panel pour mettre à jour les news.
            </p>
            <button class="next-step">Continue</button>
        </div>

        <div class="config-database hide">
            <h1>Configuration de la base de donnée</h1>
            
            <div class="config-database-input">
                <label>Adresse</label>
                <input type="text" class="bdd-input db_ip" spellcheck="false" placeholder="127.0.0.1" value="127.0.0.1">
                    
                <label>Port</label>
                <input type="text" class="bdd-input db_port" spellcheck="false" placeholder="3306" value="3306">
                    
                <label>Base de données</label>
                <input type="text" class="bdd-input db_name" spellcheck="false" placeholder="News">
                    
                <label>Utilisateur</label>
                <input type="text" class="bdd-input db_user" spellcheck="false" placeholder="root">
                    
                <label>Mot de passe</label>
                <input type="password" class="bdd-input db_password" spellcheck="false" placeholder="12345">
                <button class="valide-db btn-form">Valider</button>
            </div>   
        </div>

        <div class="config-user hide">
            <h1>Configuration de l'utilisateur</h1>
            <div class="config-database-input">
                <label>Nom d'utilisateur</label>
                <input type="text" class="bdd-input user_name" spellcheck="false" placeholder="admin">
                    
                <label>Mot de passe</label>
                <input type="password" class="bdd-input user_password" spellcheck="false" placeholder="12345">
                <button class="save-db btn-form">Valider</button>
            </div>
        </div>
    </div>
    <script src="./assets/js/sha1.js"></script>
    <script src="./assets/js/install.js"></script>
</body>
</html>