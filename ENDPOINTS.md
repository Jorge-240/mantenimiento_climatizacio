# 📚 Documentación Endpoints API

**Base URL:** `http://localhost:3001/api`  
**Autenticación:** Bearer Token (JWT)

---

## 🔐 Autenticación

### Registrarse
```http
POST /auth/register
Content-Type: application/json

{
  "nombre": "Juan García",
  "email": "juan@ejemplo.com",
  "password": "miPassword123",
  "rol": "cliente" // admin, tecnico, cliente
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan García",
    "email": "juan@ejemplo.com",
    "rol": "cliente"
  }
}
```

---

### Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@sena.com",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@sena.com",
    "rol": "admin"
  }
}
```

---

## 👨‍💼 ADMIN - Endpoints

### Clientes

#### Listar Clientes
```http
GET /admin/clientes?limit=10&skip=0&search=juan
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "usuarioId": 2,
      "empresa": "Distribuidora Nacional",
      "nit": "890.123.456-1",
      "telefono": "+57 300 1234567",
      "direccion": "Cra 5 # 22-80, Bogotá",
      "usuario": {
        "id": 2,
        "nombre": "Juan García",
        "email": "juan@test.com",
        "rol": "CLIENTE"
      },
      "_count": {
        "equipos": 3,
        "ordenes": 5
      }
    }
  ],
  "total": 1,
  "limit": 10,
  "skip": 0
}
```

#### Crear Cliente
```http
POST /admin/clientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Pedro López",
  "email": "pedro@empresa.com",
  "password": "securePass123",
  "empresa": "Empresa Refrigeración S.A.",
  "nit": "890.654.321-9",
  "telefono": "+57 301 9876543",
  "direccion": "Calle 72 # 11-45, Medellín"
}
```

**Response (201):**
```json
{
  "success": true,
  "cliente": {
    "id": 2,
    "usuarioId": 3,
    "empresa": "Empresa Refrigeración S.A.",
    "nit": "890.654.321-9",
    "usuario": {...}
  }
}
```

#### Actualizar Cliente
```http
PUT /admin/clientes/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Juan García Actualizado",
  "empresa": "Nueva Empresa",
  "telefono": "+57 301 5555555",
  "direccion": "Nueva dirección"
}
```

#### Eliminar Cliente
```http
DELETE /admin/clientes/1
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cliente eliminado"
}
```

---

### Técnicos

#### Listar Técnicos
```http
GET /admin/tecnicos?limit=10&skip=0
Authorization: Bearer {token}
```

#### Crear Técnico
```http
POST /admin/tecnicos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Carlos Rodríguez",
  "email": "carlos@sena.com",
  "password": "techPass123",
  "especialidad": "Mantenimiento preventivo",
  "telefono": "+57 310 5555555",
  "certificado": "ISO-9001-2023"
}
```

#### Actualizar Técnico
```http
PUT /admin/tecnicos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Carlos Rodríguez",
  "especialidad": "Reparación de compresores",
  "certificado": "Refrigeración avanzada 2024"
}
```

#### Eliminar Técnico
```http
DELETE /admin/tecnicos/1
Authorization: Bearer {token}
```

---

### Equipos

#### Listar Equipos
```http
GET /admin/equipos?clienteId=1&limit=10&skip=0
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "clienteId": 1,
      "serial": "AC-2023-001",
      "modelo": "LG DUALCOOL 24000 BTU",
      "tipo": "AIRE_ACONDICIONADO",
      "ubicacion": "Oficina Principal",
      "fechaInstalacion": "2023-01-15T00:00:00Z",
      "estado": "OPERATIVO",
      "createdAt": "2024-01-10T10:30:00Z",
      "cliente": {...}
    }
  ],
  "total": 1
}
```

#### Crear Equipo
```http
POST /admin/equipos
Authorization: Bearer {token}
Content-Type: application/json

{
  "clienteId": 1,
  "serial": "AC-2024-001",
  "modelo": "Samsung WindFree 18000 BTU",
  "tipo": "AIRE_ACONDICIONADO",
  "ubicacion": "Sala de juntas",
  "fechaInstalacion": "2024-01-15"
}
```

#### Actualizar Equipo
```http
PUT /admin/equipos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "serial": "AC-2024-001",
  "modelo": "Samsung WindFree 18000 BTU",
  "tipo": "AIRE_ACONDICIONADO",
  "ubicacion": "Sala de juntas",
  "estado": "EN_MANTENIMIENTO"
}
```

#### Eliminar Equipo
```http
DELETE /admin/equipos/1
Authorization: Bearer {token}
```

---

### Órdenes de Trabajo

#### Listar Órdenes
```http
GET /admin/ordenes?estado=PENDIENTE&limit=10&skip=0
Authorization: Bearer {token}
```

#### Asignar Técnico a Orden
```http
POST /admin/ordenes/asignar
Authorization: Bearer {token}
Content-Type: application/json

