# 📱 Guide de Build Mobile - YoYo

## Prérequis

### Android
- ✅ Java JDK 11+ installé
- ✅ Android Studio installé
- ✅ Android SDK (API 23+)
- ✅ Variables d'environnement configurées

### iOS (macOS uniquement)
- ✅ Xcode installé
- ✅ CocoaPods installé: `sudo gem install cocoapods`
- ✅ Command Line Tools: `xcode-select --install`

## Instructions Rapides

### Pour Android

1. **Nettoyer et réinstaller**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

2. **Configurer les variables d'environnement (Windows)**
   ```powershell
   $env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools"
   $env:PATH += ";$env:ANDROID_HOME\tools"
   ```

3. **Lancer Metro bundler**
   ```bash
   npm start
   ```

4. **Dans un autre terminal, compiler et installer**
   ```bash
   npm run android
   ```

   Ou manuellement:
   ```bash
   cd android
   ./gradlew assembleDebug
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Pour iOS (macOS uniquement)

1. **Installer les pods**
   ```bash
   cd frontend/ios
   pod install
   cd ..
   ```

2. **Lancer l'application**
   ```bash
   npm run ios
   ```

## Résolution de Problèmes

### Erreur: "SDK location not found"

**Windows:**
```powershell
# Créer le fichier local.properties dans android/
echo "sdk.dir=C:\Users\$env:USERNAME\AppData\Local\Android\Sdk" > android\local.properties
```

**Linux/Mac:**
```bash
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
```

### Erreur: "Gradle sync failed"

1. Ouvrir Android Studio
2. File > Open > Sélectionner le dossier `frontend/android`
3. File > Sync Project with Gradle Files
4. Attendre la synchronisation complète

### Erreur: "Metro bundler not found"

```bash
npm install -g react-native-cli
npm start -- --reset-cache
```

### Erreur: "Could not find or load main class"

```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Téléphone non détecté

```bash
# Vérifier si le téléphone est connecté
adb devices

# Si rien n'apparaît:
# 1. Activer le débogage USB sur le téléphone
# 2. Autoriser l'ordinateur sur le téléphone
# 3. Réessayer: adb devices
```

### Build Release Android

1. **Générer la clé de signature**
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore yoyo-release-key.keystore -alias yoyo-key -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configurer gradle.properties**
   ```properties
   YOYO_UPLOAD_STORE_FILE=yoyo-release-key.keystore
   YOYO_UPLOAD_KEY_ALIAS=yoyo-key
   YOYO_UPLOAD_STORE_PASSWORD=your_password
   YOYO_UPLOAD_KEY_PASSWORD=your_password
   ```

3. **Modifier android/app/build.gradle**
   ```gradle
   signingConfigs {
       release {
           if (project.hasProperty('YOYO_UPLOAD_STORE_FILE')) {
               storeFile file(YOYO_UPLOAD_STORE_FILE)
               storePassword YOYO_UPLOAD_STORE_PASSWORD
               keyAlias YOYO_UPLOAD_KEY_ALIAS
               keyPassword YOYO_UPLOAD_KEY_PASSWORD
           }
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
       }
   }
   ```

4. **Compiler**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. **Installer l'APK**
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

## Commandes Utiles

```bash
# Nettoyer le projet
cd android && ./gradlew clean && cd ..

# Voir les logs
adb logcat | grep ReactNativeJS

# Redémarrer Metro
npm start -- --reset-cache

# Voir les appareils connectés
adb devices

# Désinstaller l'app du téléphone
adb uninstall com.yoyo

# Réinstaller
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Structure Créée

```
frontend/
├── android/
│   ├── app/
│   │   ├── build.gradle ✅
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml ✅
│   │   │   ├── java/com/yoyo/
│   │   │   │   ├── MainActivity.kt ✅
│   │   │   │   └── MainApplication.kt ✅
│   │   │   └── res/ ✅
│   │   └── proguard-rules.pro ✅
│   ├── build.gradle ✅
│   ├── settings.gradle ✅
│   ├── gradle.properties ✅
│   └── gradlew ✅
│
├── ios/
│   ├── Podfile ✅
│   └── YoYo/
│       ├── Info.plist ✅
│       ├── AppDelegate.h ✅
│       └── AppDelegate.mm ✅
│
└── Configuration
    ├── metro.config.js ✅
    ├── .eslintrc.js ✅
    ├── jest.config.js ✅
    └── react-native.config.js ✅
```

## ✅ Projet Prêt!

Tous les fichiers nécessaires pour compiler sur Android et iOS sont maintenant en place!

