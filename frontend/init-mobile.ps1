# Script PowerShell pour initialiser le projet React Native

Write-Host "🚀 Initialisation du projet React Native YoYo..." -ForegroundColor Cyan

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Configurer Android
Write-Host "🤖 Configuration Android..." -ForegroundColor Yellow
Set-Location android

# Créer le dossier gradle/wrapper si nécessaire
if (-not (Test-Path "gradle\wrapper")) {
    New-Item -ItemType Directory -Path "gradle\wrapper" -Force | Out-Null
}

# Retour au dossier frontend
Set-Location ..

Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour lancer l'application:" -ForegroundColor Cyan
Write-Host "  Android: npm run android" -ForegroundColor White
Write-Host "  iOS:     npm run ios (macOS uniquement)" -ForegroundColor White