{
  "ordenId": 1,
  "tecnicoId": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "orden": {
    "id": 1,
    "estado": "ASIGNADA",
    "fechaAsignacion": "2024-01-15T10:30:00Z",
    "tecnico": {...},
    "cliente": {...},
    "equipo": {...}
  }
}
```

#### Cambiar Estado Orden
```http
PUT /admin/ordenes/1/estado
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "EN_PROGRESO" // PENDIENTE, ASIGNADA, EN_PROGRESO, COMPLETADA, CANCELADA
}
```

---

### Cotizaciones

#### Listar Cotizaciones
```http
GET /admin/cotizaciones?estado=PENDIENTE&limit=10&skip=0
Authorization: Bearer {token}
```

#### Crear Cotización
```http
POST /admin/cotizaciones
Authorization: Bearer {token}
Content-Type: application/json

{
  "ordenId": 1,
  "total": 1500000.00,
  "descripcion": "Cambio de compresor + gas + mano de obra"
}
```

#### Actualizar Cotización
```http
PUT /admin/cotizaciones/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "estado": "APROBADA" // PENDIENTE, APROBADA, RECHAZADA
}
```

---

### Dashboard

#### Obtener Métricas
```http
GET /admin/dashboard
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "totalClientes": 5,
  "totalTecnicos": 3,
  "totalEquipos": 12,
  "totalOrdenes": 25,
  "ordenesPendientes": 8,
  "ordenesEnProgreso": 4,
  "ordenesCompletadas": 13,
  "cotizacionesPendientes": 2
}
```

---

## 🔧 TÉCNICO - Endpoints

### Órdenes Asignadas

#### Listar mis Órdenes
```http
GET /tecnico/ordenes?estado=EN_PROGRESO&limit=10&skip=0
Authorization: Bearer {token}
```

#### Completar Orden
```http
PUT /tecnico/ordenes/1/completar
Authorization: Bearer {token}
Content-Type: application/json

{
  "ordenId": 1,
  "observacionesFinal": "Trabajo completado exitosamente"
}
```

---

### Mantenimientos

#### Crear Mantenimiento
```http
POST /tecnico/mantenimientos
Authorization: Bearer {token}
Content-Type: application/json

{
  "ordenId": 1,
  "tipo": "CORRECTIVO",
  "descripcion": "Cambio de compresor defectuoso",
  "evidenciaUrl": "https://cloudinary.com/photos/mant1.jpg",
  "horasTrabajadas": 4.5
}
```

**Response (201):**
```json
{
  "success": true,
  "mantenimiento": {
    "id": 1,
    "ordenId": 1,
    "tipo": "CORRECTIVO",
    "descripcion": "Cambio de compresor defectuoso",
    "fechaEjecucion": "2024-01-15T14:30:00Z",
    "horasTrabajadas": 4.5,
    "repuestos": [...]
  }
}
```

#### Listar mis Mantenimientos
```http
GET /tecnico/mantenimientos?limit=10&skip=0
Authorization: Bearer {token}
```

#### Actualizar Mantenimiento
```http
PUT /tecnico/mantenimientos/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo": "PREVENTIVO",
  "descripcion": "Revisión general y limpieza",
  "horasTrabajadas": 2.5
}
```

---

### Repuestos

#### Agregar Repuesto a Mantenimiento
```http
POST /tecnico/repuestos
Authorization: Bearer {token}
Content-Type: application/json

