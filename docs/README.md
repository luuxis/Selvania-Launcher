<p align="center"><img src="../src/assets/images/icon.png" alt="icon-launcher" width="128"></p>

<h1 align="center">Haiko-Launcher</h1>

<p align="center">
  <strong>Lanceur Minecraft officiel pour le serveur Haiko</strong><br>
  Basé sur Electron avec authentification Microsoft et support multi-versions
</p>

<p align="center">
  <img src="https://img.shields.io/github/release/FurTorie/Haiko-Launcher.svg" alt="Release">
  <img src="https://img.shields.io/github/downloads/FurTorie/Haiko-Launcher/total.svg" alt="Downloads">
  <img src="https://img.shields.io/github/license/FurTorie/Haiko-Launcher.svg" alt="License">
</p>

## ✨ Fonctionnalités

### 🔐 Authentification
- **Authentification Microsoft** - Connexion sécurisée avec votre compte Microsoft/Mojang
- **Gestion multi-comptes** - Basculez facilement entre plusieurs comptes
- **Sauvegarde locale** - Vos comptes sont stockés localement en sécurité

### 🎮 Support Multi-Versions
- **Minecraft Vanilla** - Toutes les versions officielles
- **Forge** - Support complet des mods Forge
- **NeoForge** - Dernière version du loader NeoForge
- **Fabric** - Mods légers et performants
- **Quilt** - Alternative moderne à Fabric

### 🚀 Fonctionnalités Avancées
- **Installation automatique de Java** - Le launcher installe automatiquement la bonne version de Java
- **Mises à jour automatiques** - Restez toujours à jour sans intervention
- **Interface moderne** - Design épuré avec thèmes clair/sombre
- **Optimisé pour Haiko** - Configuration pré-établie pour le serveur Haiko

### 🎨 Interface
- **Thèmes dynamiques** - Mode clair et sombre avec fonds personnalisés
- **Rendu des skins** - Visualisation 3D de votre skin Minecraft
- **Panneau de news** - Restez informé des dernières actualités du serveur
- **Configuration avancée** - Paramètres détaillés pour optimiser votre expérience

## 📥 Installation

1. Téléchargez la dernière version depuis [Releases](https://github.com/FurTorie/Haiko-Launcher/releases)
2. Exécutez l'installateur pour votre plateforme :
   - **Windows** : `Haiko-Launcher-win-x64.exe`
   - **macOS** : `Haiko-Launcher-mac-universal.dmg`
   - **Linux** : `Haiko-Launcher-linux-x64.AppImage`
3. Connectez-vous avec votre compte Microsoft
4. Sélectionnez votre instance Minecraft et jouez !

## 🛠️ Développement

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation
```bash
git clone https://github.com/FurTorie/Haiko-Launcher.git
cd Haiko-Launcher
npm install
```

### Commandes
```bash
# Démarrer en mode développement
npm start

# Mode développement avec rechargement automatique
npm run dev

# Construire pour la production
npm run build

# Générer les icônes
npm run icon
```

## 🏗️ Architecture

- **Frontend** : HTML/CSS/JavaScript avec interface moderne
- **Backend** : Electron avec Node.js
- **Base de données** : SQLite pour le stockage local
- **Authentification** : minecraft-java-core pour Microsoft Auth
- **Build** : Système de build personnalisé avec obfuscation JavaScript

## 📝 Crédits

Ce projet est un fork de [Selvania-Launcher](https://github.com/luuxis/Selvania-Launcher) par luuxis.

Développé avec ❤️ pour la communauté Haiko.

## 📄 Licence

Ce projet est sous licence Luuxis License v1.0. Voir le fichier [LICENSE](https://github.com/FurTorie/Haiko-Launcher/blob/master/LICENSE.md) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug
- Proposer de nouvelles fonctionnalités
- Soumettre une pull request

## 📞 Support

Besoin d'aide ? Rejoignez notre communauté :
- Discord Haiko
- Issues GitHub

---

<p align="center">Made with ❤️ for Haiko Community</p>
