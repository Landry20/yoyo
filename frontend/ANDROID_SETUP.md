# Configuration Android - YoYo

## Étapes pour compiler l'application Android

### 1. Prérequis

- Java JDK 11 ou supérieur
- Android Studio
- Android SDK (API 23+)
- Variables d'environnement configurées:
  ```bash
  export ANDROID_HOME=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  ```

### 2. Générer la clé de signature (pour release)

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Configuration dans android/gradle.properties

Ajouter:
```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

### 4. Compiler l'application

```bash
# Depuis la racine du projet frontend
cd android
./gradlew assembleRelease

# Ou directement
npm run android
```

### 5. Installer sur téléphone

```bash
# Connecter le téléphone en USB avec le débogage USB activé
adb devices
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 6. Problèmes courants

**Erreur: SDK not found**
- Ouvrir Android Studio
- SDK Manager > Installer Android SDK Platform 34
- Installer Android SDK Build-Tools 34.0.0

**Erreur: Java version**
- Installer Java JDK 11+
- Vérifier: `java -version`

**Erreur: Gradle sync**
- Ouvrir Android Studio
- File > Sync Project with Gradle Files

### 7. Débogage

```bash
# Voir les logs
adb logcat

# Redémarrer Metro bundler
npm start -- --reset-cache
```

