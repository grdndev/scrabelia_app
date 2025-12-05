# Scrabelia App

Application mobile React Native pour Scrabelia - une plateforme d'écriture et de partage de textes poétiques.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Expo CLI installé globalement : `npm install -g expo-cli`
- Un compte Expo (gratuit)

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer le serveur de développement :
```bash
npm start
```

3. Scanner le QR code avec :
   - **iOS** : L'appareil photo ou l'app Expo Go
   - **Android** : L'app Expo Go

## 📱 Structure du projet

```
scrabelia_app/
├── src/
│   ├── components/       # Composants UI réutilisables
│   │   └── ui/          # Composants de base (Button, Card, Input, etc.)
│   ├── contexts/        # Contextes React (ScribelaContext)
│   ├── navigation/      # Configuration de la navigation
│   ├── screens/         # Écrans de l'application
│   ├── theme/           # Thème (couleurs, typographie)
│   └── utils/           # Utilitaires (API, helpers)
├── App.tsx              # Point d'entrée principal
├── package.json
└── app.json             # Configuration Expo
```

## 🎨 Thème

L'application utilise un thème personnalisé avec les couleurs de Scrabelia :
- **Background** : #F9F6F1 (beige clair)
- **Primary** : #B0C4C8 (bleu-gris)
- **Secondary** : #A8B5A2 (vert sauge)
- **Accent** : #E8C27B (jaune doré)

## 📚 Fonctionnalités

- ✅ Authentification (inscription/connexion)
- ✅ Affichage des textes
- ✅ Système d'échos (likes)
- ✅ Commentaires
- ✅ Abonnements aux auteurs
- ✅ Duos (messages privés)
- ✅ Cercles de discussion
- ✅ Donations
- ✅ Sponsorships

## 🛠 Technologies utilisées

- **React Native** avec **Expo**
- **TypeScript**
- **React Navigation** (Stack & Bottom Tabs)
- **Supabase** (Backend & Auth)
- **React Context API** (State management)

## 📝 Scripts disponibles

- `npm start` - Démarrer le serveur Expo
- `npm run android` - Lancer sur Android
- `npm run ios` - Lancer sur iOS
- `npm run web` - Lancer sur le web

## 🔧 Configuration

Les variables d'environnement Supabase sont configurées dans :
- `src/utils/supabase/info.ts`

## 📄 Licence

Propriétaire - Scrabelia
