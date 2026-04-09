# 🏗️ Arquitectura del Sistema

## Visión General

```
┌────────────────────────────────────────────────────────────────┐
│                    CLIENTES / USUARIOS                         │
├────┬──────────────────────────────┬──────────────────────────┤
│    │                              │                          │
│  Web Browser                  Mobile App (Expo)              │
│  React 18 + Vite           React Native + NativeWind         │
│  http://localhost:5173      http://localhost:19000           │
│                                                               │
└────┴──────────────────────────────┴──────────────────────────┘
     │                              │
     └──────────────────┬───────────┘
                        │ HTTP/REST + JWT
              ┌─────────▼──────────┐
              │   BACKEND API      │
              │  Node.js/Express   │
              │ http://3001/api    │
              └─────────┬──────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼─────┐  ┌────▼─────┐  ┌────▼──────┐
    │Controllers│  │Services  │  │Middlewares│
    │           │  │          │  │(Auth,Role)│
    │-auth      │  │validación│  │           │
    │-admin     │  │lógica BD │  │JWT/Roles  │
    │-tecnico   │  │encriptado│  │CORS       │
    │-cliente   │  │          │  │           │
    └─────┬─────┘  └────┬─────┘  └────┬──────┘
          │             │             │
          └─────────────┼─────────────┘
                    │
         ┌──────────▼────────────┐
         │  Prisma ORM           │
         │  Schema Definitions   │
         │  Query Builder        │
         │  Migrations           │
         └──────────┬────────────┘
                    │
         ┌──────────▼────────────┐
         │   MySQL Database      │
         │   (Railway/Local)     │
         │                       │
         │  - usuarios           │
         │  - clientes           │
         │  - tecnicos           │
         │  - equipos            │
         │  - ordenes_trabajo    │
         │  - mantenimientos     │
         │  - repuestos          │
         │  - cotizaciones       │
         │  - detalle_repuestos  │
         └───────────────────────┘
```

---

## Componentes del Sistema

### 1. FRONTEND WEB
**Tecnología:** React 18 + Vite + TailwindCSS  
**Puerto:** `5173` (desarrollo)  
**Path:** `/frontend-web`

#### Estructura:
```
frontend-web/
├── src/
│   ├── pages/               # Páginas por rol
│   │   ├── Login.jsx        # Autenticación
│   │   ├── AdminDashboard.jsx
│   │   ├── TecnicoPanel.jsx
│   │   └── ClienteArea.jsx
│   ├── components/          # Componentes reutilizables
│   │   └── Layout.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.js       # Contexto autenticación
│   ├── services/            # Llamadas API
│   │   └── api.js           # Axios con interceptores
│   ├── App.jsx              # Enrutador principal
│   └── index.css            # Estilos globales
├── vite.config.js
├── tailwind.config.js
└── package.json
```

#### Flujo de Autenticación:
1. Usuario ingresa credenciales en `Login.jsx`
2. `useAuth.js` realiza POST a `/auth/login`
3. Backend retorna JWT + usuario
4. Token se guarda en `localStorage`
5. `api.js` adjunta token en cada request
6. Si token expira (401), se redirige a login

---

### 2. BACKEND API
**Tecnología:** Node.js + Express + Prisma  
**Puerto:** `3001`  
**Path:** `/backend`

#### Arquitectura de Capas:

```
routes/                  ← Definición de endpoints
│
middlewares/             ← Validación, autenticación, autorización
│   └── auth.js          (JWT verification, role checking)
│
controllers/             ← Lógica de endpoints
│   ├── authController.js     (login, register)
│   ├── adminController.js    (CRUD admin)
│   ├── tecnicoController.js  (CRUD técnico)
│   └── clienteController.js  (CRUD cliente)
│
(Prisma ORM)            ← Acceso a datos
│   └── schema.prisma    (Modelos + relaciones)
│
MySQL BD                 ← Persistencia
```

#### Flujo de una Solicitud:
```
1. Cliente envía: POST /api/admin/clientes
   Headers: Authorization: Bearer {token}

2. Express recibe en routes/admin.js

3. Middleware authMiddleware:
   - Extrae token del header
   - Verifica con JWT
   - Retorna error 401 si es inválido

4. Middleware roleMiddleware(['admin']):
   - Verifica que req.user.rol === 'admin'
   - Retorna error 403 si no autorizado

5. Controller createCliente():
   - Valida entrada (nombre, email, password, rol)
   - Hashea contraseña con bcryptjs
   - Crea usuario en DB via Prisma
   - Auto-crea perfil (Cliente/Tecnico)
   - Retorna 201 con datos creados

6. Cliente recibe: { success: true, cliente: {...} }
```

#### Endpoints por Módulo:

**AUTENTICACIÓN**
- POST `/api/auth/register` - Crear usuario
- POST `/api/auth/login` - Obtener JWT

