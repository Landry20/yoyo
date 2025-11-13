# YoYo Backend API

API REST Laravel 11 pour l'application YoYo.

## Installation

### Prérequis

- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js (pour les assets)

### Étapes d'installation

1. Installer les dépendances :
```bash
composer install
```

2. Copier le fichier d'environnement :
```bash
cp .env.example .env
```

3. Générer la clé d'application :
```bash
php artisan key:generate
```

4. Configurer la base de données dans `.env` :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yoyo
DB_USERNAME=root
DB_PASSWORD=
```

5. Générer la clé JWT :
```bash
php artisan jwt:secret
```

6. Exécuter les migrations :
```bash
php artisan migrate
```

7. Créer le lien symbolique pour le stockage :
```bash
php artisan storage:link
```

8. Démarrer le serveur :
```bash
php artisan serve
```

L'API sera accessible sur `http://localhost:8000`

## Structure de l'API

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur actuel
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir le token

### Utilisateurs

- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détails d'un utilisateur
- `PUT /api/users` - Mettre à jour le profil
- `POST /api/users/{id}/follow` - Suivre/Ne plus suivre un utilisateur
- `GET /api/users/{id}/followers` - Liste des abonnés
- `GET /api/users/{id}/following` - Liste des abonnements

### Posts

- `GET /api/posts` - Liste des posts
- `POST /api/posts` - Créer un post
- `GET /api/posts/{id}` - Détails d'un post
- `PUT /api/posts/{id}` - Mettre à jour un post
- `DELETE /api/posts/{id}` - Supprimer un post
- `POST /api/posts/{id}/like` - Liker/Unliker un post

### Lives

- `GET /api/lives` - Liste des lives actifs
- `POST /api/lives` - Démarrer un live
- `POST /api/lives/{id}/end` - Terminer un live

### Commentaires

- `GET /api/posts/{postId}/comments` - Liste des commentaires
- `POST /api/posts/{postId}/comments` - Ajouter un commentaire
- `PUT /api/posts/{postId}/comments/{id}` - Modifier un commentaire
- `DELETE /api/posts/{postId}/comments/{id}` - Supprimer un commentaire
- `POST /api/posts/{postId}/comments/{id}/like` - Liker un commentaire

### Messages

- `GET /api/messages` - Liste des conversations
- `GET /api/messages/{userId}` - Messages avec un utilisateur
- `POST /api/messages` - Envoyer un message
- `DELETE /api/messages/{id}` - Supprimer un message
- `POST /api/messages/{id}/read` - Marquer comme lu

### Paramètres

- `GET /api/settings` - Récupérer les paramètres
- `PUT /api/settings` - Mettre à jour les paramètres

## Format de réponse

Toutes les réponses suivent ce format :

```json
{
  "success": true,
  "message": "Message optionnel",
  "data": {}
}
```

En cas d'erreur :

```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": {}
}
```

## Authentification

L'API utilise JWT (JSON Web Tokens). Inclure le token dans l'en-tête :

```
Authorization: Bearer {token}
```

## Sécurité

- Toutes les routes (sauf `/auth/register` et `/auth/login`) nécessitent une authentification
- Les mots de passe sont hashés avec bcrypt
- Les fichiers uploadés sont validés et stockés de manière sécurisée
- CORS est configuré pour permettre les requêtes depuis l'application mobile

## Stockage des fichiers

Les fichiers sont stockés dans `storage/app/public`. Pour accéder aux fichiers via HTTP, créer un lien symbolique :

```bash
php artisan storage:link
```

Les fichiers seront accessibles via `/storage/{path}`.

## Tests

```bash
php artisan test
```

