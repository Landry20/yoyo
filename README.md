# 🎯 YoYo - Application Mobile Social & Messagerie Sécurisée

<div align="center">

![YoYo Logo](https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=YoYo)

**Application mobile ivoirienne combinant les fonctionnalités d'un réseau social (type TikTok) et d'une messagerie sécurisée (type WhatsApp) avec un focus sur la confidentialité et l'anonymat.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev)

</div>

## 🚀 Technologies

- **Frontend**: React Native (Android & iOS)
- **Backend**: Laravel 11 (API REST)
- **Base de données**: MySQL 8
- **Notifications**: Firebase Cloud Messaging
- **Stockage**: AWS S3 (ou équivalent)

## 📁 Structure du Projet

```
yoy/
├── backend/          # API Laravel 11
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   └── routes/
├── frontend/         # Application React Native
│   ├── src/
│   │   ├── screens/
│   │   ├── store/
│   │   ├── services/
│   │   └── utils/
│   └── App.tsx
└── README.md
```

## 🔐 Fonctionnalités Principales

### 1. Mode anonyme intelligent
- Masquer le nom, la photo et les infos personnelles lors des commentaires, messages ou lives
- Possibilité d'interagir sans révéler d'identité

### 2. Confidentialité avancée
- Blocage automatique des captures d'écran et enregistrements vidéo
- Empêche la sauvegarde ou la retransmission des médias privés
- Mode "messages auto-destructeurs"

### 3. Messagerie privée
- Envoi de texte, audio, image, vidéo, document
- Conversations cryptées (E2EE)
- Notifications en temps réel (Firebase Cloud Messaging)

### 4. Réseau social YoYo (type TikTok)
- Publication de vidéos courtes et de statuts
- Lives interactifs avec spectateurs anonymes
- Fil d'actualité à défilement vertical

### 5. Profil utilisateur flexible
- Profil public, masqué ou anonyme
- Choix de visibilité (abonnés, abonnements)
- Options de sécurité individuelles

### 6. Paramètres de confidentialité
- Masquer nom / photo / compte à tout moment
- Définir les restrictions pour messages, lives ou médias
- Mode "Confidentialité totale"

## 🛠️ Installation

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan storage:link
php artisan serve
```

### Frontend (React Native)

```bash
cd frontend
npm install
# Pour iOS
cd ios && pod install && cd ..
# Pour Android
npm run android
# Pour iOS
npm run ios
```

## 📝 Documentation API

L'API est documentée dans `/backend/README.md`

## 🔒 Sécurité

- Authentification JWT
- Chiffrement E2EE pour les messages
- Blocage des captures d'écran
- Messages auto-destructeurs
- Pare-feu applicatif
- Validation des données
- Protection CSRF

## 🎯 Prochaines étapes

- [ ] Intégration complète de Firebase Cloud Messaging
- [ ] Implémentation du streaming live (Agora/Twilio)
- [ ] Module natif pour le blocage des captures d'écran
- [ ] Chiffrement E2EE complet
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation des performances
- [ ] IA de modération
- [ ] Section "YoYo News"

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! Veuillez lire le [Guide de Contribution](CONTRIBUTING.md) pour plus d'informations.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📧 Contact & Support

Pour toute question ou suggestion, veuillez ouvrir une [issue](https://github.com/votre-username/yoyo/issues).

## 🙏 Remerciements

- Laravel Framework
- React Native Community
- Tous les contributeurs

---

<div align="center">

**Fait avec ❤️ pour la communauté ivoirienne et africaine**

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !

</div>
