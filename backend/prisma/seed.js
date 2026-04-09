const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos solicitado por el usuario...');

  // Limpiamos todo para asegurar un estado limpio en este despliegue
  try {
    // El orden de borrado es importante por las claves foráneas
    await prisma.detalleRepuesto.deleteMany({});
    await prisma.repuesto.deleteMany({});
    await prisma.cotizacion.deleteMany({});
    await prisma.mantenimiento.deleteMany({});
    await prisma.ordenTrabajo.deleteMany({});
    await prisma.equipo.deleteMany({});
    await prisma.tecnico.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.usuario.deleteMany({});
    console.log('🗑️ Base de datos limpiada.');
  } catch (e) {
    console.log('⚠️ Aviso durante limpieza:', e.message);
  }

  // Hash proporcionado por el usuario para la contraseña "password"
  const userHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

  // 1. Usuarios
  console.log('👤 Creando usuarios...');
  
  const userAdmin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador SENA',
      email: 'admin@sena.com',
      password: userHash,
      rol: 'ADMIN'
    }
  });

  const userCliente1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan García López',
      email: 'cliente@test.com',
      password: userHash,
      rol: 'CLIENTE'
    }
  });

  const userCliente2 = await prisma.usuario.create({
    data: {
      nombre: 'María López Rodríguez',
      email: 'maria@test.com',
      password: userHash,
      rol: 'CLIENTE'
    }
  });

  const userTecnico1 = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Rodríguez Martínez',
      email: 'tecnico@test.com',
      password: userHash,
      rol: 'TECNICO'
    }
  });

  const userTecnico2 = await prisma.usuario.create({
    data: {
      nombre: 'Pedro Martínez García',
      email: 'pedro@test.com',
      password: userHash,
      rol: 'TECNICO'
    }
  });

  // 2. Perfiles (Clientes y Técnicos)
  console.log('📋 Creando perfiles...');

  const cliente1 = await prisma.cliente.create({
    data: {
      usuarioId: userCliente1.id,
      empresa: 'Distribuidora Nacional',
      nit: '890123456-1',
      telefono: '+57 300 1234567',
      direccion: 'Cra 5 # 22-80, Bogotá'
    }
  });

  const cliente2 = await prisma.cliente.create({
    data: {
      usuarioId: userCliente2.id,
      empresa: 'Hotel Boutique Miraflores',
      nit: '890654321-9',
      telefono: '+57 301 9876543',
      direccion: 'Calle 72 # 11-45, Medellín'
    }
  });

  const tecnico1 = await prisma.tecnico.create({
    data: {
      usuarioId: userTecnico1.id,
      especialidad: 'Mantenimiento Preventivo y Correctivo',
      telefono: '+57 310 5555555',
      certificado: 'ISO-9001-2023'
    }
  });

  const tecnico2 = await prisma.tecnico.create({
    data: {
      usuarioId: userTecnico2.id,
      especialidad: 'Reparación de Compresores y Refrigeración Avanzada',
      telefono: '+57 320 6666666',
      certificado: 'Refrigeración Avanzada 2024'
    }
  });

  // 3. Equipos
  console.log('🌡️ Creando equipos...');

  await prisma.equipo.createMany({
    data: [
      {
        clienteId: cliente1.id,
        serial: 'AC-2023-001',
        modelo: 'LG DUALCOOL 24000 BTU',
        tipo: 'AIRE_ACONDICIONADO',
        ubicacion: 'Oficina Principal',
        fechaInstalacion: new Date('2023-01-15'),
        estado: 'OPERATIVO'
      },
      {
        clienteId: cliente1.id,
        serial: 'AC-2023-002',
        modelo: 'Samsung WindFree 18000 BTU',
        tipo: 'AIRE_ACONDICIONADO',
        ubicacion: 'Sala de Juntas',
        fechaInstalacion: new Date('2023-02-20'),
        estado: 'EN_MANTENIMIENTO'
      },
      {
        clienteId: cliente2.id,
        serial: 'CHIL-2023-001',
        modelo: 'Chiller Carrier 30 TR',
        tipo: 'CHILLER',
        ubicacion: 'Cuarto de Máquinas',
        fechaInstalacion: new Date('2022-06-10'),
        estado: 'OPERATIVO'
      }
    ]
  });

  console.log('✅ ¡Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
