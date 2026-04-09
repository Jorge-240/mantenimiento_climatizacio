// Seed Script - Insertar datos de prueba
// Ejecutar: node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  const count = await prisma.usuario.count();
  if (count > 0) {
    console.log('✅ La base de datos ya tiene usuarios. Saltando el vaciado y seeding para no borrar datos existentes.');
    return;
  }

  // Limpiar datos existentes (se ejecutará sólo si count === 0, o sea, nunca si hay errores)
  await prisma.detalleRepuesto.deleteMany({});
  await prisma.repuesto.deleteMany({});
  await prisma.cotizacion.deleteMany({});
  await prisma.mantenimiento.deleteMany({});
  await prisma.ordenTrabajo.deleteMany({});
  await prisma.equipo.deleteMany({});
  await prisma.tecnico.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.usuario.deleteMany({});

  const hashedPassword = await bcrypt.hash('password', 10);

  // ==================== USUARIOS ====================
  console.log('📝 Creando usuarios...');

  const adminUser = await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@sena.com',
      password: hashedPassword,
      rol: 'ADMIN'
    }
  });

  const cliente1User = await prisma.usuario.create({
    data: {
      nombre: 'Juan García',
      email: 'cliente@test.com',
      password: hashedPassword,
      rol: 'CLIENTE'
    }
  });

  const cliente2User = await prisma.usuario.create({
    data: {
      nombre: 'María López',
      email: 'maria@test.com',
      password: hashedPassword,
      rol: 'CLIENTE'
    }
  });

  const tecnico1User = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Rodríguez',
      email: 'tecnico@test.com',
      password: hashedPassword,
      rol: 'TECNICO'
    }
  });

  const tecnico2User = await prisma.usuario.create({
    data: {
      nombre: 'Pedro Martínez',
      email: 'pedro@test.com',
      password: hashedPassword,
      rol: 'TECNICO'
    }
  });

  // ==================== CLIENTES ====================
  console.log('👤 Creando clientes...');

  const cliente1 = await prisma.cliente.create({
    data: {
      usuarioId: cliente1User.id,
      empresa: 'Distribuidora Nacional',
      nit: '890.123.456-1',
      telefono: '+57 300 1234567',
      direccion: 'Cra 5 # 22-80, Bogotá'
    }
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      usuarioId: cliente2User.id,
      empresa: 'Hotel Boutique Miraflores',
      nit: '890.654.321-9',
      telefono: '+57 301 9876543',
      direccion: 'Calle 72 # 11-45, Medellín'
    }
  });

  // ==================== TÉCNICOS ====================
  console.log('🔧 Creando técnicos...');

  const tecnico1 = await prisma.tecnico.create({
    data: {
      usuarioId: tecnico1User.id,
      especialidad: 'Mantenimiento preventivo y correctivo',
      telefono: '+57 310 5555555',
      certificado: 'ISO-9001-2023'
    }
  });

  const tecnico2 = await prisma.tecnico.create({
    data: {
      usuarioId: tecnico2User.id,
      especialidad: 'Reparación de compresores',
      telefono: '+57 320 6666666',
      certificado: 'Refrigeración avanzada'
    }
  });

  // ==================== EQUIPOS ====================
  console.log('🌡️ Creando equipos...');

  const equipo1 = await prisma.equipo.create({
    data: {
      clienteId: cliente1.id,
      serial: 'AC-2023-001',
      modelo: 'LG DUALCOOL 24000 BTU',
      tipo: 'AIRE_ACONDICIONADO',
      ubicacion: 'Oficina Principal',
      fechaInstalacion: new Date('2023-01-15'),
      estado: 'OPERATIVO'
    }
  });

  const equipo2 = await prisma.equipo.create({
    data: {
      clienteId: cliente1.id,
      serial: 'AC-2023-002',
      modelo: 'Samsung WindFree 18000 BTU',
      tipo: 'AIRE_ACONDICIONADO',
      ubicacion: 'Sala de juntas',
      fechaInstalacion: new Date('2023-02-20'),
      estado: 'EN_MANTENIMIENTO'
    }
  });

  const equipo3 = await prisma.equipo.create({
    data: {
      clienteId: cliente2.id,
      serial: 'CHIL-2023-001',
      modelo: 'Chiller Carrier 30 TR',
      tipo: 'CHILLER',
      ubicacion: 'Cuarto de máquinas',
      fechaInstalacion: new Date('2022-06-10'),
      estado: 'OPERATIVO'
    }
  });

  // ==================== ÓRDENES DE TRABAJO ====================
  console.log('📋 Creando órdenes de trabajo...');

  const orden1 = await prisma.ordenTrabajo.create({
    data: {
      clienteId: cliente1.id,
      equipoId: equipo1.id,
      tecnicoId: tecnico1.id,
      descripcion: 'Revisión general y limpieza de filtros',
      estado: 'COMPLETADA',
      prioridad: 'MEDIA',
      fechaAsignacion: new Date('2024-01-10')
    }
  });

  const orden2 = await prisma.ordenTrabajo.create({
    data: {
      clienteId: cliente1.id,
      equipoId: equipo2.id,
      tecnicoId: tecnico2.id,
      descripcion: 'Reparación de compresor',
      estado: 'EN_PROGRESO',
      prioridad: 'ALTA',
      fechaAsignacion: new Date('2024-01-15')
    }
  });

  const orden3 = await prisma.ordenTrabajo.create({
    data: {
      clienteId: cliente2.id,
      equipoId: equipo3.id,
      tecnicoId: null,
      descripcion: 'Mantenimiento preventivo mensual',
      estado: 'PENDIENTE',
      prioridad: 'MEDIA'
    }
  });

  // ==================== MANTENIMIENTOS ====================
  console.log('🛠️ Creando mantenimientos...');

  const mant1 = await prisma.mantenimiento.create({
    data: {
      ordenId: orden1.id,
      tipo: 'PREVENTIVO',
      descripcion: 'Limpieza de filtros, inspección de componentes y lubricación',
      fechaEjecucion: new Date('2024-01-10'),
      horasTrabajadas: 2.5,
      evidenciaUrl: 'https://example.com/photos/mant1.jpg'
    }
  });

  const mant2 = await prisma.mantenimiento.create({
    data: {
      ordenId: orden2.id,
      tipo: 'CORRECTIVO',
      descripcion: 'Cambio de compresor defectuoso',
      fechaEjecucion: new Date('2024-01-15'),
      horasTrabajadas: 4.0,
      evidenciaUrl: 'https://example.com/photos/mant2.jpg'
    }
  });

  // ==================== REPUESTOS ====================
  console.log('🔩 Creando catálogo de repuestos...');

  const repuesto1 = await prisma.repuesto.create({
    data: {
      nombre: 'Filtro aire 24x24',
      codigo: 'FILTER-001',
      precioUnitario: 25000,
      stock: 50
    }
  });

  const repuesto2 = await prisma.repuesto.create({
    data: {
      nombre: 'Compresor 24000 BTU',
      codigo: 'COMP-001',
      precioUnitario: 1200000,
      stock: 5
    }
  });

  const repuesto3 = await prisma.repuesto.create({
    data: {
      nombre: 'Gas refrigerante R410A',
      codigo: 'GAS-001',
      precioUnitario: 85000,
      stock: 30
    }
  });

  const repuesto4 = await prisma.repuesto.create({
    data: {
      nombre: 'Aceite sintético POE 100ml',
      codigo: 'OIL-001',
      precioUnitario: 45000,
      stock: 100
    }
  });

  // ==================== DETALLE REPUESTOS ====================
  console.log('📦 Asignando repuestos a mantenimientos...');

  await prisma.detalleRepuesto.create({
    data: {
      mantenimientoId: mant1.id,
      repuestoId: repuesto1.id,
      cantidad: 1,
      costoTotal: 25000
    }
  });

  await prisma.detalleRepuesto.create({
    data: {
      mantenimientoId: mant1.id,
      repuestoId: repuesto4.id,
      cantidad: 1,
      costoTotal: 45000
    }
  });

  await prisma.detalleRepuesto.create({
    data: {
      mantenimientoId: mant2.id,
      repuestoId: repuesto2.id,
      cantidad: 1,
      costoTotal: 1200000
    }
  });

  await prisma.detalleRepuesto.create({
    data: {
      mantenimientoId: mant2.id,
      repuestoId: repuesto3.id,
      cantidad: 2,
      costoTotal: 170000
    }
  });

  // ==================== COTIZACIONES ====================
  console.log('💰 Creando cotizaciones...');

  await prisma.cotizacion.create({
    data: {
      ordenId: orden1.id,
      total: 70000,
      descripcion: 'Mantenimiento preventivo: limpieza, inspección y lubricación',
      estado: 'APROBADA'
    }
  });

  await prisma.cotizacion.create({
    data: {
      ordenId: orden2.id,
      total: 1415000,
      descripcion: 'Cambio de compresor + gas + aceite + mano de obra',
      estado: 'PENDIENTE'
    }
  });

  await prisma.cotizacion.create({
    data: {
      ordenId: orden3.id,
      total: 150000,
      descripcion: 'Mantenimiento preventivo mensual chiller',
      estado: 'PENDIENTE'
    }
  });

  console.log('✅ ¡Seed completado exitosamente!');
  console.log('\n📌 Credenciales de prueba:');
  console.log('   Admin: admin@sena.com / password');
  console.log('   Cliente 1: cliente@test.com / password');
  console.log('   Cliente 2: maria@test.com / password');
  console.log('   Técnico 1: tecnico@test.com / password');
  console.log('   Técnico 2: pedro@test.com / password');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
