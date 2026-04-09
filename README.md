# 🚀 Sistema Gestión Mantenimiento de Equipos de Climatización

Sistema completo, funcional y listo para producción de gestión de mantenimiento de equipos de climatización. Proyecto desarrollado para SENA ADSO.

**Stack tecnológico:**
- Backend: Node.js + Express + Prisma + MySQL
- Frontend Web: React 18 + Vite + TailwindCSS + Chart.js
- App Móvil: React Native + Expo + NativeWind
- Base de Datos: MySQL 8.0+

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación Local](#-instalación-local)
- [Instalación y Deploy en Railway](#%EF%B8%8F-instalación-y-deploy-en-railway)
- [Generación APK](#-generación-apk)
- [Endpoints API](#-endpoints-api)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [Tecnologías](#-tecnologías)

---

## ✨ Características

### 👨‍💼 Módulo Admin
- ✅ CRUD Clientes (crear, editar, eliminar)
- ✅ CRUD Técnicos (crear, editar, eliminar)
- ✅ CRUD Equipos (crear, editar, eliminar)
- ✅ Gestión de Órdenes de Trabajo
- ✅ Asignación de Técnicos a Órdenes
- ✅ Generación de Cotizaciones
- ✅ Dashboard con métricas y gráficos
- ✅ Reportes de órdenes pendientes

### 🔧 Módulo Técnico
- ✅ Ver órdenes asignadas
- ✅ Registrar mantenimiento (preventivo/correctivo)
- ✅ Agregar repuestos utilizados
- ✅ Subir evidencia (fotos/URLs)
- ✅ Registrar horas trabajadas
- ✅ Completar orden de trabajo

### 👤 Módulo Cliente
- ✅ Ver perfil y equipos
- ✅ Solicitar servicio
- ✅ Ver estado de órdenes
- ✅ Ver detalles de mantenimiento
- ✅ Aprobar/rechazar cotizaciones
- ✅ Cancelar órdenes no iniciadas

### 🔐 Autenticación
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Roles: Admin, Técnico, Cliente
- ✅ Protección de rutas por rol
- ✅ Sincronización en tiempo real (Web + Mobile)

---

## 📁 Estructura del Proyecto

```
proyecto-root/
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── app.js                   # Configuración principal
│   │   ├── controllers/
│   │   │   ├── authController.js    # Autenticación
│   │   │   ├── adminController.js   # Lógica admin
│   │   │   ├── tecnicoController.js # Lógica técnico
│   │   │   └── clienteController.js # Lógica cliente
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── tecnico.js
│   │   │   └── cliente.js
│   │   ├── middlewares/
│   │   │   └── auth.js              # JWT + Roles
│   │   └── utils/
│   │       └── jwt.js
│   ├── prisma/
│   │   ├── schema.prisma            # Esquema de BD
│   │   └── seed.js                  # Datos de prueba
│   ├── .env.example                 # Variables de entorno
│   ├── Dockerfile
│   └── package.json
│
├── frontend-web/                     # React + Vite
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TecnicoPanel.jsx
│   │   │   └── ClienteArea.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   └── services/
│   │       └── api.js
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── mobile-app/                       # React Native + Expo
│   ├── app/
│   │   ├── _layout.jsx
│   │   ├── (auth)/
│   │   │   └── login.jsx
│   │   └── (tabs)/
│   │       └── _layout.jsx
│   ├── lib/
│   │   └── api.js
│   ├── store/
│   │   └── auth.js
│   ├── app.json
│   ├── eas.json
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── database/
│   └── schema.sql                   # Script SQL
│
├── docker-compose.yml               # Orquestación local
└── README.md                         # Este archivo

```

---

## 🖥️ Instalación Local

### Requisitos Previos

- **Node.js** >= 20.0.0 ([descargar](https://nodejs.org))
- **Docker Desktop** ([descargar](https://www.docker.com/products/docker-desktop))
- **Git** ([descargar](https://git-scm.com))

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/mantenimiento-climatizacion.git
cd mantenimiento-climatizacion
```

### Paso 2: Configurar Base de Datos y Backend

```bash
# Iniciar MySQL con Docker
docker-compose up -d

# Esperar 3-5 segundos para que MySQL inicie
sleep 5

# Ingresar al directorio backend
cd backend

# Copiar variables de entorno
cp .env.example .env

# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones (crear tablas)
npm run prisma:migrate

# Cargar datos de prueba (IMPORTANTE)
npm run seed

# Iniciar backend en modo desarrollo
npm run dev
```

**✅ Backend funcionando en:** http://localhost:3001

---

### Paso 3: Configurar Frontend Web

```bash
# En otra terminal, ir a frontend
cd frontend-web

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**✅ Frontend funcionando en:** http://localhost:5173

---

### Paso 4: Configurar App Móvil (Opcional)

```bash
# En otra terminal, ir a mobile
cd mobile-app

# Instalar dependencias
npm install

# O con Expo
npx expo install

# Iniciar aplicación
npx expo start

# Presionar:
# - 'i' para iOS simulator (requiere Mac)
# - 'a' para Android emulator
# - 'w' para web preview
```

---

## ☁️ Instalación y Deploy en Railway

### Paso 1: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta y nuevo proyecto
3. Conecta tu repositorio de GitHub

### Paso 2: Configurar Base de Datos

```bash
# En Railway:
1. Añade un nuevo servicio: PostgreSQL o MySQL
2. Copia la conexión string
3. Agrega como variable: DATABASE_URL
```

### Paso 3: Desplegar Backend

```bash
# En raíz del proyecto, crear railway.json
{
  "enviroment": "node",
  "build": {
    "builder": "dockerfile",
    "dockerfilePath": "backend/Dockerfile"
  }
}

# Variables de entorno en Railway:
DATABASE_URL=mysql://user:pass@host/db
JWT_SECRET=tu-super-secret-prod-key-muy-largo-y-seguro
PORT=3001
NODE_ENV=production
```

### Paso 4: Desplegar Frontend

```bash
# Opción 1: Con Railway Static Deployment
npm run build
# Subir carpeta 'dist' como static site

# Opción 2: Con Vercel (más fácil)
npm install -g vercel
vercel

# Opción 3: Con Netlify
npm run build
# Arrastrar carpeta 'dist' a netlify.com
```

### Paso 5: Variables de Entorno

Actualizar `frontend-web/src/services/api.js`:

```javascript
const API_URL = process.env.VITE_API_URL || 'https://backend-railway.railway.app/api'
export const api = axios.create({
  baseURL: API_URL
})
```

---

## 📦 Generación APK

### Requisitos

```bash
npm install -g eas-cli
npx expo login
```

### Generar APK

```bash
cd mobile-app

# Construir APK para Preview (más rápido)
eas build --platform android --profile preview

# Construir APK para Producción
eas build --platform android --profile production

# Descargar desde: https://expo.dev/builds
```

### Generar IPA (iOS)

```bash
# Requiere Mac y certificados Apple
eas build --platform ios --profile production
```

---

## 🔌 Endpoints API

### Base URL: `http://localhost:3001/api`

### Autenticación

```
POST   /auth/register              # Registrar usuario
POST   /auth/login                 # Iniciar sesión
```

### Admin (Protegido - rol: admin)

```
# CLIENTES
GET    /admin/clientes             # Listar clientes
POST   /admin/clientes             # Crear cliente
PUT    /admin/clientes/:id         # Actualizar cliente
DELETE /admin/clientes/:id         # Eliminar cliente

# TÉCNICOS
GET    /admin/tecnicos             # Listar técnicos
POST   /admin/tecnicos             # Crear técnico
PUT    /admin/tecnicos/:id         # Actualizar técnico
DELETE /admin/tecnicos/:id         # Eliminar técnico

# EQUIPOS
GET    /admin/equipos              # Listar equipos
POST   /admin/equipos              # Crear equipo
PUT    /admin/equipos/:id          # Actualizar equipo
DELETE /admin/equipos/:id          # Eliminar equipo

# ÓRDENES
GET    /admin/ordenes              # Listar órdenes
POST   /admin/ordenes/asignar      # Asignar técnico
PUT    /admin/ordenes/:id/estado   # Cambiar estado

# COTIZACIONES
GET    /admin/cotizaciones         # Listar cotizaciones
POST   /admin/cotizaciones         # Crear cotización
PUT    /admin/cotizaciones/:id     # Actualizar cotización

# DASHBOARD
GET    /admin/dashboard            # Métricas
```

### Técnico (Protegido - rol: tecnico)

```
# ÓRDENES
GET    /tecnico/ordenes            # Mis órdenes asignadas
PUT    /tecnico/ordenes/:id/completar

# MANTENIMIENTOS
POST   /tecnico/mantenimientos     # Registrar mantenimiento
GET    /tecnico/mantenimientos     # Mis mantenimientos
PUT    /tecnico/mantenimientos/:id # Actualizar

# REPUESTOS
POST   /tecnico/repuestos          # Agregar repuesto
DELETE /tecnico/repuestos/:id      # Remover repuesto
```

### Cliente (Protegido - rol: cliente)

```
# PERFIL
GET    /cliente/perfil             # Ver perfil
PUT    /cliente/perfil             # Actualizar perfil

# EQUIPOS
GET    /cliente/equipos            # Mis equipos

# ÓRDENES
POST   /cliente/ordenes            # Solicitar servicio
GET    /cliente/ordenes            # Mis órdenes
GET    /cliente/ordenes/:id        # Detalle orden
PUT    /cliente/ordenes/:id/cancelar

# COTIZACIONES
GET    /cliente/cotizaciones       # Mis cotizaciones
PUT    /cliente/cotizaciones/:id/aprobar
PUT    /cliente/cotizaciones/:id/rechazar
```

---

## 👤 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|-----------|-----|
| Admin | `admin@sena.com` | `password` | Admin |
| Cliente 1 | `cliente@test.com` | `password` | Cliente |
| Cliente 2 | `maria@test.com` | `password` | Cliente |
| Técnico 1 | `tecnico@test.com` | `password` | Técnico |
| Técnico 2 | `pedro@test.com` | `password` | Técnico |

**Para cambiar:** Editar `backend/prisma/seed.js` y ejecutar `npm run seed`

---

## 🛠️ Tecnologías

### Backend
- **Express.js** - Framework web
- **Prisma** - ORM para MySQL
- **JSONWebToken** - Autenticación JWT
- **bcryptjs** - Hash de contraseñas
- **CORS** - Control de origen cruzado
- **Helmet** - Seguridad HTTP
- **Morgan** - Logger HTTP

### Frontend Web
- **React 18** - Librería UI
- **Vite** - Build tool
- **TailwindCSS** - Estilos
- **React Router v6** - Navegación
- **Axios** - HTTP client
- **Chart.js** - Gráficos

### Mobile
- **Expo** - Framework React Native
- **Expo Router** - Navegación
- **NativeWind** - TailwindCSS en React Native
- **Axios** - HTTP client

### Base de Datos
- **MySQL 8.0+** - Servidor de BD
- **Prisma Client** - ORM

---

## 📝 Variables de Entorno

### Backend (.env)

```env
# Base de Datos
DATABASE_URL="mysql://sena:senapass123@localhost:3306/mantenimiento_climatizacion"

# JWT
JWT_SECRET="tu-super-secreto-jwt-key-muy-larga-para-produccion"

# Servidor
PORT=3001
NODE_ENV=development

# Cloudinary (Opcional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend Web (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

### Mobile (app.json)

```json
{
  "expo": {
    "name": "Mantenimiento Climatización",
    "slug": "mantenimiento-app",
    "version": "1.0.0",
    "orientation": "portrait"
  }
}
```

---

## 🚀 Comandos Útiles

### Backend

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Prisma Studio (interfaz visual de BD)
npm run prisma:studio

# Generar cliente Prisma
npm run prisma:generate

# Reset de BD
npx prisma migrate reset

# Cargar datos de prueba
npm run seed
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

### Mobile

```bash
# Iniciar
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios

# Build APK
eas build --platform android

# Build IPA
eas build --platform ios
```

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Eliminar volúmenes
docker-compose down -v
```

---

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                     │
│              React 18 + Vite + TailwindCSS                  │
├─────────────────────────────────────────────────────────────┤
│               HTTP / REST API with JWT Auth                 │
├─────────────────────────────────────────────────────────────┤
│                  BACKEND API REST NODE.JS                   │
│    Express + Controllers + Services + JWT Validation        │
├─────────────────────────────────────────────────────────────┤
│   Prisma ORM + MySQL Database (Tablas + Relaciones)         │
├─────────────────────────────────────────────────────────────┤
│    Usuarios | Clientes | Técnicos | Equipos | Órdenes      │
│    Mantenimientos | Repuestos | Cotizaciones               │
└─────────────────────────────────────────────────────────────┘

                     APP MÓVIL (Expo)
                  React Native + NativeWind
                (Android APK + iOS + Web Preview)
                          ↓
                   Misma API Rest
                   Sincronización en tiempo real
```

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT con expiración (7 días)
- ✅ Validación de roles en cada endpoint
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Variables sensibles en .env
- ✅ SQL injection prevención (Prisma)

---

## 📞 Soporte

Para reportar bugs o sugerencias, crear un issue en GitHub.

---

## 📄 Licencia

MIT - Libre para uso comercial y educativo

---

**Desarrollado por:** BLACKBOXAI  
**Proyecto:** SENA ADSO - Gestión de Mantenimiento de Climatización  
**Fecha:** 2024-2025
- **Mobile**: React Native, Expo SDK 51
- **Extras**: Cloudinary (imágenes), PDF generation

## 📊 Próximos Pasos
Ver [TODO.md](./TODO.md)

**Estado**: Desarrollo fase 1 completado.

---

*Proyecto listo para GitHub & producción real*