{
  "mantenimientoId": 1,
  "repuestoId": 2,
  "cantidad": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "detalleRepuesto": {
    "id": 1,
    "mantenimientoId": 1,
    "repuestoId": 2,
    "cantidad": 1,
    "costoTotal": 1200000.00,
    "repuesto": {
      "id": 2,
      "nombre": "Compresor 24000 BTU",
      "codigo": "COMP-001",
      "precioUnitario": 1200000.00
    }
  }
}
```

#### Eliminar Repuesto
```http
DELETE /tecnico/repuestos/1
Authorization: Bearer {token}
```

---

## 👤 CLIENTE - Endpoints

### Perfil

#### Ver mi Perfil
```http
GET /cliente/perfil
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "usuarioId": 2,
  "empresa": "Distribuidora Nacional",
  "nit": "890.123.456-1",
  "telefono": "+57 300 1234567",
  "direccion": "Cra 5 # 22-80, Bogotá",
  "usuario": {
    "id": 2,
    "nombre": "Juan García",
    "email": "juan@test.com",
    "rol": "CLIENTE"
  }
}
```

#### Actualizar mi Perfil
```http
PUT /cliente/perfil
Authorization: Bearer {token}
Content-Type: application/json

{
  "empresa": "Distribuidora Nacional",
  "telefono": "+57 301 5555555",
  "direccion": "Nueva dirección"
}
```

---

### Equipos

#### Listar mis Equipos
```http
GET /cliente/equipos?limit=10&skip=0
Authorization: Bearer {token}
```

---

### Órdenes

#### Solicitar Servicio
```http
POST /cliente/ordenes
Authorization: Bearer {token}
Content-Type: application/json

{
  "equipoId": 1,
  "descripcion": "El aire acondicionado no está enfriando",
  "prioridad": "ALTA" // BAJA, MEDIA, ALTA, URGENTE
}
```

**Response (201):**
```json
{
  "success": true,
  "orden": {
    "id": 1,
    "clienteId": 1,
    "equipoId": 1,
    "descripcion": "El aire acondicionado no está enfriando",
    "estado": "PENDIENTE",
    "prioridad": "ALTA",
    "fechaSolicitud": "2024-01-15T10:30:00Z"
  }
}
```

#### Listar mis Órdenes
```http
GET /cliente/ordenes?estado=PENDIENTE&limit=10&skip=0
Authorization: Bearer {token}
```

#### Ver Detalle de Orden
```http
GET /cliente/ordenes/1
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "clienteId": 1,
  "equipoId": 1,
  "tecnicoId": 1,
  "descripcion": "El aire acondicionado no está enfriando",
  "estado": "EN_PROGRESO",
  "prioridad": "ALTA",
  "fechaSolicitud": "2024-01-15T10:30:00Z",
  "fechaAsignacion": "2024-01-15T11:00:00Z",
  "equipo": {...},
  "tecnico": {...},
  "mantenimientos": [...],
  "cotizaciones": [...]
}
```

#### Cancelar Orden
```http
PUT /cliente/ordenes/1/cancelar
Authorization: Bearer {token}
Content-Type: application/json

{
  "motivo": "Problema solucionado por otro proveedor"
}
```

---

### Cotizaciones

#### Listar mis Cotizaciones
```http
GET /cliente/cotizaciones?limit=10&skip=0
Authorization: Bearer {token}
```

#### Aprobar Cotización
```http
PUT /cliente/cotizaciones/1/aprobar
Authorization: Bearer {token}
```

#### Rechazar Cotización
```http
PUT /cliente/cotizaciones/1/rechazar
Authorization: Bearer {token}
```

---

## 🔍 Estados y Valores Válidos

### Estados de Orden
- `PENDIENTE` - Esperando asignación
- `ASIGNADA` - Asignada a técnico
- `EN_PROGRESO` - Técnico trabajando
- `COMPLETADA` - Trabajo terminado
- `CANCELADA` - Cancelada por cliente

### Tipos de Mantenimiento
- `PREVENTIVO` - Revisión preventiva
- `CORRECTIVO` - Reparación

### Prioridades
- `BAJA`
- `MEDIA`
- `ALTA`
- `URGENTE`

### Estados de Cotización
- `PENDIENTE`
- `APROBADA`
- `RECHAZADA`

### Estados de Equipo
- `OPERATIVO`
- `EN_MANTENIMIENTO`
- `FUERA_SERVICIO`

### Tipos de Equipo
- `AIRE_ACONDICIONADO`
- `VENTILADOR`
- `CALEFACION`
- `CHILLER`

---

## ❌ Códigos de Error

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (token faltante o inválido)
- `403` - Forbidden (rol insuficiente)
- `404` - Not Found (recurso no existe)
- `500` - Server Error

---

## 🔑 Headers Requeridos

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

---

**Última actualización:** 2024-01-15  
**Versión API:** 1.0.0
