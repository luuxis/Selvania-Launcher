<!DOCTYPE html>
<html>
<head>
	<title>Panel for news</title>
	<link rel="stylesheet" type="text/css" href="./assets/css/panel.css">
	<script src="https://kit.fontawesome.com/a81368914c.js"></script>
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<div class="container">
    <div class="login-content">
        <div class="login-form">
            <h2 class="title-login">Se connecter</h2>
            <div class="input-div one">
                <div class="i">
                    <i class="fas fa-user"></i>
                </div>
                <div class="div">
                    <h5>Utilisateur</h5>
                    <input type="text" class="input user">
                </div>
            </div>
            <div class="input-div pass">
                <div class="i">
                    <i class="fas fa-lock"></i>
                </div>
                <div class="div">
                    <h5>Mot de passe</h5>
                    <input type="password" class="input password">
                </div>
            </div>
            <small class="info-login">&nbsp;</small>
            <button class="btn-connect">Se connecter</button>
        </div>
    </div>
    <div class="news-content-tab hide">
		<button class="add-news">ajouter une news</button>
        <div class="new-list"></div>
    </div>
</div>
    <script src="./assets/js/sha1.js"></script>
    <script src="./assets/js/API.js"></script>
    <script src="./assets/js/panel.js"></script>
</body>
</html>
