# 🚀 Deployment en Railway - Guía Paso a Paso

> Este documento explica cómo desplegar el backend en Railway de forma correcta.

---

## 📋 Requisitos Previos

- [ ] Cuenta en GitHub (con repositorio)
- [ ] Cuenta en [Railway.app](https://railway.app)
- [ ] Código pusheado a GitHub (`main` branch)
- [ ] Base de datos MySQL (crearemos una en Railway)

---

## ✅ Lo Que Ya Se Hizo

He creado 4 archivos en la raíz del proyecto para que Railway entienda cómo hacer build:

```
✅ Dockerfile               - Especifica cómo construir la imagen
✅ railway.json            - Configuración para Railway
✅ railway.toml            - Configuración alternativa (más robusta)
✅ .railwayignore          - Indica qué carpetas ignorar
```

---

## 🎯 PASO 1: Preparar todo en Local

Antes de subir, verifica que funciona en tu computadora:

```bash
# 1. Navega al backend
cd backend

# 2. Instala dependencias
npm install

# 3. Crea archivo .env local
copy .env.example .env

# 4. LLena variables críticas:
# DATABASE_URL=mysql://tu_usuario:contraseña@localhost:3306/mantenimiento
# JWT_SECRET=tu-secreto-super-largo-aqui-123456789
# NODE_ENV=development
# PORT=3001

# 5. Prueba que funciona
npm run dev
```

Si funciona, continúa.

---

## 🔌 PASO 2: Crear Base de Datos en Railway

### 2.1 Accede a Railway

1. Abre [https://railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Database"** → **"MySQL"**
4. Railway creará una BD automáticamente
5. Espera a que esté lista (↓ verde)

### 2.2 Obtener Credenciales

En el dashboard de Railway:

1. Haz clic en el servicio `mysql` que aparece
2. Ve a la pestaña **"Connect"**
3. Busca la sección **"DATABASE_URL"** o copia cada dato:

```
Host:     nombre-proyecto.railway.internal
Username: root
Password: contraseña-aleatoria-long
Database: railway
Port:     3306
```

Copia la línea que dice `DATABASE_URL` (formato: `mysql://root:pass@host:3306/railway`)

⚠️ **Guarda esta información**, la necesitarás después.

---

## 📦 PASO 3: Crear Servicio Backend en Railway

### 3.1 Crear desde GitHub

1. En Railway, haz clic **"New Project"** → **"Deploy from GitHub"**
2. Autoriza a Railway para acceder a tu GitHub
3. Selecciona tu repositorio `mantenimiento_climatizacio` (o el nombre que uses)
4. Railway detectará automáticamente la estructura

### 3.2 Ve que Railway Entienda

Espera unos segundos, Railway debe mostrar:

```
Detected: Node.js project
Found Dockerfile: ✓
```

Si todo está green, continúa.

---

## 🔐 PASO 4: Configurar Variables de Entorno

En Railway (después de crear el servicio):

1. Haz clic en el **"Backend Service"** que aparece
2. Ve a la pestaña **"Variables"**
3. **AÑADE** estas variables (haz clic en "New Variable"):

| Variable | Valor | Notas |
|----------|-------|-------|
| `DATABASE_URL` | `mysql://root:PASSWORD@mysql-prod.railway.internal:3306/railway` | Reemplaza PASSWORD con la que obtuviste |
| `JWT_SECRET` | (`-a_TZX#5*kL@2qW%9nB&mP$vC!jD8wQeF) | O pon algo muy largo y aleatorio |
| `PORT` | `3001` | Puerto donde corre |
| `NODE_ENV` | `production` | Entorno production |
| `CORS_ORIGIN` | `https://frontend-url.vercel.app` | (Cambiar a tu frontend URL real después) |

**Cómo añadirlas:**

1. Clic en **"New Variable"**
2. Escribe el nombre en **"Key"** (ej: `DATABASE_URL`)  
3. Escribe el valor en **"Value"**
4. Presiona **Enter** o clic en ✓

---

## 🏗️ PASO 5: Primera Build y Deploy

### 5.1 Iniciar Build Automático

Cuando configuraste las variables, **Railway debería iniciar automáticamente un build**.

Verás esto:

```
Building... ⏳
- Downloading dependencies
- Running Dockerfile
- Deploying
```

### 5.2 Ver Logs

Si todo es correcto, al final verás:

```
✓ Deployment successful
✓ Service running on port 3001
```

Si hay error 🔴, haz clic en la build fallida para ver qué pasó.

---

## 🗃️ PASO 6: Ejecutar Migrations y Seed

Una vez que el backend esté corriendo:

### 6.1 Acceder a la Consola

En Railway:

1. Haz clic en tu **Backend Service**
2. Ve a la pestaña **"Deployment"** → **"Logs"**
3. O mejor aún, ve a **"Terminal"** (si está disponible)

### 6.2 Ejecutar Comandos

```bash
# Dentro del terminal de Railway:

# 1. Hacer push del schema
npx prisma db push

# 2. Ejecutar seed (agregar datos de prueba)
npm run seed
```

Si funciona, verás mensajes como:

```
✓ 5 usuarios creados
✓ 3 equipos creados
✓ 3 órdenes creadas
```

---

## 🌐 PASO 7: Obtener URL del Backend

En Railway:

1. Ve al **Backend Service**
2. Busca **"Public Domain"** (arriba a la derecha)
3. Verás algo como: `proyecto-production-123abc.railway.app`
4. Tu API estará en: `https://proyecto-production-123abc.railway.app/api`

**Guarda esta URL**, la necesitarás en el frontend.

---

## 🎨 PASO 8: Desplegar Frontend Web

### 8.1 Preparar Frontend

En `frontend-web/.env.production`:

```
VITE_API_URL=https://proyecto-production-hxxxxxx.railway.app/api
```

Commit y push a GitHub:

```bash
cd frontend-web
git add .env.production
git commit -m "chore: add production API URL"
git push
```

### 8.2 Deploy en Vercel (Recomendado)

1. Abre [https://vercel.com](https://vercel.com)
2. Haz clic **"New Project"**
3. Importa tu repositorio de GitHub
4. Selecciona la carpeta raíz: `/frontend-web`
5. Añade variable de entorno: `VITE_API_URL=https://tu-api-url.railway.app/api`
6. Clic **"Deploy"**

Vercel te dará una URL tipo: `mantenimiento-frontend.vercel.app`

---

## ✅ PASO 9: Verificar que Todo Funciona

### 9.1 Test de Backend

```bash
# En Postman o en terminal:

curl https://proyecto-production-xxxxx.railway.app/api/health

# Debería responder:
# {"message":"API Backend Online"}
```

### 9.2 Test de Login

```bash
# POST https://proyecto-production-xxxxx.railway.app/api/auth/login
# Body:
{
  "email": "admin@sena.com",
  "password": "password"
}

# Debe responder con un JWT token
```

### 9.3 Test en Frontend

1. Abre tu URL de Vercel: `https://mantenimiento-frontend.vercel.app`
2. Intenta hacer login con:
   - Email: `admin@sena.com`
   - Password: `password`
3. Si funciona, ¡estás listo! 🎉

---

## 🔄 PASO 10: Redeploy Automático

Ahora cada vez que hagas `git push` a `main`:

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin main
```

### Railway detectará automáticamente:
1. Nueva versión en GitHub
2. Iniciará build automático
3. Si todo es OK, desplegará sin intervención

---

## 🐛 TROUBLESHOOTING

### ❌ "Build failed: Script start.sh not found"

**Solución:**
- Verifica que `Dockerfile` está en la raíz ✓ (ya lo creé)
- Verifica que `railway.toml` está en la raíz ✓ (ya lo creé)
- Si aún falla, va a Railway → Settings → Re-deploy para forzar rebuild

### ❌ "Database connection error"

**Solución:**
- Verifica `DATABASE_URL` sea exacto
- Copia desde Railway → MySQL → Connect → DATABASE_URL (no hagas copy-paste manual)
- Prueba con `npx prisma db push` desde terminal Railway

### ❌ "Seed data not loading"

**Solución:**
```bash
# Ejecuta en orden en la terminal Railway:
npx prisma db push
npm run seed
npx prisma generate
```

### ❌ "Frontend no conecta con backend"

**Solución:**
- Verifica CORS_ORIGIN en Railway = URL del frontend
- Verifica VITE_API_URL en frontend = URL exacta del backend con `/api`
- Abre DevTools → Network → vé qué URL se está usando

---

## 📊 Resumen de URLs

```
Backend:    https://proyecto-production-xxxx.railway.app/api
Frontend:   https://mantenimiento-frontend.vercel.app
Base Datos: mysql-prod.railway.internal (interno, no público)
```

---

## 🎓 Próximos Pasos Opcionales

1. **Configurar dominio personalizado** (Railway permite agregar tu propio dominio)
2. **Agregar SSL/HTTPS** (Railway lo hace automático)
3. **Configurar alertas** si hay errores (en Railway settings)
4. **Escalar resources** si necesita más CPU/RAM (en Railway)

---

## 📞 Ayuda Rápida

Si algo falla:

1. Ve a Railway → Tu proyecto → Logs
2. Busca mensajes en color rojo 🔴
3. Cópialo y búscalo en Google
4. O mira la sección de **Build Logs** para más detalles

---

**¡Listo! Tu aplicación está en el cloud 🚀**
