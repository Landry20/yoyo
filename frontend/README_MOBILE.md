# 📱 Guide Rapide - YoYo Mobile

## ✅ Structure Complète Créée

Tous les fichiers Android et iOS nécessaires ont été créés!

## 🚀 Démarrage Rapide

### 1. Installer les dépendances

```bash
cd frontend
npm install
```

### 2. Configurer Android SDK (Windows PowerShell)

```powershell
# Créer le fichier local.properties
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
echo "sdk.dir=$sdkPath" | Out-File -FilePath android\local.properties -Encoding utf8
```

### 3. Lancer l'application Android

```bash
# Terminal 1: Lancer Metro bundler
npm start

# Terminal 2: Compiler et installer sur téléphone
npm run android
```

## 📋 Checklist de Configuration

### Android
- [x] `android/build.gradle` créé
- [x] `android/app/build.gradle` créé
- [x] `android/app/src/main/AndroidManifest.xml` créé
- [x] `android/app/src/main/java/com/yoyo/MainActivity.kt` créé
- [x] `android/app/src/main/java/com/yoyo/MainApplication.kt` créé
- [x] `android/gradle.properties` créé
- [x] `android/settings.gradle` créé
- [x] Ressources Android créées
- [ ] Créer `android/local.properties` (voir ci-dessus)
- [ ] Générer `debug.keystore` (automatique au premier build)

### iOS (macOS uniquement)
- [x] `ios/Podfile` créé
- [x] `ios/YoYo/Info.plist` créé
- [x] `ios/YoYo/AppDelegate.h` créé
- [x] `ios/YoYo/AppDelegate.mm` créé
- [ ] Installer pods: `cd ios && pod install`

## 🔧 Configuration Nécessaire

### Créer local.properties (Android)

**Windows:**
```powershell
cd frontend/android
echo "sdk.dir=C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" > local.properties
```

**Linux/Mac:**
```bash
cd frontend/android
echo "sdk.dir=$HOME/Android/Sdk" > local.properties
```

### Vérifier Android SDK

1. Ouvrir Android Studio
2. File > Settings > Appearance & Behavior > System Settings > Android SDK
3. Vérifier que SDK Platform 34 est installé
4. Vérifier que Android SDK Build-Tools 34.0.0 est installé

## 📱 Compiler pour Téléphone

### Via React Native CLI (Recommandé)

```bash
cd frontend
npm run android
```

Cela va:
1. Démarrer Metro bundler automatiquement
2. Compiler l'application
3. Installer sur le téléphone connecté

### Via Gradle directement

```bash
cd frontend/android
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## 🐛 Résolution de Problèmes

### Erreur: "SDK location not found"
→ Créer `android/local.properties` (voir ci-dessus)

### Erreur: "Gradle sync failed"
→ Ouvrir `android` dans Android Studio et synchroniser

### Erreur: "Could not find or load main class"
```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Téléphone non détecté
```bash
adb devices
# Si vide, activer le débogage USB sur le téléphone
```

## 📚 Documentation

- `BUILD_MOBILE.md` - Guide complet de build
- `ANDROID_SETUP.md` - Configuration Android détaillée

## ✅ Projet Prêt!

Tous les fichiers sont en place. Suivez les étapes ci-dessus pour compiler et tester sur votre téléphone!

