# 📋 Pense-Bête : Gestion des News par Instance

## 🎯 Options d'affichage disponibles

### **1. News pour UNE instance spécifique**
```json
{
    "title": "🚀 Mise à jour Continuum",
    "content": "Nouveau contenu disponible sur Continuum !",
    "author": "DorianCarriere",
    "publish_date": "2025-08-09",
    "instance": "continuum"
}
```
**Résultat** : Visible uniquement sur l'instance "continuum"

---

### **2. News pour PLUSIEURS instances spécifiques**
```json
{
    "title": "🎮 Event Multi-Serveurs",
    "content": "Participez à l'event sur les serveurs Survie et Créatif !",
    "author": "DorianCarriere", 
    "publish_date": "2025-08-09",
    "instance": ["survie", "creatif"]
}
```
**Résultat** : Visible sur les instances "survie" ET "creatif" uniquement

---

### **3. News GLOBALE (toutes les instances)**
```json
{
    "title": "🔧 Maintenance Serveur",
    "content": "Maintenance programmée dimanche 14h",
    "author": "DorianCarriere",
    "publish_date": "2025-08-09", 
    "instance": "global"
}
```
**Résultat** : Visible sur TOUTES les instances (Accueil, continuum, survie, etc.)

---

### **4. News d'ACCUEIL uniquement**
```json
{
    "title": "👋 Bienvenue sur Haiko !",
    "content": "Découvrez nos serveurs dans le launcher",
    "author": "DorianCarriere",
    "publish_date": "2025-08-09"
}
```
**Résultat** : Visible UNIQUEMENT sur l'écran d'accueil (pas de champ `instance`)

---

### **5. News visible sur Accueil + Instance spécifique**
```json
{
    "title": "🌟 Nouveau Serveur Continuum",
    "content": "Découvrez notre nouveau serveur technique !",
    "author": "DorianCarriere",
    "publish_date": "2025-08-09",
    "instance": ["Accueil", "continuum"] 
}
```
**Résultat** : Visible sur l'écran d'accueil ET sur l'instance continuum

---

### **6. News ÉPINGLÉE (priorité maximale)**
```json
{
    "title": "📌 URGENT - Maintenance Serveur",
    "content": "Maintenance d'urgence ce soir !",
    "author": "DorianCarriere",
    "publish_date": "2025-08-09",
    "instance": "global",
    "pinned": true
}
```
**Résultat** : 
- Affichée **EN PREMIER** (au-dessus de toutes les autres)
- **Badge doré animé** avec épingle 📌
- **Bordure dorée** et effet lumineux
- **Animation au survol**

---

## 🎨 Exemples de combinaisons

### **News pour 3 instances spécifiques**
```json
"instance": ["continuum", "survie", "creatif"]
```

### **News pour Accueil + plusieurs instances** 
```json
"instance": ["Accueil", "continuum", "survie"]
```

### **News pour toutes les instances sauf Accueil**
```json
"instance": "global"
```
(Elle apparaîtra partout, y compris Accueil)

---

### **News épinglée sur instance spécifique**
```json
"instance": "continuum",
"pinned": true
```

### **News épinglée globale (visible partout)**
```json
"instance": "global", 
"pinned": true
```

---

## 📊 Récapitulatif des règles

| Type de news | Champ `instance` | Champ `pinned` | Où elle s'affiche |
|--------------|------------------|----------------|-------------------|
| **Accueil seul** | *(absent)* | `false/absent` | Accueil uniquement |
| **Une instance** | `"continuum"` | `false/absent` | Instance continuum uniquement |
| **Plusieurs instances** | `["survie", "creatif"]` | `false/absent` | Instances survie ET creatif |
| **Globale** | `"global"` | `false/absent` | Partout (toutes instances) |
| **Accueil + Instance** | `["Accueil", "continuum"]` | `false/absent` | Accueil ET continuum |
| **ÉPINGLÉE globale** | `"global"` | `true` | Partout EN PREMIER avec badge |
| **ÉPINGLÉE instance** | `"continuum"` | `true` | Instance continuum EN PREMIER |

---

## ⚠️ Important à retenir

1. **Nom exact** : Le nom dans `instance` doit correspondre EXACTEMENT au nom de l'instance dans le launcher
2. **Casse sensible** : "Accueil" ≠ "accueil"  
3. **Global** : Mot-clé spécial qui affiche sur toutes les instances
4. **Tableau** : Utiliser `[]` pour plusieurs instances
5. **String** : Utiliser `""` pour une seule instance
6. **Épinglage** : `"pinned": true` fait apparaître la news EN PREMIER avec badge doré
7. **Ordre d'affichage** : Épinglées d'abord, puis par date (plus récent en premier)

---

## 🔧 Pour tester localement

Modifiez le fichier `news-launcher/news.json` avec vos exemples, puis testez dans le launcher en changeant d'instance !