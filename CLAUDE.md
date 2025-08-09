# CLAUDE.md

Ce fichier fournit des directives à Claude Code (claude.ai/code) lors du travail avec le code de ce dépôt.

## Aperçu du Projet

Haiko-Launcher est un lanceur Minecraft basé sur Electron spécialement conçu pour le serveur Haiko. Il supporte l'authentification Microsoft, les mises à jour automatiques, l'installation automatique de Java, et plusieurs versions de Minecraft incluant les versions moddées (Forge, NeoForge, Fabric, Quilt).

## Commandes de Développement

### Commandes Principales
- `npm start` - Exécuter le lanceur en mode développement
- `npm run dev` - Exécuter avec nodemon pour des redémarrages automatiques et outils de développement ouverts
- `npm run build` - Compiler l'application avec obfuscation pour la distribution
- `npm run icon` - Générer les icônes d'application depuis une URL distante

### Options de Build
- `node build.js --obf=true --build=platform` - Compiler avec l'obfuscation JavaScript activée
- `node build.js --icon=<url>` - Définir l'icône d'application depuis une URL

## Architecture

### Structure Principale
- **Point d'Entrée**: `src/app.js` - Processus Electron principal avec gestionnaires IPC et auto-updater
- **Entrée Frontend**: `src/launcher.js` - Logique principale du lanceur et gestion des panneaux
- **Panneaux**: Trois panneaux UI principaux dans `src/panels/` et JS correspondant dans `src/assets/js/panels/`
  - `login.js/html` - Authentification Microsoft
  - `home.js/html` - Interface principale du lanceur avec lancement de jeu
  - `settings.js/html` - Configuration et gestion Java

### Composants Clés
- **Gestion des Fenêtres**: `src/assets/js/windows/` contient `mainWindow.js` et `updateWindow.js`
- **Utilitaires**: `src/assets/js/utils/` contient :
  - `config.js` - Récupération de configuration serveur
  - `database.js` - Gestion base de données SQLite locale
  - `logger.js` - Système de logging
  - `skin.js` - Rendu des skins Minecraft
- **Authentification**: Utilise la bibliothèque `minecraft-java-core` pour l'authentification Microsoft/Mojang
- **Mises à jour**: Gère les mises à jour automatiques via `electron-updater`

### Système de Configuration
- Configuration distante récupérée depuis `pkg.url/launcher/config-launcher/config.json`
- Base de données locale stocke les comptes utilisateurs et paramètres du lanceur
- Thématisation dynamique (clair/sombre) avec support d'images de fond

### Processus de Build
Le lanceur utilise un système de build personnalisé (`build.js`) qui :
- Obfusque les fichiers JavaScript pour la distribution
- Copie les assets et met à jour les chemins
- Génère des builds spécifiques à la plateforme en utilisant electron-builder
- Supporte la génération d'icônes personnalisées depuis des URLs

### Notes de Développement
- Le mode développement crée des répertoires de données locaux (`./data/Launcher` et `./data`)
- Utilise nodemon pour surveiller les changements dans les fichiers `.js`, `.html`, et `.css`
- La communication IPC gère la gestion des fenêtres, l'authentification, et les mises à jour
- Images de fond stockées dans `src/assets/images/background/` avec support des thèmes