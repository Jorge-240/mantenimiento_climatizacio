# 📊 DIAGRAMA VISUAL DEL DEPLOY

## ARQUITECTURA FINAL

```
                        USUARIO EN NAVEGADOR
                              │
                              │ Abre:
                              │ https://mantenimiento.vercel.app
                              ▼
                        ┌──────────────────┐
                        │   VERCEL.COM     │
                        │  (Frontend Web)  │
                        │  React + Vite    │
                        │  puerto 443      │
                        └──────────┬───────┘
                                   │
                                   │ Hace requests a:
                                   │ https://api.railway.app/api
                                   ▼
                        ┌──────────────────────┐
                        │   RAILWAY.APP        │
                        │   (Backend API)      │
                        │   Node.js + Express  │
                        │   puerto 3001        │
                        └──────────┬───────────┘
                                   │
                                   │ Conexión:
                                   │ DATABASE_URL=mysql://...
                                   ▼
                        ┌──────────────────────┐
                        │   RAILWAY.COM        │
                        │   (MySQL Database)   │
                        │   puerto 3306        │
                        │   (interno, no web)  │
                        └──────────────────────┘
```

---

## PROCESO PASO A PASO

```
LO QUE HACES                 QUE PASA EN LA NUBE          RESULTADO

1. CREAR BD
git push ──────────────────► Railway detecta ──────────► BD MySQL lista
                             crea MySQL

2. CONFIG BACKEND
Añades variables ───────────► Railway build ────────────► Backend corriendo
en Railway                    Deploya                    en puerto 3001

3. CONFIG FRONTEND
Creas .env.production ─────► git push ────────────────► Vercel build
                             Vercel detecta
                             Build + Deploy

4. CONECTAR AMBOS
Actualizas CORS ────────────► Railway redeploy ────────► Frontend ↔ Backend
                                                        comunicándose

5. TEST
Abres navegador ────────────► Vercal ────────────────► Login funciona
Login                         ↓
                              Railway
                              ↓
                              MySQL
                              ✅ TODA LA CADENA FUNCIONA
```

---

## FLUJO DE DATOS EN tiempo real

```
CUANDO HACES LOGIN:

1. Usuario escribe email/password en Frontend (Vercel)
   └─ Frontend envía POST a: https://api.railway.app/api/auth/login
   
2. Backend (Railway) recibe la request
   └─ Busca usuario en MySQL BD
   └─ Valida contraseña
   └─ Genera JWT token
   
3. Backend responde con token
   └─ Frontend recibe token
   └─ Lo guarda en localStorage
   └─ Redirige al Dashboard
   
4. Cada request que hace el frontend
   └─ Adjunta el token en headers
   └─ Backend verifica token
   └─ Si válido → permite la acción
   └─ Si vencido → pide login otra vez

┌─────────────────────────────────────────────────────────┐
│  FRONTEND                    BACKEND         BASE DE DATOS │
│  (Vercel)                    (Railway)       (MySQL)      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Email/Password              Validar         SELECT      │
│         │                    usuario        usuario      │
│         ├──POST──login─────► │────bcrypt────► │         │
│         │                    │               │          │
│         │                    │  Generar JWT  │          │
│         │◄─────JWT token─────┤               │          │
│         │                    │               │          │
│  Guardar token              Token guardado   │          │
│   (localStorage)            en respuesta     │          │
│         │                                     │          │
│    Redirect a                                │          │
│    Dashboard                                 │          │
│         │                                     │          │
│  Obtener datos              Con token       SELECT      │
│         │                    verificado     datos       │
│         ├──GET/clientes─────► │────JWT check─► │        │
│         │                    │               │          │
│         │                    │ Si válido:    │          │
│         │                    │ Devolver      │          │
│         │◄─────datos────────┤ datos         │          │
│         │                    │               │          │
│    Mostrar en                Ok              │          │
│    Dashboard                                 │          │
│                                               │          │
└─────────────────────────────────────────────────────────┘
```

---

## DÓNDE ESTÁ CADA COSA

```
GitHub.com/tu-usuario/mantenimiento_climatizacio
│
├── Dockerfile          ──► Usado por Railway para hacer build
├── railway.json        ──► Configuración Railway
├── railway.toml        ──► Configuración alternativa
├── .railwayignore      ──► Qué ignorar en Railway
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile      ──► (antiguo, no se usa)
│   └── package.json    ──► npm start aquí
│       ↓
│       DEPLOYADO EN: https://proyecto.railway.app
│
├── frontend-web/
│   ├── src/
│   ├── .env.production ──► URL API para producción
│   └── package.json    ──► npm run build aquí
│       ↓
│       DEPLOYADO EN: https://proyecto.vercel.app
│
└── mobile-app/
    └── (Opcional, conecta a same API)
```

---

## CÓMO PEDIR AYUDA

Si algo sale mal, puedes:

1. **Revisar Logs en Railway**
   - Backend Service → Deployment tab → Build Logs
   - Busca líneas en ROJO
   - Lee el error
   - Búscalo en Google

2. **Revisar Logs en Vercel**
   - Deployments tab → clic en último deploy
   - Ver Build Logs
   - Busca errores

3. **Revisar consola local**
   - Si algo no funciona en dev:
   - `npm run dev` en terminal
   - Abre DevTools (F12)
   - Console tab
   - Busca errores en rojo

---

## CHECKLIST ANTES DE DORMIR TRANQUILO

```
BD (Railway + MySQL):
  ✅ DATABASE_URL agregada a Railways variables
  ✅ Tables creadas (npx prisma db push)
  ✅ Datos de prueba cargados (npm run seed)
  ✅ Puedo conectar desde Railway terminal

Backend (Railway):
  ✅ Dockerfile en raíz del proyecto
  ✅ Variables de entorno todas configuradas
  ✅ Build dice ✅ Successful
  ✅ Deployment es 🟢 Running
  ✅ Health check funciona

Frontend (Vercel):
  ✅ .env.production creado y pusheado
  ✅ VITE_API_URL apunta a Railway backend
  ✅ Build dice ✅ Successful
  ✅ Puedo abrir la URL en navegador
  ✅ No hay errores CORS en DevTools

Todo Junto:
  ✅ Login funciona
  ✅ Dashboard carga datos
  ✅ DevTools Network muestra requests a API correcta
  ✅ La API responde sin errores

Si todo está ✅: 
  🎉 TU APP ESTÁ EN PRODUCCIÓN
  🎉 PUEDES DORMIR TRANQUILO
```

---

## URLS PARA GUARDAR

```
Tu GitHub:
https://github.com/tu-usuario/mantenimiento_climatizacio

Railway Dashboard:
https://railway.app/project/tu-proyecto-id

Vercel Dashboard:
https://vercel.com/tu-usuario/mantenimiento-frontend

Tu Backend en Producción:
https://mantenimiento-prod.railway.app/api

Tu Frontend en Producción:
https://mantenimiento-frontend.vercel.app

API Health Check:
https://mantenimiento-prod.railway.app/api/health

Test de Login:
POST https://mantenimiento-prod.railway.app/api/auth/login
Body: {"email":"admin@sena.com","password":"password"}
```

---

**Eso es TODA la arquitectura. Estudia este diagrama y entenderás cómo funciona tu app en la nube.**
