# 🚀 DEPLOY RÁPIDO - CHEAT SHEET (5 MIN)

## 3 PASOS RÁPIDOS

### PASO 1: RAILWAY - CREAR BD + BACKEND

```
1. https://railway.app → "Start a New Project" → "Database" → "MySQL"
2. Copiar DATABASE_URL que aparece
3. "New Project" → "Deploy from GitHub" → seleccionar repositorio
4. Ve a Variables y añade:
   - DATABASE_URL = (lo que copiaste en paso 2)
   - JWT_SECRET = cualquier_cosa_super_larga
   - PORT = 3001
   - NODE_ENV = production
   - CORS_ORIGIN = *

5. Esperar 5 min a que deploy esté ✅
6. Terminal: npx prisma db push && npm run seed
7. Copiar "Public Domain" que aparece
```

**TU URL SERÁ:** `https://tu-nombre.railway.app/api`

---

### PASO 2: FRONTEND - CREAR ARCHIVO

En VS Code, abre `frontend-web/`

Clic derecho → "New File" → `.env.production`

Escribe:
```
VITE_API_URL=https://tu-nombre.railway.app/api
```

Guarda (Ctrl+S)

Terminal:
```bash
cd frontend-web
git add .env.production
git commit -m "chore: env production"
git push
```

---

### PASO 3: VERCEL - DESPLEGAR FRONTEND

```
1. https://vercel.com → "Add New Project"
2. Selecciona tu repositorio
3. Root Directory: /frontend-web
4. Add Environment Variable:
   VITE_API_URL = https://tu-nombre.railway.app/api
5. "Deploy"
6. Esperar 3 min
7. Copiar URL que aparece
```

**TU FRONTEND SERÁ:** `https://algo.vercel.app`

---

## LUEGO: ACTUALIZAR CORS

Ve a Railway → Backend → Variables

Cambia `CORS_ORIGIN` de `*` a:
```
https://algo.vercel.app
```

(Usa la URL real de Vercel)

---

## ✅ VERIFICAR QUE FUNCIONA

1. Abre browser: `https://algo.vercel.app`
2. Login con:
   - Email: `admin@sena.com`
   - Password: `password`
3. Si entra = TODO FUNCIONA ✅

---

## 📋 URLs FINALES

```
Backend:   https://tu-proyecto.railway.app/api
Frontend:  https://tu-proyecto.vercel.app
Login:     admin@sena.com / password
```

---

## 🔄 CÓMO ACTUALIZAR DESPUÉS

```bash
# Cambias código en backend o frontend
git add .
git commit -m "tu mensaje"
git push

# Railway/Vercel detectan automáticamente y redeployan
# No necesitas hacer nada más
```

---

## 🐛 ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "Build failed" en Railway | Verifica DATABASE_URL sea exacto |
| Frontend no conecta | Verifica VITE_API_URL esté bien escrito |
| Login no funciona | Corre `npm run seed` en Railway terminal |
| CORS error | Actualiza CORS_ORIGIN en Railway variables |

---

## 📞 AYUDA RÁPIDA

- Railway Logs: Backend Service → Deployment → Build Logs
- Vercel Logs: Deployments → ver el último
- Terminal Railway: Backend Service → Settings → Open in Shell

**¡LISTO! 30 MINUTOS Y ESTÁS EN LA NUBE 🎉**
