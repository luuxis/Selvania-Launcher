# Comment metre un serveur web en place avec Apache et php

## Windows

Pour metre en place une machine virtuel avec Debian(Linux) regarder ce [Tuto](https://www.youtube.com/watch?v=nMqaWBs23EU)

## SSH

Pour ce connecter a notre serveur nous allons utiliser ssh, sur le plus part des ordinateurs ssh est déjà installer.

Pour tester si ssh est installé execute ssh dans un terminal : ![image](https://user-images.githubusercontent.com/72615320/178968615-80b29d82-4bec-4143-b845-bdeba9510f88.png)

Si vous avez ceci comme reponse ssh est installé

### Comment installé ssh sur Windows (10 - 11)?

Aller dans parametres -> Applications -> Functionallité Facultative, puis cliquer sur ajouté une Functionallité Facultative. Cherche Client openSSH. Un redemarrage serais surment demander.


## Ce connecter 

Pour ce connecté on va ouvrir un nouveau terminal et on va tappé 'ssh <votre nom d'utilisateur>@localhost' (Si votre serveur n'est pas dans un machine virtuelle changer localhost par l'ip de votre serveur)

Puis entrer le mot de passe (Il est totalement normal de ne pas voir ce qu'on ecrit).

Vous etes connecté!

## Configurer le serveur.

Maintenant que vous etes connecté au serveur nous allons pouvoir installer apache2 et php.

La premiere chose a faire c'est d'executer `sudo apt update` puis `sudo apt upgrade` pour metre a jour votre systéme.

Une fois ceci fait nous allons installer apache2 avec php.

Executé la commande `sudo apt install apache2 php`

Voila vous avez installé votre serveur web apache avec php!

## Plus d'info

Maintenant seule vous et les personne connecté a votre reseau peuvent ce connecté a votre site web, donc le launcher ne pourais qu'etre utiliser dans le même reseau que votre serveur.

Pour permetres de laisse tout le monde ce connecté a votre site web vous devez ouvrir des port sur votre box wifi

ATTENTION! : Ouvrir des port sur votre box wifi ouvre des breches de securité, peu de chance que des personne mal attentioné vous prene pour cible mais le risque est toujours la! 

Pour ouvrir des port regarder ce [Tuto](https://www.youtube.com/watch?v=qp7Jgj0FSnk) pour http le port par defaut est 80 et pour https le port par defaut est 443 et le protocole est TCP