**ADMIN**
- GET `/api/admin/dashboard` - Métricas
- CRUD `/api/admin/clientes` - Gestionar clientes
- CRUD `/api/admin/tecnicos` - Gestionar técnicos
- CRUD `/api/admin/equipos` - Gestionar equipos
- CRUD `/api/admin/ordenes` - Gestionar órdenes
- POST `/api/admin/ordenes/asignar` - Asignar técnico
- CRUD `/api/admin/cotizaciones` - Gestionar cotizaciones

**TÉCNICO**
- GET `/api/tecnico/ordenes` - Listar órdenes asignadas
- POST `/api/tecnico/mantenimientos` - Registrar mantenimiento
- GET `/api/tecnico/mantenimientos` - Listar mantenimientos
- POST `/api/tecnico/repuestos` - Agregar repuesto
- PUT `/api/tecnico/ordenes/:id/completar` - Completar orden

**CLIENTE**
- GET `/api/cliente/perfil` - Ver perfil
- GET `/api/cliente/equipos` - Listar equipos
- POST `/api/cliente/ordenes` - Solicitar servicio
- GET `/api/cliente/ordenes` - Listar órdenes
- GET `/api/cliente/cotizaciones` - Ver cotizaciones
- PUT `/api/cliente/cotizaciones/:id/aprobar` - Aprobar cotización

---

### 3. BASE DE DATOS
**Motor:** MySQL 8.0+  
**Cliente:** Prisma ORM  
**Hosting:** Docker (local) o Railway (producción)

#### Modelo de Datos:

```
┌─────────────────┐
│    usuarios     │
├─────────────────┤
│ id (PK)         │
│ nombre          │
│ email (UNIQUE)  │
│ password (hash) │
│ rol             │  ← ADMIN, TECNICO, CLIENTE
│ activo          │
│ created_at      │
└────────┬────────┘
         │ 1:1
    ┌────┴─────────────┬──────────────┐
    │                  │              │
┌───▼────────┐  ┌──────▼──────┐  ┌───▼──────┐
│  clientes  │  │  tecnicos   │  │ (si admin)
├────────────┤  ├─────────────┤  └──────────┘
│ id (PK)    │  │ id (PK)     │
│ usuario_id │  │ usuario_id  │
│ empresa    │  │ especialidad│
│ nit        │  │ certificado│
│ telefono   │  │ telefono   │
│ direccion  │  │             │
└────┬───────┘  └─────┬───────┘
     │                │
     └─────┬──────────┘
           │ N:1 (cliente)
        ┌──▼──────────┐
        │   equipos   │
        ├─────────────┤
        │ id (PK)     │
        │ cliente_id  │ ──→ clientes
        │ serial      │
        │ modelo      │
        │ tipo        │
        │ ubicacion   │
        │ estado      │
        └──┬──────────┘
           │ N:1 (equipo)
    ┌──────▼────────────┐
    │ ordenes_trabajo   │
    ├───────────────────┤
    │ id (PK)           │
    │ cliente_id        │ ──→ clientes
    │ equipo_id         │ ──→ equipos
    │ tecnico_id        │ ──→ tecnicos (NULL si sin asignar)
    │ descripcion       │
    │ estado            │
    │ prioridad         │
    │ fecha_solicitud   │
    │ fecha_asignacion  │
    └──┬────────────────┘
       │ N:1 (orden)
    ┌──▼─────────────┐
    │ mantenimientos │
    ├────────────────┤
    │ id (PK)        │
    │ orden_id       │ ──→ ordenes
    │ tipo           │ (PREVENTIVO|CORRECTIVO)
    │ descripcion    │
    │ evidencia_url  │
    │ horas_trabajadas
    └──┬──────────────┘
       │ N:M (repuestos)
    ┌──▼────────────────────┐
    │ detalle_repuestos     │
    ├────────────────────────┤
    │ id (PK)               │
    │ mantenimiento_id      │ ──→ mantenimientos
    │ repuesto_id           │ ──→ repuestos
    │ cantidad              │
    │ costo_total           │
    └───────────────────────┘

    ┌──────────────────┐
    │   repuestos      │
    ├──────────────────┤
    │ id (PK)          │
    │ nombre           │
    │ codigo (UNIQUE)  │
    │ precio_unitario  │
    │ stock            │
    └──────────────────┘

    ┌──────────────────┐
    │  cotizaciones    │
    ├──────────────────┤
    │ id (PK)          │
    │ orden_id         │ ──→ ordenes
    │ total            │
    │ descripcion      │
    │ estado           │
    │ fecha_generacion │
    └──────────────────┘
```

