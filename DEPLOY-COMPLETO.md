# 🚀 DEPLOY COMPLETO DEL PROYECTO - GUÍA DESDE CERO

> Desplegar backend, frontend y DB en la nube en 30 minutos

---

## 📊 VISIÓN GENERAL

Tu proyecto tiene 3 partes que irán en DIFERENTES lugares:

```
┌─────────────────────────────────────────────────────────┐
│                 MI PROYECTO EN LA NUBE                   │
├──────────────────────┬──────────────────┬───────────────┤
│   BACKEND (API)      │   FRONTEND (Web) │   BASE DATOS  │
├──────────────────────┼──────────────────┼───────────────┤
│   Railway.app        │   Vercel.com     │   Railway.app │
│   Node.js + Express  │   React + Vite   │   MySQL       │
│   puerto 3001        │   puerto 80/443  │   puerto 3306 │
│                      │                  │   (interno)   │
└──────────────────────┴──────────────────┴───────────────┘
```

---

## ⚠️ REQUISITOS PREVIOS

Verifica que TIENES:

- [ ] **Código en GitHub** (`git push` hecho)
- [ ] **Cuenta en Railway.app** (https://railway.app)
- [ ] **Cuenta en Vercel.com** (https://vercel.com)
- [ ] **Ambas conectadas a GitHub** (autorizadas)

Si no tienes ninguna cuenta:
- Railway: Sign up → Conecta GitHub → Listo
- Vercel: Sign up → Conecta GitHub → Listo

---

## 🎯 PASO A PASO (30 MINUTOS)

---

## 🟦 PARTE 1: BASE DE DATOS (5 min)

### 1.1 Crear BD en Railway

1. Abre https://railway.app
2. Haz login (o sign up con GitHub)
3. Clic en **"Start a New Project"**

```
┌─────────────────────────────┐
│  Start a New Project        │
├─────────────────────────────┤
│ [Database]   [GitHub]  [Blank] │
└─────────────────────────────┘
```

4. Haz clic en **"Database"**
5. Selecciona **"MySQL"**

Railway creará automáticamente:
- ✅ Un servidor MySQL
- ✅ Una base de datos
- ✅ Un usuario con contraseña

### 1.2 Esperar a que esté 🟢 (2 min)

Verás algo así:

```
┌──────────────────────────┐
│   mysql (Service)        │
│                          │
│   Status: 🟢 Running     │
│   Deployment: ✅ Success │
└──────────────────────────┘
```

### 1.3 Obtener las Credenciales

**IMPORTANTE:** Copia los datos de conexión

1. En Railway, haz clic en el servicio **"mysql"**
2. Ve a la pestaña **"Connect"**
3. **COPIA** la sección que dice `DATABASE_URL`

```
mysql://root:E0aB8xC2dF4gH7iJ9k@mysql-prod.railway.internal:3306/railway
```

**⚠️ Guarda esto en un bloc de notas o documento por ahora**

También copia por separado (los necesitarás después):

```
Host:     mysql-prod.railway.internal
Port:     3306
Username: root
Password: E0aB8xC2dF4gH7iJ9k
Database: railway
```

---

## 🔵 PARTE 2: BACKEND (10 min)

### 2.1 Crear Proyecto Backend en Railway

1. En Railway, clic **"New Project"**
2. Selecciona **"Deploy from GitHub"**

```
┌─────────────────────────────┐
│  New Project                │
├─────────────────────────────┤
│ [Database] [GitHub] [Template] │
│            ↑                 │
│        Aquí                 │
└─────────────────────────────┘
```

3. Te pedirá autorizar a Railway para acceder a GitHub
   - Clic en **"Authorize"**
   - Confirma con tu contraseña de GitHub

4. Selecciona tu repositorio:
   ```
   mantenimiento_climatizacio
   ```

5. Railway detectará automáticamente:
   ```
   ✅ Detected Node.js project
   ✅ Found Dockerfile
   ✅ Ready to deploy
   ```

### 2.2 Configurar Variables de Entorno

Cuando Railway termine de escanear el repo, haz clic en el servicio que aparece (Backend Service).

Ve a la pestaña **"Variables"** (o Environment).

**AÑADE ESTAS 5 VARIABLES:**

Clic en **"New Variable"** para cada una:

**Variable 1: DATABASE_URL**
- Key: `DATABASE_URL`
- Value: (la que copiaste en 1.3 del paso anterior)
  ```
  mysql://root:E0aB8xC2dF4gH7iJ9k@mysql-prod.railway.internal:3306/railway
  ```

**Variable 2: JWT_SECRET**
- Key: `JWT_SECRET`
- Value: (something super long and random)
  ```
  Esta_Es_Una_Contraseña_Super_Larga_Y_Random_123456789_abcdefghijklmnop!@#$%
  ```
  (O puedes copiar esto exacto: `sK9@mL2$xP7#wQ4&hJ1)aB3|cD5^eF8~tU0-rS6+nM4*kL9%pQ7@wE2!`)

**Variable 3: PORT**
- Key: `PORT`
- Value: `3001`

**Variable 4: NODE_ENV**
- Key: `NODE_ENV`
- Value: `production`

**Variable 5: CORS_ORIGIN**
- Key: `CORS_ORIGIN`
- Value: `*` (por ahora, lo cambiaremos después)

**Cómo hacerlo:**

```
1. Ve a pestaña "Variables"
2. Clic en "New Variable"
3. Escribe KEY (nombre de la variable)
4. Escribe VALUE (el valor)
5. Presiona ENTER o clic en ✓
6. Repite 5 veces
```

### 2.3 Esperar a que Rail way Haga Build

Después de añadir las variables, Railway **automáticamente iniciará un build**.

Verás en **"Deployment"**:

```
🔵 Building...
  ⏳ Downloading dependencies
  ⏳ Running Dockerfile
  ⏳ Starting service
```

**Espera 3-5 minutos** hasta que veas:

```
✅ Deployment successful
✅ Service running on port 3001
```

### 2.4 Ejecutar Seed Data en BD

Una vez que veas ✅ Success, necesitas llenar la BD con datos de prueba.

1. En tu Backend Service, ve a la pestaña **"Deployment"**
2. Mira si hay un botón **"Terminal"** o "Shell" (arriba a la derecha)
3. O Ve a **"Settings"** → clic en los 3 puntitos (⋯) → **"Open in Shell"**

Se abrirá una terminal. Ejecuta esto:

```bash
npx prisma db push
```

Verás:
```
✅ Tables created successfully
```

Luego ejecuta:

```bash
npm run seed
```

Verás mensajes como:

```
✅ Admin user created: admin@sena.com
✅ 5 users created
✅ 3 equipment created
✅ 3 work orders created
✅ Seed completed!
```

**¡Perfecto!** Tu BD está llena de datos de prueba.

### 2.5 Obtener URL del Backend

En tu **Backend Service**, busca arriba a la **derecha**:

Verás algo llamado **"Public Domain"** o **"Railway Domain"**:

```
tu-proyecto-production-abc123xyz.railway.app
```

**COPIA y GUARDA esta URL:** 📌

Tu API estará en:

```
https://tu-proyecto-production-abc123xyz.railway.app/api
```

Ejemplo real:
```
https://mantenimiento-prod-a1b2c3.railway.app/api
```

**Verifica que funciona:**

Abre en el navegador (reemplaza con tu URL):

```
https://mantenimiento-prod-a1b2c3.railway.app/api/health
```

Deberías ver en blanco:
```json
{"message":"API Backend Online"}
```

Si ves esto, ¡el backend funciona! ✅

---

## 🟦 PARTE 3: FRONTEND (8 min)

### 3.1 Preparar Archivo .env.production

Abre tu proyecto en VS Code.

Ve a la carpeta **`frontend-web`**

Crea un nuevo archivo llamado `.env.production`

```
frontend-web/
├── src/
├── public/
├── .env.production          ← CREAR ESTE
├── vite.config.js
└── package.json
```

**Contenido del archivo .env.production:**

```
VITE_API_URL=https://tu-proyecto-production-abc123xyz.railway.app/api
```

Reemplaza `tu-proyecto-production-abc123xyz.railway.app` con **tu URL real de Railway** (del paso 2.5).

Ejemplo:
```
VITE_API_URL=https://mantenimiento-prod-a1b2c3.railway.app/api
```

### 3.2 Subir a GitHub

En tu terminal (PowerShell):

```bash
cd frontend-web
git add .env.production
git commit -m "chore: add production API URL for Vercel"
git push
```

Salida esperada:
```
1 file changed, 1 insertion(+)
create mode 100644 .env.production
To https://github.com/TU_USUARIO/mantenimiento_climatizacio.git
   abc1234..def5678  main -> main
```

### 3.3 Desplegar en Vercel

1. Abre https://vercel.com
2. Haz login (o sign up con GitHub)
3. Clic en **"Add New..."** → **"Project"**

```
┌─────────────────────────────┐
│  Add New...                 │
│  • Project   ← AQUÍ         │
│  • Environment              │
│  • Integration              │
└─────────────────────────────┘
```

4. Busca y selecciona tu repositorio:
   ```
   mantenimiento_climatizacio
   ```

5. Vercel mostrará opciones de configuración

### 3.4 Configurar Root Directory

En la pantalla de "Configure project":

Busca **"Root Directory"** o **"Project Settings"**

**CAMBIA a:** `/frontend-web`

```
┌─────────────────────────────────┐
│  Framework Preset: Vite         │
│  Root Directory:                │
│  [              v]              │
│                                 │
│  Selecciona: frontend-web       │
│  o escribe:  /frontend-web      │
└─────────────────────────────────┘
```

### 3.5 Configurar Variables de Entorno

En la mismo pantalla, busca **"Environment Variables"**

Haz clic en **"Add"** o **"New"**

Añade:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://tu-api-url.railway.app/api` |

Reemplaza con tu URL real.

### 3.6 Hacer Deploy

Clic en **"Deploy"**

Vercel empezará el build:

```
🔵 Building...
  ✅ Cloning repository
  ✅ Installing dependencies
  ✅ Building project
  ✅ Creating edge config
```

**Espera 2-3 minutos**

Cuando termine verás:

```
✅ Congratulations! Your site is live at:
   https://mantenimiento-frontend-abc123.vercel.app
```

**COPIA y GUARDA esta URL** 📌

---

## 🔗 PARTE 4: CONECTAR TODO (3 min)

### 4.1 Actualizar CORS en Railway

Ahora que tienes la URL del frontend, actualiza el Backend:

1. Ve a Railroad → Tu **Backend Service**
2. Pestaña **"Variables"**
3. Busca `CORS_ORIGIN`
4. Actualiza el valor a tu URL de Vercel:

```
https://mantenimiento-frontend-abc123.vercel.app
```

Presiona Enter para guardar.

Railway **automáticamente redeploy** (5-10 segundos)

### 4.2 Actualizar Frontend si es Necesario

Si cambió tu URL de backend, actualiza en Vercel:

1. Ve a Vercel → Tu **Frontend Project**
2. Settings → **"Environment Variables"**
3. Edita `VITE_API_URL` si es necesario
4. Vercel automáticamente redeploy

---

## ✅ PARTE 5: VERIFICACIÓN (3 min)

### 5.1 Prueba del Backend

Abre esta URL en el navegador (reemplaza):

```
https://tu-api-url.railway.app/api/health
```

Deberías ver:
```json
{"message":"API Backend Online"}
```

Si YES ✅, el backend funciona.

### 5.2 Prueba del Frontend

Abre tu URL de Vercel:

```
https://mantenimiento-frontend-abc123.vercel.app
```

Deberías ver la página de **LOGIN**

### 5.3 Prueba de Login

En la página de login, intenta conectarte:

```
Email:    admin@sena.com
Password: password
```

Clic en **"Iniciar Sesión"**

**SI FUNCIONA:**
- ✅ Se abre el Dashboard (si eres admin)
- ✅ O Técnico Panel (si eres técnico)
- ✅ O Cliente Area (si eres cliente)

**SI DA ERROR:**
- Abre **DevTools** (F12)
- Ve a **Network** tab
- Mira qué URL se está llamando
- Mira si el error es CORS o connection

---

## 📊 RESUMEN DE URLS

Guarda estas:

```
BACKEND:   https://tu-backend-railway.app/api
FRONTEND:  https://tu-frontend-vercel.app
DATABASE:  mysql://root:pass@mysql-prod.railway.internal:3306/railway
           (solo para conexión interna, no se accede desde fuera)

Test Login:
  Email:    admin@sena.com
  Password: password
```

---

## 🔄 WORKFLOW: Cómo Deploy Cuando Cambias Código

Ahora que está en la nube, cada vez que quieras actualizar:

### Si cambias el Backend:

```bash
# En la carpeta raíz del proyecto:
git add backend/        # o los archivos que cambiastes
git commit -m "feat: agregar nueva funcionalidad"
git push origin main
```

Railway detecta automáticamente → Build → Deploy (5 min)

### Si cambias el Frontend:

```bash
# En la carpeta raíz:
git add frontend-web/
git commit -m "feat: actualizar página"
git push origin main
```

Vercel detecta automáticamente → Build → Deploy (2 min)

---

## 🐛 TROUBLESHOOTING

### ❌ "Cannot GET /api/health"

**Problema:** Backend no está corriendo

**Solución:**
1. Ve a Railway → Backend Service
2. Mira los **"Logs"** - qué dice?
3. Si hay error en rojo, Lee el mensaje
4. Si dice `DATABASE_URL not found`, verifica que la variable está en Railway
5. Si todo se ve bien, clic en los 3 puntitos → **"Re-deploy"**

---

### ❌ Frontend: "Cannot connect to backend"

**Problema:** La URL del API está mal o CORS no está configurado

**Solución:**
1. Abre DevTools (F12) → Console
2. Deberías ver un error CORS o error de conexión
3. Verifica en Vercel → Environment Variables que `VITE_API_URL` sea exacto
4. Verifica en Railway que `CORS_ORIGIN` sea exacto
5. Si cambiastes algo, ambas harán auto-redeploy

---

### ❌ "Seed data not loading"

**Problema:** El comando `npm run seed` no bajó datos

**Solución:**
1. Ve a Railway → Backend Service → Terminal
2. Ejecuta:
   ```bash
   npx prisma db push
   npm run seed
   ```
3. Si dice "User already exists", es porque ya lo ejecutaste (está bien)

---

### ❌ Login no funciona

**Problema:** Usuario y contraseña rechazado

**Solución:**
1. Verifica que ejecutaste `npm run seed` (sin eso, no hay usuarios)
2. Verifica que escribiste bien:
   - Email: `admin@sena.com` (EXACTO)
   - Password: `password`
3. Si falla, ve a Railway → Backend → Terminal y ejecuta de nuevo `npm run seed`

---

## 🎓 Conceptos Importantes

### ¿Qué es Railway?

- Plataforma cloud para hospedar backend y bases de datos
- Como Heroku pero mejor
- Conectas GitHub → automático deploy
- Gratis los primeros $5/mes

### ¿Qué es Vercel?

- Plataforma especializada para apps React/Next.js
- Optimizada específicamente para frontend
- Deployment casi instantáneo
- Gratis para proyectos personales

### ¿Por qué no todo en una plataforma?

- Railway es mejor para Backend + DB
- Vercel es mejor para Frontend
- Se pueden usar juntas sin problema
- Es la mejor práctica en 2026

---

## 📱 BONUS: Mobile App

El mobile app ya está preparado para conectarse al mismo backend.

Para deployar mobile (opcional):

1. Ve a `mobile-app/.env.production`
2. Configura: `EXPO_PUBLIC_API_URL=https://tu-api-url.railway.app/api`
3. Ejecuta: `eas build --platform android`

(Necesita EAS CLI instalado: `npm install -g eas-cli`)

---

## 🎉 ¡LISTO!

Tu app está en la nube y funcional. Ahora:

1. **Comparte la URL del frontend** con usuarios
2. **Monitorea** los logs en Railway/Vercel
3. **Actualiza código** haciendo git push
4. **Escala** cuando sea necesario (Railway permite más CPU/RAM)

---

## 📝 Checklist Final

- [ ] BD creada en Railway ✅
- [ ] Backend desplegado en Railway ✅
- [ ] Frontend desplegado en Vercel ✅
- [ ] Variables de entorno configuradas en ambos ✅
- [ ] Seed data creado ✅
- [ ] Login funciona ✅
- [ ] URLs guardadas y compartidas ✅

**¡Felicidades! Tu proyecto está en producción!** 🚀
