-- ============================================================
-- Sistema Gestión Mantenimiento de Equipos de Climatización
-- Base de Datos MySQL 8.0+
-- Compatible con Railway, Clever Cloud, Amazon RDS
-- ============================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mantenimiento_climatizacion;
USE mantenimiento_climatizacion;

-- ============================================================
-- TABLA: usuarios (Base para todos los roles)
-- ============================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'TECNICO', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: clientes (1:1 con usuario CLIENTE)
-- ============================================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    empresa VARCHAR(150),
    nit VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_nit (nit),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: tecnicos (1:1 con usuario TECNICO)
-- ============================================================
CREATE TABLE tecnicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    especialidad VARCHAR(200),
    telefono VARCHAR(20),
    certificado VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_especialidad (especialidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: equipos
-- ============================================================
CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    serial VARCHAR(50) UNIQUE NOT NULL,
    modelo VARCHAR(150) NOT NULL,
    tipo ENUM('AIRE_ACONDICIONADO', 'VENTILADOR', 'CALEFACION', 'CHILLER') NOT NULL,
    ubicacion VARCHAR(200),
    fecha_instalacion DATE,
    estado ENUM('OPERATIVO', 'EN_MANTENIMIENTO', 'FUERA_SERVICIO') DEFAULT 'OPERATIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_serial (serial),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: ordenes_trabajo
-- ============================================================
CREATE TABLE ordenes_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    equipo_id INT NOT NULL,
    tecnico_id INT NULL,
    descripcion TEXT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_asignacion TIMESTAMP NULL,
    estado ENUM('PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA') DEFAULT 'PENDIENTE',
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id) ON DELETE SET NULL,
    INDEX idx_cliente_id (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_tecnico_id (tecnico_id),
    INDEX idx_fecha_solicitud (fecha_solicitud),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: mantenimientos
-- ============================================================
CREATE TABLE mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    tipo ENUM('PREVENTIVO', 'CORRECTIVO') NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia_url VARCHAR(500),
    fecha_ejecucion TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    horas_trabajadas DECIMAL(4,2),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
    INDEX idx_orden_id (orden_id),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: repuestos (Catálogo de repuestos)
-- ============================================================
CREATE TABLE repuestos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: detalle_repuestos (Many-to-Many: Mantenimiento <-> Repuestos)
-- ============================================================
CREATE TABLE detalle_repuestos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mantenimiento_id INT NOT NULL,
    repuesto_id INT NOT NULL,
    cantidad INT NOT NULL,
    costo_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimientos(id) ON DELETE CASCADE,
    FOREIGN KEY (repuesto_id) REFERENCES repuestos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_mant_repuesto (mantenimiento_id, repuesto_id),
    INDEX idx_mantenimiento_id (mantenimiento_id),
    INDEX idx_repuesto_id (repuesto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: cotizaciones
-- ============================================================
CREATE TABLE cotizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (orden_id) REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
    INDEX idx_orden_id (orden_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATOS DE INICIO
-- ============================================================

-- Usuario Admin
INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('Administrador SENA', 'admin@sena.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', TRUE)
ON DUPLICATE KEY UPDATE rol='ADMIN';

-- Usuario Cliente 1
INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('Juan García López', 'cliente@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CLIENTE', TRUE)
ON DUPLICATE KEY UPDATE rol='CLIENTE';

-- Cliente 1 Profile
INSERT INTO clientes (usuario_id, empresa, nit, telefono, direccion) VALUES 
(2, 'Distribuidora Nacional', '890123456-1', '+57 300 1234567', 'Cra 5 # 22-80, Bogotá')
ON DUPLICATE KEY UPDATE empresa='Distribuidora Nacional';

-- Usuario Cliente 2
INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('María López Rodríguez', 'maria@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CLIENTE', TRUE)
ON DUPLICATE KEY UPDATE rol='CLIENTE';

-- Cliente 2 Profile
INSERT INTO clientes (usuario_id, empresa, nit, telefono, direccion) VALUES 
(4, 'Hotel Boutique Miraflores', '890654321-9', '+57 301 9876543', 'Calle 72 # 11-45, Medellín')
ON DUPLICATE KEY UPDATE empresa='Hotel Boutique Miraflores';

-- Usuario Técnico 1
INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('Carlos Rodríguez Martínez', 'tecnico@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TECNICO', TRUE)
ON DUPLICATE KEY UPDATE rol='TECNICO';

-- Técnico 1 Profile
INSERT INTO tecnicos (usuario_id, especialidad, telefono, certificado) VALUES 
(5, 'Mantenimiento Preventivo y Correctivo', '+57 310 5555555', 'ISO-9001-2023')
ON DUPLICATE KEY UPDATE especialidad='Mantenimiento Preventivo y Correctivo';

-- Usuario Técnico 2
INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES 
('Pedro Martínez García', 'pedro@test.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TECNICO', TRUE)
ON DUPLICATE KEY UPDATE rol='TECNICO';

-- Técnico 2 Profile
INSERT INTO tecnicos (usuario_id, especialidad, telefono, certificado) VALUES 
(6, 'Reparación de Compresores y Refrigeración Avanzada', '+57 320 6666666', 'Refrigeración Avanzada 2024')
ON DUPLICATE KEY UPDATE especialidad='Reparación de Compresores y Refrigeración Avanzada';

-- Equipos de prueba
INSERT INTO equipos (cliente_id, serial, modelo, tipo, ubicacion, fecha_instalacion, estado) VALUES 
(1, 'AC-2023-001', 'LG DUALCOOL 24000 BTU', 'AIRE_ACONDICIONADO', 'Oficina Principal', '2023-01-15', 'OPERATIVO'),
(1, 'AC-2023-002', 'Samsung WindFree 18000 BTU', 'AIRE_ACONDICIONADO', 'Sala de Juntas', '2023-02-20', 'EN_MANTENIMIENTO'),
(2, 'CHIL-2023-001', 'Chiller Carrier 30 TR', 'CHILLER', 'Cuarto de Máquinas', '2022-06-10', 'OPERATIVO')
ON DUPLICATE KEY UPDATE modelo=VALUES(modelo);

-- ============================================================
-- COMENTARIOS Y NOTAS
-- ============================================================
-- Password hasheado con bcrypt (10 rounds): 'password'
-- Todos los usuarios de prueba tienen la contraseña: password
-- 
-- Base de Datos configurada con:
-- - CHARSET utf8mb4 para soporte Unicode
-- - Collation utf8mb4_unicode_ci para comparación correcta
-- - Indices en campos frecuentemente consultados
-- - InnoDB para soporte de transacciones y FK
-- - ON DELETE CASCADE para integridad referencial
-- ============================================================