# 📱 Guía: Generación APK y Deploy Mobile App

## Requisitos Previos

```bash
# Instalar Node.js >= 18
node --version

# Instalar Expo CLI globalmente
npm install -g expo-cli

# Instalar EAS CLI para builds
npm install -g @expo/eas-cli

# Instalar Android Studio o usar Expo Go
```

---

## Opción 1: Desarrollo Local con Expo Go (Más Fácil)

### 1.1 Configurar IP del Backend

En `mobile-app/lib/api.js`, actualizar la URL:

```javascript
const BASE_URL = '192.168.1.X:3001/api'  // Tu IP local
```

En Windows o Mac, obtén tu IP:
```bash
# Windows
ipconfig

# Mac
ifconfig | grep inet

# Linux
hostname -I
```

### 1.2 Iniciar App en Development

```bash
cd mobile-app

# Instalar dependencias
npm install

# Iniciar Expo
npx expo start

# Escanear QR con:
# - Android: Expo Go app (Play Store)
# - iOS: Cámara del iPhone o Expo Go
# - Web: Presionar 'w'
```

---

## Opción 2: Generar APK para Android (Producción)

### 2.1 Crear Cuenta en Expo

1. Ve a [expo.dev](https://expo.dev)
2. Crea una cuenta (si no tienes)
3. Verifica email

### 2.2 Loguear en EAS

```bash
eas login

# Ingresa email y password
# Presiona 'y' para autorizar
```

### 2.3 Configurar Proyecto

```bash
cd mobile-app

# Actualizar app.json con tu info
# - name: nombre de tu app
# - slug: nombre único (sin espacios)
# - version: número de versión
```

Ejemplo app.json:
```json
{
  "expo": {
    "name": "Mantenimiento Climatización",
    "slug": "mantenimiento-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "runtimeVersion": "1.0.0",
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/xxx"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "INTERNET",
        "CAMERA"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### 2.4 Crear Perfil de Build

Crear/actualizar `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 2.5 Generar APK

#### Opción A: Preview (Desarrollo)
```bash
# Más rápido, ideal para pruebas
eas build --platform android --profile preview

# Esperar 3-5 minutos
# Te mostrará URL para descargar el APK
```

#### Opción B: Production (Lanzamiento)
```bash
# Build optimizado para production
eas build --platform android --profile production

# Genera .aab (Android Bundle) para Play Store
```

### 2.6 Descargar APK

```bash
# Ver status del build
eas build:list

# Descargar:
# 1. Ve a https://expo.dev/builds
# 2. Encontrá tu build
# 3. Descargá el APK
# 4. Transfiere a tu teléfono Android
# 5. Abre

# O directamente:
eas build:view [build-id]
```

### 2.7 Instalar en Android

#### Desde Computadora:
```bash
# Conecta teléfono por USB (modo desarrollador activado)
adb devices

# Instalar
adb install -r mantenimiento-app.apk
```

#### Desde Teléfono:
1. Descargar APK en teléfono
2. Abrir Archivos
3. Localizar mantenimiento-app.apk
4. Tocar para instalar
5. Permitir instalación de fuentes desconocidas

---

## Opción 3: Generar IPA para iOS (Solo en Mac)

### 3.1 Requisitos
- Mac con Xcode instalado
- Certificados Apple Developer ($99/año)
- Cuenta Expo

### 3.2 Generar IPA

```bash
cd mobile-app

# Generar
eas build --platform ios --profile production

# Esperar 10-15 minutos
# Descargar IPA

# O usar Xcode localmente:
expo prebuild --clean
xed -B ios
```

### 3.3 Instalar en iPhone

#### Con TestFlight (Recomendado):
1. Ve a App Store Connect
2. Sube IPA
3. Invita testers (emails)
4. Instalan desde TestFlight

#### Con Xcode:
```bash
# Con teléfono conectado
xcodebuild -scheme mantenimiento-app -configuration Release

# O drag-drop en Xcode
```

---

## Configurar para Producción

### 1. Actualizar API URL

En `mobile-app/lib/api.js`:
```javascript
const baseURL = 'https://backend-production.railway.app/api'
```

### 2. Variables de Entorno

Crear `.env` en root del mobile-app:
```
EXPO_PUBLIC_API_URL=https://backend-production.railway.app/api
EXPO_PUBLIC_APP_NAME=Mantenimiento Climatización
```

### 3. Build Final

```bash
# Preview
eas build --platform android --profile preview

# Production
eas build --platform android --profile production
```

---

## Troubleshooting

### "eas: command not found"
```bash
npm install -g @expo/eas-cli
```

### "Build failed - Out of memory"
- Aumentar heap de Node:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
eas build --platform android
```

### "No credentials to build"
```bash
# Loguear otra vez
eas logout
eas login
```

### Conexión API rechazada
- Verificar IP correcta en api.js
- Firewall permite puerto 3001:
```bash
# Windows
netsh advfirewall firewall add rule name="Node Port 3001" dir=in action=allow protocol=tcp localport=3001

# Mac/Linux
sudo lsof -i :3001
```

### App se congela al login
- Revisar payload del JWT
- Verificar token expiration
- Comprobar que usuario existe en BD

---

## Publishing en App Stores

### Google Play Store

1. Crear cuenta Google Play Console ($25)
2. Crear aplicación
3. Generar signing key:
```bash
eas build --platform android --profile production
```
4. Subir .aab
5. Llenar metadatos (descripción, screenshots)
6. Someter para revisión (1-3 horas)

### Apple App Store

1. Crear cuenta Apple Developer ($99/año)
2. Crear certificados en Apple Developer Portal
3. En EAS:
```bash
eas build --platform ios --profile production
```
4. Subir a App Store Connect
5. Llenar metadatos
6. Someter para revisión (1-2 días)

---

## Monitoreo en Producción

### Habilitar Error Tracking

En `app.json`:
```json
{
  "expo": {
    "plugins": ["expo-error-boundary"]
  }
}
```

### Logs Remotos

Implementar con Sentry o LogRocket:

```javascript
// lib/api.js
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://xxx@sentry.io/xxx",
  enableInExpoDevelopment: true,
});
```

---

## Desinstalación

```bash
# Android
adb uninstall com.blackboxai.mantenimientoapp

# O manualmente: Settings > Apps > Mantenimiento > Uninstall
```

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0