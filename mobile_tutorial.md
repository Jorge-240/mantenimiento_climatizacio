# 📱 Guía de Configuración: App Móvil (Expo)

Sigue estos pasos para poner a funcionar la aplicación móvil en tu computadora y dispositivo físico.

## 📋 Requisitos Previos
1. **Node.js**: Asegúrate de tenerlo instalado (`node -v`).
2. **Expo Go**: Descárgalo en tu teléfono (Android o iOS) desde la App Store o Play Store.
3. **Red**: Tu computadora y tu teléfono deben estar en la misma red Wi-Fi.

## 🛠️ Instalación y Configuración

1. **Abrir la terminal** en la carpeta del proyecto.
2. **Entrar a la carpeta móvil**:
   ```bash
   cd mobile-app
   ```
3. **Instalar dependencias**:
   ```bash
   npm install
   ```
4. **Configurar la API**:
   - Crea un archivo llamado `.env` dentro de la carpeta `mobile-app`.
   - Copia y pega lo siguiente, reemplazando con la URL de tu backend:
   ```env
   EXPO_PUBLIC_API_URL=https://mantenimientoclimatizacio-production.up.railway.app/api
   ```

## 🚀 Ejecución

1. **Iniciar Expo**:
   ```bash
   npx expo start
   ```
2. **Escanear el Código QR**:
   - Verás un código QR en la terminal.
   - **Android**: Abre la app "Expo Go" y presiona "Scan QR Code".
   - **iOS**: Abre la app de Cámara normal y escanea el código (te pedirá abrir Expo Go).

## 💡 Notas Importantes
- Si el backend en Railway no responde, la app móvil mostrará un error de conexión.
- Asegúrate de que el backend tenga el CORS configurado para permitir conexiones (ya lo hemos arreglado en pasos anteriores).