#### Relaciones Principales:
- **Usuario → Cliente (1:1)**  Perfil cliente
- **Usuario → Técnico (1:1)**  Perfil técnico
- **Cliente → Equipos (1:N)**  Un cliente tiene múltiples equipos
- **Equipo → OrdenTrabajo (1:N)**  Un equipo tiene múltiples órdenes
- **Técnico → OrdenTrabajo (1:N)**  Un técnico tiene múltiples órdenes
- **OrdenTrabajo → Mantenimiento (1:N)**  Una orden puede tener múltiples mantenimientos
- **Mantenimiento → Repuesto (N:M)**  Un mantenimiento usa múltiples repuestos  
- **OrdenTrabajo → Cotización (1:N)**  Una orden puede tener múltiples cotizaciones

---

### 4. APP MÓVIL
**Tecnología:** React Native + Expo + NativeWind  
**Compatibilidad:** Android (APK) + iOS  
**Path:** `/mobile-app`

#### Estructura:
```
mobile-app/
├── app/                    # Expo Router (file-based routing)
│   ├── _layout.jsx         # Root layout
│   ├── (auth)/             # Auth routes (tab protegida)
│   │   ├── _layout.jsx
│   │   └── login.jsx
│   ├── (tabs)/             # Main routes (protegidas)
│   │   ├── _layout.jsx     # Tab navigator
│   │   ├── admin.jsx
│   │   ├── tecnico.jsx
│   │   └── cliente.jsx
├── lib/
│   └── api.js              # Axios config
├── store/
│   └── auth.js             # Redux/Zustand (si aplica)
├── app.json                # Expo config
├── eas.json                # Build config
└── package.json
```

#### Sincronización con Backend:
- Usa misma API REST que web
- Autenticación con JWT (guardado en SecureStore)
- Interceptores para adjuntar token
- Auto-logout si token expira

---

## Flujos de Datos Principales

### Flujo 1: Login
```
Cliente:  Input email/password
   ↓
   ├─→ api.post('/auth/login', {email, password})
   
Backend:  Recibe credenciales
   ├─→ Busca usuario por email
   ├─→ Compara password con hash (bcrypt)
   ├─→ Si OK, genera JWT (expiración 7 días)
   └─→ Retorna {token, user, rol}
   
Cliente:  Guarda token en localStorage
   ├─→ Adjunta en futuras requests
   └─→ Redirige según rol (admin/tecnico/cliente)
```

### Flujo 2: Técnico Registra Mantenimiento
```
Técnico:  Selecciona orden, completa formulario
   ├─→ POST /tecnico/mantenimientos
   │   {ordenId, tipo, descripción, horasTrabajadas}
   
Backend:  Crea mantenimiento
   ├─→ Valida que orden pertenece al técnico
   ├─→ Inserta en tabla mantenimientos
   ├─→ Actualiza estado de orden a EN_PROGRESO
   ├─→ Adjunta archivo/URL de evidencia
   └─→ Retorna mantenimiento creado
   
Técnico:  Ve éxito y vuelve a órdenes
```

### Flujo 3: Cliente Solicita Servicio
```
Cliente:  Selecciona equipo, describe problema
   ├─→ POST /cliente/ordenes
   │   {equipoId, descripción, prioridad}
   
Backend:  Crea orden
   ├─→ Obtiene cliente_id desde JWT (req.user)
   ├─→ Valida que equipo pertenece a cliente
   ├─→ Inserta orden con estado PENDIENTE
   ├─→ Notifica admin (si aplica)
   └─→ Retorna orden creada
   
Admin:   Ve orden pendiente en dashboard
   ├─→ Asigna técnico: POST /admin/ordenes/asignar
   ├─→ Orden cambia estado a ASIGNADA
   └─→ Técnico ve orden en su panel (Expo/Web)
```

---

## Seguridad

### Capas de Protección:

1. **Password Hashing**
   - Algoritmo: bcryptjs (10 rounds)
   - Nunca se almacenan contraseñas en texto plano

2. **JWT (JSON Web Tokens)**
   - Expiración: 7 días
   - Firmado con JWT_SECRET
   - Invalidado al logout

3. **Validación de Roles**
   - Middleware `roleMiddleware` en cada ruta protegida
   - Previene acceso a rutas por rol

4. **CORS**
   - Solo permite origen del frontend
   - Configurado en Express

5. **Helmet**
   - Headers de seguridad HTTP
   - Previene ataques comunes

6. **Input Validation**
   - Prisma previene SQL injection
   - Validación básica en controllers

---

## Escalabilidad Futura

### Mejoras Posibles:
1. **Cache (Redis)**
   - Dashboard metrics
   - Órdenes frecuentes

2. **Colas (Bull/RabbitMQ)**
   - Notificaciones asincrónicas
   - Reportes en background

3. **WebSockets**
   - Actualizaciones en tiempo real
   - Chat técnico-cliente

4. **Microservicios**
   - Separar módulos por servicio
   - Escalabilidad independiente

5. **GraphQL**
   - Reemplazo de REST
   - Queries optimizadas

6. **Testing**
   - Jest + Supertest (backend)
   - Vitest + React Testing Library (frontend)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0  
**Autor:** BLACKBOXAI