# YoYo Mobile App

Application mobile React Native pour iOS et Android.

## Prérequis

- Node.js 18+
- npm ou yarn
- React Native CLI
- Android Studio (pour Android)
- Xcode (pour iOS, macOS uniquement)

## Installation

1. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

2. Pour iOS, installer les pods :
```bash
cd ios && pod install && cd ..
```

3. Configurer l'URL de l'API dans `src/services/apiService.ts` :
```typescript
const API_BASE_URL = 'http://votre-api.com/api';
```

## Développement

### Android

```bash
npm run android
# ou
yarn android
```

### iOS

```bash
npm run ios
# ou
yarn ios
```

## Structure du projet

```
frontend/
├── src/
│   ├── screens/          # Écrans de l'application
│   │   ├── auth/        # Authentification
│   │   ├── feed/        # Fil d'actualité
│   │   ├── messages/    # Messagerie
│   │   ├── profile/     # Profils
│   │   ├── settings/   # Paramètres
│   │   └── live/        # Lives
│   ├── store/           # Gestion d'état (Zustand)
│   ├── services/        # Services API
│   └── utils/           # Utilitaires
├── App.tsx              # Point d'entrée
└── package.json
```

## Fonctionnalités

### Authentification
- Inscription
- Connexion
- Gestion du token JWT
- Déconnexion

### Réseau social
- Fil d'actualité avec vidéos et images
- Publication de contenu
- Likes et commentaires
- Mode anonyme pour les commentaires
- Lives interactifs

### Messagerie
- Conversations en temps réel
- Envoi de texte, images, vidéos, audio
- Messages auto-destructeurs
- Mode anonyme

### Confidentialité
- Blocage des captures d'écran
- Paramètres de visibilité
- Mode anonyme
- Contrôle de la confidentialité

### Notifications
- Notifications push (Firebase Cloud Messaging)
- Notifications de messages
- Notifications de commentaires
- Notifications d'abonnements

## Configuration Firebase

1. Créer un projet Firebase
2. Ajouter les fichiers de configuration :
   - `android/app/google-services.json` (Android)
   - `ios/GoogleService-Info.plist` (iOS)
3. Configurer les clés dans `.env` :
```
FCM_SERVER_KEY=votre_cle_serveur
FCM_SENDER_ID=votre_sender_id
```

## Build de production

### Android

```bash
cd android
./gradlew assembleRelease
```

### iOS

```bash
cd ios
xcodebuild -workspace YoYo.xcworkspace -scheme YoYo -configuration Release
```

## Dépannage

### Erreurs de dépendances natives

```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
cd ios && pod install && cd ..
```

### Erreurs Metro

```bash
npm start -- --reset-cache
```

## Notes

- Le blocage des captures d'écran nécessite des modules natifs personnalisés
- Les notifications push nécessitent une configuration Firebase complète
- Le streaming live nécessite une intégration avec un service de streaming (ex: Agora, Twilio)

