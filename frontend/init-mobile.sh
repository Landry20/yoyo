#!/bin/bash

echo "🚀 Initialisation du projet React Native YoYo..."

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Configurer Android
echo "🤖 Configuration Android..."
cd android

# Créer le dossier gradle/wrapper si nécessaire
mkdir -p gradle/wrapper

# Rendre gradlew exécutable
chmod +x gradlew

# Retour au dossier frontend
cd ..

# Pour iOS (uniquement sur macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Configuration iOS..."
    cd ios
    pod install
    cd ..
fi

echo "✅ Configuration terminée!"
echo ""
echo "Pour lancer l'application:"
echo "  Android: npm run android"
echo "  iOS:     npm run ios"

