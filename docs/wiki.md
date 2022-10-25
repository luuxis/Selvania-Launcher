# Guide d'utilisation du launcher

## 1. Installation

___

### 1.1. Pré-requis

#### - Pour commecer il est impératif de faire un fork du projet. **Si vous ne le faites pas vous ne respecterez pas les conditions d'utilisation.**

#### - Il faut installer les logiciels suivants pour pouvoir commencer à editer le launcher :

- [Github Desktop](https://desktop.github.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) **⚠️ Prendre la version LTS**

#### - Un serveur web sous apache et php fonctionnel ⚠️ **Obligatoire pour démarrer le launcher**

___

### 1.2. Faire un Fork du projet :

Pour commencer vous devez faire un fork du projet pour ce faire rendez vous [ici](https://github.com/luuxis/Selvania-Launcher).

- Ensuite cliquez sur "Fork" :

![Créer un fork](./images/Fork.png)

- Entrez les informations voulues et cliquez sur "Create fork" et décochez bien "copy master branch only" :

![Entrer les infos de votre fork](./images/Fork-info.png)

___

### 1.3. Faire un clone : 

#### **⚠️ Veuillez vous connecter à votre compte github sur github desktop avant de continuer !** Pour ce faire cliquez sur le bouton suivant :

![Se connecter à discord](./images/Login-github.png)

- Vous devriez arriver sur cette page qui devrait ouvrir votre navigateur pour vous connecter automatiquement une fois l'oppération terminée cliquez sur "finish" :

![Se connecter à github](./images/githublogin.png)

- Une fois connecté vous devriez tomber sur cette page Cliquez sur votre fork qui devrait apparaitre sur la liste de droite puis cliquez sur "clone" :

![Cloner le projet depuis Github](./images/openfork.png)

- Choisissez bien l'endroit ou vous souhaitez placer le projet sur votre ordinateur et cliquez sur "Clone" :

![Choisir l'emplacement du projet](./images/clone_path.png)

- Patientez quelques secondes le temps de télécharger le projet sur votre ordinateur.

![Clonage en cours...](./images/loading.png)

- Une fois le projet téléchargé, cliquez sur "For my own purposes" puis sur "Continue" :

![Choisisez l'usage](./images/usage.png)

- Pour finir cliquez sur "Open in Visual Studio Code" :

![Ouvrez le projet dans votre IDE](./images/openvisual.png)

- Vous pouvez maintenant commencer à editer le launcher !

![Vois voilà prêt](./images/visualstudiofirstopen.png)

___
## 2. Environnement

### 2.1. Mise en place du terminal

- Pour continuer nous allons ouvrir le terminal pour ce faire cliquez sur "Terminal" -> "Nouveau terminal" :

![Ouvrir le terminal](./images/newtermianl.png)

- Une fois le terminal ouvert, Cliquez sur la petite flèche à coté du + puis sur "Sélectionner le profile par défault" :

![Sélectionner le profile par défault](./images/profilecmd.png)

- Une fenêtre s'ouvre, cliquez sur "Command Prompt" :

![Sélectionner le profile par défault](./images/cmd.png)

___

### 2.2. Installation des derniers modules

- Une fois le terminal ouvert il faut installer les modules du projet pour ce faire veuillez exécuter la commande suivante :

```console
  npm install               // Installation des modules
```

- Pour vérifer que tout fonctionne bien veuillez exécuter la commande suivante :

```console
  npm start                 // Lance le launcher (veuillez vérifiez que le launcher se lannce bien) 
```

- Pour information : Voici les commandes disponible
```console
  npm run dev               // Démarrer la version de développement du launcher
  npm start                 // Lance le launcher
```

___
### 2.3. Précisions

- Si vous vous y connaissez un peu vous vous demandez sûrement "pourquoi ils n'ont pas mis npm run build dans les commandes disponibles ?" C'est simple pour compiler le launcher vous devez passer aubligatoirement par github (nous allons vous expliquer la procédure à suivre plus bas dans la documentation).

- Je vous conseille d'activer l'enregistrement automatique pour ce faire cliquez sur "Fichier" -> "Enregistrement automatique" en exécutant npm run dev cela aura pour effet de relancer le launcher à chaque modification pour vérifier si ce que vous avez fait fonctionne et cela permtra également à éviter de perdre les modifications si visual studio crash par exemple.

___
## 3. Le serveur web

Pour que le launcher puisse fonctionner il faut mettre en place un serveur web sous apache et php fonctionnel.

Cette étape est importante car elle est essentielle pour que le launcher puisse fonctionner.
Pour ce faire vous devez poséder soit une machine chez vous qui tourne 24h/24 pour héberger le serveur web, soit un serveur dédié (un serveur que vous louez chez un hébergeur).
___

## ⚠️ ATTENTION !
**Cette partie est compliquée nous vous conseillons de savoir ce que vous faites avant de continuer !**

**Si vous n'avez pas les compétences nécessaires pour mettre en place le serveur web le configurer ou si vous n'avez pas de machine sous la main pouvant tourner 24h/24 pour héberger votre serveur web nous vous conseillons la solution facile et clée en main de luuxis spécialement faite pour le launcher plus d'informations [ici](https://dev.luuxis.fr/) .**

Avant de continuer nous considèrerons que : 

- Vous avez un serveur local ou distant sous windows ou linux
- Que vous savez vous connecter en ssh à votre serveur
- Que vous connaissez l'adresse IP locale et publique de votre serveur
- Que vous savez comment faire une redirection de port sur votre serveur
- Que vous save mettre des fichiers sur votre serveur

Si vous n'avez / ne savez pas faire les choses précédentes nous vous invitons à chercher sur internet. Aucun support ne sera fourni pour ceci.

___
### 3.1. Installation du serveur web sous linux

#### 3.1.1. Pré-requis

Pour suivre ce guide, vous avez besoin des choses suivantes :
- Un serveur sous linux (ubuntu, debian, etc.)
- Avoir un accès direct ou en ssh à votre serveur
___
#### 3.1.2. Installer Apache

- Connectez-vous en SSH à votre serveur, puis mettez à jour vos packages.

```console
$ sudo apt update && sudo apt -y upgrade              # Debian/Ubuntu/Linux Mint

$ sudo dnf -y update                                  # Fedora

$ sudo pacman -Syu                                    # Arch Linux
```

- Ensuite, exécutez la commande ci-dessous pour installer le serveur Web Apache.

```console
$ sudo apt install -y apache2                         # Debian/Ubuntu/Linux Mint

$ sudo dnf install httpd-manual                       # Fedora

$ sudo pacman -S apache                               # Arch Linux
```

- Visitez l'URL ci-dessous sur un navigateur Web et remplacez 192.0.0.1 par l'adresse IP de votre serveur. (nous suposons que votre serveur est en local si non vous devez entrer l'aderesse IP de votre serveur distant que vous devez déjà connaitre)
```console
http://192.0.0.1/
```

Vous devriez voir la page Web Apache par défaut comme indiqué ci-dessous. Bravo ! Vous avez réussi à installer Apache !

![Sélectionner le profile par défault](./images/default_apache_web_page.png)

Après avoir configuré le serveur Web nous allons devoir installer PHP.
___
#### 3.1.3. Installer PHP

- Dans cette étape, vous allez installer le package PHP. Pour ce faire exécutez la commande ci-dessous.

```console
$ sudo apt install -y php                             # Debian/Ubuntu/Linux Mint

$ sudo dnf install php                                # Fedora

$ sudo pacman -S php                                  # Arch Linux
```

- Redémarrez le serveur Web Apache pour charger PHP.

```console
$ sudo systemctl restart apache2                      # Debian/Ubuntu

$ sudo /etc/init.d/apache2 restart                    # Linux Mint

$ sudo systemctl restart httpd.service                # Fedora

$ sudo systemctl restart httpd                        # Arch Linux
```
- Vous pouvez toujours vérifier que apache est fonctionnel en vérifaint son statut en exécutant la commande ci-dessous. (ctrl + c pour quitter)


```console
$ sudo systemctl status apache2                       # Debian/Ubuntu/Linux Mint

$ sudo systemctl status httpd.service                 # Fedora

$ systemctl status httpd                              # Arch Linux
```

- Pour tester PHP, créez un fichier info.php dans le répertoire racine de votre serveur Web.

```console
$ sudo nano /var/www/html/info.php                    # Debian/Ubuntu/Linux Mint

$ sudo dnf -y install nano                            # Fedora/Arch Linux
$ sudo nano /var/www/html/info.php                    # Fedora/Arch Linux
```

- Ensuite, entrez les informations ci-dessous dans le fichier.

```php
<?php
phpinfo();
?>
```
- Enregistrez et fermez le fichier en appuyant sur CTRL + X, puis Y et ENTER. Ensuite, dans un navigateur Web, Visitez l'URL ci-dessous sur un navigateur Web et remplacez 192.0.0.1 par l'adresse IP de votre serveur. (nous suposons que votre serveur est en local si non vous devez entrer l'aderesse IP de votre serveur distant que vous devez déjà connaitre)

```console
http://192.0.0.1/info.php
```	

Vous devriez obtenir une page PHP détaillée comme indiqué ci-dessous.

![Sélectionner le profile par défault](./images/php_info_page.png)

Bravo ! Vous avez réussi à installer PHP !
___

### 3.2. Installation du serveur web sous windows

#### 3.2.1. Pré-requis

Pour suivre ce guide, vous avez besoin des choses suivantes :
- Un serveur / ordinateur sous windows (Windows 11, Windows 10, etc.)
- Avoir un accès direct ou à distance à votre serveur / ordinateur

___
#### 3.2.2. Installer Apache

Le premier obstacle à l'installation d'Apache sur Windows est que vous ne pouvez pas télécharger les fichiers binaires d'installation directement depuis apache.org. Vous devez cloner et compiler vous-même le code source du serveur HTTP Apache ou télécharger le support d'installation Apache 2.4 d'un tiers.

- Un téléchargement tiers des fichiers binaires est certainement le moyen le plus simple de procéder. C'est pour cela que je vous invite à vous rendre sur le site [apachelounge.org](https://www.apachelounge.com/download/) et à cliquer sur le lien entouré si dessous (2) pour télécharger le support d'installation Apache 2.4.
Vous devez également télécharger Visual C++ Redistributable Visual Studio 2015-2022 pour cela cliquez sur le lien entouré en rouge (1). Installer Visual C++ Redistributable Visual Studio 2015-2022 pour cela exécutez le programme téléchargé, acceptez les termes d'utilisation et cliquez sur le bouton Installer. Windows vous demander les permissions administrateur cliquez sur le bouton OK.

![Sélectionner le profile par défault](./images/apachewindowsdownload.png)
![Sélectionner le profile par défault](./images/visualc++.png)

- Pour commencer veuillez extraire le fichier zip téléchargé.
- Déplacer le dossier Apache24 dans le répertoire racine ("C:\ ") de votre ordinateur.
- Allez dans le répertoire "C:\Apache24\conf" et ouvrez le fichier "httpd.conf".
- Recherchez (ctrl + f) la ligne suivante : "#ServerName www.example.com:80"
- Retirez le # et sauvegardez le fichier.
- Faites Win + r et entrez ceci "C:\Windows\System32\systempropertiesadvanced.exe" et cliquez sur entrer.
- Cliquez dans "Variable d'environnement..." et sélectionnez "Path" cliquez sur "modifier" puis cliquez sur "Nouveau" et entrez "C:\Apache24\bin" et cliquez sur OK.
- Redémarrez votre ordinateur.
- Ouvrez l'invite de commande (windows + R) et entrez cmd puis cliquez sur Ctrl + Shift + entrée windows va vous demander les droit administrateurs cliquez sur "Ok".
- Entrez les commandes suivante :

```console
> path                   # Plein de choses vont s'afficher ce sont les variables d'environnement si vous voyez "C:\Apache24\bin" c'est que vous avez bien fait l'étape précédente.
> httpd -k install        # Installation du serveur web Apache
> httpd -k start          # Démarrage du serveur web Apache
```
Si des erreurs apparaissent, essayez de les corriger en cherchant sur internet. Pour vérifier que apache fonctionne bien faites Ctrl + shift + echap et allez dans l'onglet services vous devriez voir apache 2.4

- Rendez vous à l'adresse http://localhost:80 pour vérifier l'installation.
- Si vous voyez écrit "It works!" c'est que Apache est installé et fonctionnel.

___
#### 1.2.3. Installer PHP

- Pour installer PHP rendez vous à l'adresse [https://windows.php.net/download/](https://windows.php.net/download/)
- Cliquez sur le lien "Zip" Thread safe pour télécharger le fichier zip
- Pour commencer veuillez extraire le fichier zip téléchargé.
- Une extrait renommer le dossier en "php"
- Déplacez le dossier "php" dans le répertoire racine ("C:\ ") de votre ordinateur.
- Faites Win + r et entrez ceci "C:\Windows\System32\systempropertiesadvanced.exe" et cliquez sur entrer.
- Cliquez dans "Variable d'environnement..." et sélectionnez "Path" cliquez sur "modifier" puis cliquez sur "Nouveau" et entrez "C:\php" et cliquez sur OK.
- Redémarrez votre ordinateur.
- Entrez les commandes suivante :

```console
> path                   # Plein de choses vont s'afficher ce sont les variables d'environnement si vous voyez "C:\php" c'est que vous avez bien fait l'étape précédente.
> php -v                 # Vérifier la version de PHP
```
Si php -v fonctionne vous avez bien installé PHP. Maintenant il faut mettre en relalation php avec Apache.

- Allez dans le répertoire "C:\Apache24\conf" et ouvrez le fichier "httpd.conf".
- Rendez vous à la fin du documet et ajoutez les liens suivantes :

```console
LoadModule php_module "C:\php\php8apache2_4.dll"
AddHandler application/x-httpd-php .php
PHPIniDir "C:\php"
```

- Sauvegardez le fichier.
- Rendez vous dans le répertoire "C:\php" vous verrez deux fichiers "php.ini-development" et "php.ini-production".
- Copiez et collez le fichier "php.ini-development" dans le répertoire "C:\php"
- Renommez le fichier "php - Copie.ini-development" en "php.ini"
- Ouvrez l'invite de commande (windows + R) et entrez cmd puis cliquez sur Ctrl + Shift + entrée windows va vous demander les droit administrateurs cliquez sur "Ok".
- Entrez les commandes suivante :

```console
> httpd -t              # Vérifier la configuration du serveur web Apache. Si vous voyez "Syntax OK" c'est que vous avez bien configuré Apache. Sinon il y a un problème dans votre configuration. Recherchez l'erreur sur internet et corrigez la.
> httpd -k restart       # Redémarrage du serveur web Apache
```
- Pour vérifier que apache fonctionne bien faites Ctrl + shift + echap et allez dans l'onglet services vous devriez voir apache 2.4

- Allez dans le répertoire "C:\Apache24\htdocs" (c'est le répertoire où se trouve les fichiers de votre site) et créez un fichier "info.php" avec le contenu suivant :

```php
<?php
phpinfo( );
?>
```

- Enregistrez le fichier et rendez vous sur l'adresse http://localhost:80/info.php pour vérifier l'installation.

- Vous devriez voir une page comme ceci :

![Sélectionner le profile par défault](./images/php_info_page.png)
___
### 3.3. Mise en place du backend du launcher

Maintenant que le serveur web est installé et fonctionnel, il faut maintenant installer le backend du launcher. Pour ce faire, rendez vous sur le [la branche web du projet](https://github.com/luuxis/Selvania-Launcher/tree/WEB-Folder). 

- Cliquez sur le bouton "Code" et sur "Download ZIP"
- Une fois le fichier zip téléchargé, extraitez le fichier zip.
- Déplacez les dossiers / fichiers "files", "launcher" et ".htaccess" dans le répertoire "C:\Apache24\htdocs" pour windows et dans le répertoire "/var/www/html/" pour linux.
- Voici le résultat attendu après avoir mis en place le serveur web et avoir accédé à votre site (soit localhost soit l'adresse IP de votre serveur) :

![Sélectionner le profile par défault](./images/serverwebfinal.png)

Depuis le fichier situé dans le dossier web /launcher/config-launcher/config.json vous allez pouvoir gérer plusieurs paramètres du launcher.

![Sélectionner le profile par défault](./images/config.png)

- maintenance : `true/false` Cette option permet de désactiver le launcher pour tout le monde en cas de maintenance.
- maintenance_message : `Désolé le launcher est en maintencance` Cette option permet de définir le message qui sera affiché aux utilisateur du launcher lorsque il est en maintenance.
- online : `true/false` Cette option permet d'autoriser ou non les comptes cracké à se connecter au launcher.
- client_id : Cette option permet de définir le client id du microsoft account
- game_version : `1.19.2` Cette option définit la version du jeu que le launcher va utiliser poour démarrer minecraft.
- modde : `true/false` Cette option si activée permet de télécharger les fichiers du jeu présent sur le serveur sur le pc de l'utilisateur obligatoire pour proposer un jeu moddé depuis le launcher.
- verify : `true/false` Cette option indique au launcher si il dois vérifier qu'aucun fichier du jeu n'ai été ajouté, supprimé ou modifié par rapport aux fichiers présents sur le serveur si oui il retéléchargera le jeu peut servir de pseudo anti-cheat
- java : `true/false` indique si le launcher dois télécharger java depuis les serveurs de mojang, utile pour s'assurer que les utilisateurs du launcher ont un java compatible **Recommandé**
- game_args : ajouter des arguments personnalisés supplémentaires pour lancer le jeu
- dataDirectory : `Minecraft`  Cette option permet de définir le répertoire dans lequel votre jeu va se télécharger. Ne pas mettre de point il sera rajouté automatiquement si besoin.
- ignored : `logs`Cettte option permet de white-list les fichiers qui ne seront pas vérifiés par "vérify".
- status : Cette section permet de définir quel serveur sera affiché dans le launcher.
- nameserver : `Craftlaunch Serveur` Cette option permet de définir le nom de serveur qui sera affiché dans le launcher.
- ip : `123.546.789` Cette option permet de définir l'adresse IP du serveur qui sera affiché dans le launcher.
- port : `25565` Cette option permet de définir le port du serveur qui sera affiché dans le launcher.

Une fois la configuration côté serveur web faite, il faut configurer le launcher pour indiquer l'URL où aller chercher les fichiers sur serveur web. Pour ce faire changez l'url souligné ci-dessous dans le fichier package.json par l'URL de votre serveur web.

![Sélectionner le profile par défault](./images/serverpath.png)

___
### 3.4. Démarrage

Bravo ! Si vous êtes arrivé jusqu'ici, vous avez bien installé et configuré tout ce qu'il faut pour pouvoir modifier et utiliser le launcher.

Arrivée à cette étape, vous devrez pourvoir executer le launcher en local pour vérifier que votre installation fonctionne.
Depuis un terminal vous pouvez taper la commande suivante si le launcher se lance bien avec les paramètres entrés sur le serveur web alors tout est bon :

```console
npm run dev
  ```

Si vous souhaiter modifier le launcher, changer les images, les textes, etc vous pouvez désormais le faire !
A noter que le launcher est une application web donc il faut avoir quelques bases en HTML/CSS pour modifier l'apparence et texte, et avoir des bases en Javascript pour modifier les fonctionnalitées.

___
## 4. Compilation

### 4.1. Préparation

- Avant de compiler le launcher nous allons finir de personnaliser le launcher. Pour ce faire rendez-vous dans le fichier package.json.

![Sélectionner le profile par défault](./images/compile.png)

Vous pouvez modifier les paramètres soulignés:
- "name" : nom du launcher
- "productName" : nom du launcher
- "version" : version du launcher (⚠️ Pour compiler le launcher il faut mettre une version plus élevé que le tag le plus élevé du projet sur GitHub. Veuillez pour plus de clarifiacation choisir un format de tag sans "v" et avec 3 chiffres Ex: "1.0.0")
- "description" : description du jeu
- "author" : auteur du jeu
- url : lien du github (⚠️ Obligatoire pour l'auto update)

Voici la procédure à suivre pour récupérer le tag le plus élevé du projet GitHub :

- Se rendre sur le projet GitHub
- Aller dans l'onglet actions et cliquer sur le gros bouton vert

![Sélectionner le profile par défault](./images/understand.png)

- Cliquez sur le bouton "Master"
- Cliquez sur le bouton "tag"
- Cliquez sur le bouton "View all tags"

![Sélectionner le profile par défault](./images/tags.png)

Depuis ce menu vous pouvez voir tous les tags du projet GitHub. Trouvez le tag le plus élevé et entrez un numéto plus éleve le dans la variable "version" du fichier package.json.

![Sélectionner le profile par défault](./images/tag.png)

Voici la procédure pour récupérer le lien à mettre dans la variable "url" du fichier package.json :

- Se rendre sur le projet GitHub
- Cliquez sur le bouton "Code"
- Copier le lien en haut du menu déroulant (voir image ci-dessous)

![Sélectionner le profile par défault](./images/gitlink.png)
___
### 4.2. Compilation

- Se rendre sur le projet GitHub
- Cliquer sur release

![Sélectionner le profile par défault](./images/relase.png)

- Cliquer sur "Draft a New release"

![Sélectionner le profile par défault](./images/draft.png)

- Cliquez sur "Choose tag" puis entrez **le même tag** que celui entré dans le fichier package.json puis cliquez sur "Create new tag"

![Sélectionner le profile par défault](./images/createtag.png)

- Remplir les autres titres puis cliquez sur "Save draft"

![Sélectionner le profile par défault](./images/savedraft.png)

- Ouvrez Github Desktop

- Dans la liste à goauche (voir screenshot ci-dessous) vous pouvez voir les fichiers modifiés. Pour envoyer les fichiers sur github entrez une dectiption pour la mise a jour dans le champ souligné puis cliquez sur "Commit to main"

![Sélectionner le profile par défault](./images/push.png)

- Une fois ceci fait cliquez sur "Push origin"

![Sélectionner le profile par défault](./images/push2.png)

- Après avoir push le projet sur github, vous devriez voir cela c'est github qui compile le launcher.

![Sélectionner le profile par défault](./images/build.png)
![Sélectionner le profile par défault](./images/build2.png)

- Attendez que le processus se termine (les points vont devenir vert)

- Allez dans la page des releases trouvez votre draft cliquez dessus et cliquez sur "Publish release"

Bien joué ! Vous avez fini de compiler le launcher. Vous pouvez maintenant le télécharger et l'installer sur votre ordinateur depuis l'onglet releases.

___
## 5. Faq


### Quelles ont les verions de Minecraft supportées par le launcher ?
___
- Toutes les versions entre la 1.0 et la 1.19.X sont supportées.

### Les MCP sont ils supportés ?
___
- Non, le launcher ne supporte pas les MCP.

### Le launcher supporte t-il l'autoconnect ?
___
- Nous sommes contre l'autoconnect nous ne fourniront donc pas de support pour cette fonctionnalité.
- Nous conseillons en revanche d'utiliser un mod permettant d'ajouter un bouton pour se connecter.

### Pourquoi les news ne marchent pas ?
___

- Les news sont actuellement et cours de redéveloppement c'est pour cela qu'elles ne sont pas disponibles pour le moment par ailleurs il est possible de les activer pour ce faire : créer un dossier "news-launcher" dans le même répertoire que "config-launcher" sur le serveur web. Ensuite créez un fichier "news.json" puis completer le contenu du fichier avec les informations suivantes :

```json
[
    {
        "id":"",
        "title":"",
        "content":"",
        "author":"",
        "link": "",
        "publish_date":""
    }
]
```
### Comment mettre forge sur le launcher ?
___

- Allez sur le [site de forge](https://files.minecraftforge.net/net/minecraftforge/forge/) pour télécharger la version de forge correspondante à la version de Minecraft que vous utilisez.

- Allez dans votre serveur web puis allez dans "files/files" (Pas le dossier avec un fichier php mais celui encore en dessous) et créez un fichier "launcher_profiles.json" vide.

- Exécutez le programme d'installation de Forge et installez dans le même répertoire que le fichier "launcher_profiles.json" tout en choisissant "install client" puis cliquez sur "Ok"

![Sélectionner le profile par défault](./images/installforge.png)

- Bravo ! plus qu'a créer un dossier mods là ou vous avez installer forge (dans votre serveur web) pour mettre les mods que vous souhaitez et les fichiers que vous souhaitez.

### Comment mettre fabric sur le launcher ?
___

- Allez sur le [site de Fabric](https://fabricmc.net/use/installer/) pour télécharger la dernière version de Fabric.

![Sélectionner le profile par défault](./images/fabricdownload.png)

- Allez dans votre serveur web puis allez dans "files/files" (Pas le dossier avec un fichier php mais celui encore en dessous) et créez un fichier "launcher_profiles.json" vide.

- Exécutez le programme d'installation de Fabric et installez dans le même répertoire que le fichier "launcher_profiles.json" tout en choisissant votre version de minecraft désirée puis cliquez sur "Installer"

![Sélectionner le profile par défault](./images/fabricinstall.png)

- Bravo ! plus qu'a créer un dossier mods là ou vous avez installer fabric (dans votre serveur web) pour mettre les mods que vous souhaitez et les fichiers que vous souhaitez.
___

## Pour en savoir + :

Vous pouvez visionner les vidéos de Luuxis si vous voulez plus de précisions 

- [Tuto #1 Créer un launch sur Minecraft Node.JS (mise en place du projet)](https://www.youtube.com/watch?v=0lFKwP0ymsA)

- [Tuto #2 Créer un launch sur Minecraft Node.JS (Approfondissement)](https://www.youtube.com/watch?v=czDgRHznk3Q) 

- Tuto #3 ❌ En cours

Comment Faire un Port forwarding ?

- [Ouvrir les ports de sa box/routeur facilement](https://www.youtube.com/watch?v=qp7Jgj0FSnk&t=132s&ab_channel=Nathol)
___
Si vous aimez ce projet et que vous voulez aider à le développer, vous pouvez nous faire un don sur [Paypal](
https://www.paypal.me/luuxiss )

Si vous avez des questions, un problème ou des suggestions n'hésitez pas à rejoindre notre discord :

<br>

[<p align="center"><img src="https://discordapp.com/api/guilds/819729377650278420/embed.png?style=banner2" alt="discord">](https://discord.gg/e9q7Yr2cuQ) 


<br>
<br>

[<p align="center">]() *Wiki réalisé par [@Fefe_du_973](https://github.com/Fefedu973)*  </p>
