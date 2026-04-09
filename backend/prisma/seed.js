const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 --- INICIANDO PROCESO DE SEEDING FORZADO ---');
  console.log('📡 DATABASE_URL detected:', process.env.DATABASE_URL ? 'YES' : 'NO (Check Railway variables!)');

  try {
    // 1. Limpieza absoluta
    console.log('🧹 Limpiando registros existentes...');
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    await prisma.detalleRepuesto.deleteMany({});
    await prisma.repuesto.deleteMany({});
    await prisma.cotizacion.deleteMany({});
    await prisma.mantenimiento.deleteMany({});
    await prisma.ordenTrabajo.deleteMany({});
    await prisma.equipo.deleteMany({});
    await prisma.tecnico.deleteMany({});
    await prisma.cliente.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✅ Base de datos vaciada.');

    // 2. Hash de contraseña ('password')
    const userHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

    // 3. Creación de Usuarios
    console.log('👤 Insertando usuarios...');
    const u1 = await prisma.usuario.create({ data: { nombre: 'Administrador SENA', email: 'admin@sena.com', password: userHash, rol: 'ADMIN' } });
    const u2 = await prisma.usuario.create({ data: { nombre: 'Juan García López', email: 'cliente@test.com', password: userHash, rol: 'CLIENTE' } });
    const u3 = await prisma.usuario.create({ data: { nombre: 'María López Rodríguez', email: 'maria@test.com', password: userHash, rol: 'CLIENTE' } });
    const u4 = await prisma.usuario.create({ data: { nombre: 'Carlos Rodríguez Martínez', email: 'tecnico@test.com', password: userHash, rol: 'TECNICO' } });
    const u5 = await prisma.usuario.create({ data: { nombre: 'Pedro Martínez García', email: 'pedro@test.com', password: userHash, rol: 'TECNICO' } });
    console.log('✅ Usuarios creados:', [u1.id, u2.id, u3.id, u4.id, u5.id]);

    // 4. Perfiles
    console.log('📋 Insertando perfiles...');
    const c1 = await prisma.cliente.create({ data: { usuarioId: u2.id, empresa: 'Distribuidora Nacional', nit: '890123456-1', telefono: '+57 300 1234567', direccion: 'Cra 5 # 22-80, Bogotá' } });
    const c2 = await prisma.cliente.create({ data: { usuarioId: u3.id, empresa: 'Hotel Boutique Miraflores', nit: '890654321-9', telefono: '+57 301 9876543', direccion: 'Calle 72 # 11-45, Medellín' } });
    
    const t1 = await prisma.tecnico.create({ data: { usuarioId: u4.id, especialidad: 'Mantenimiento Preventivo y Correctivo', telefono: '+57 310 5555555', certificado: 'ISO-9001-2023' } });
    const t2 = await prisma.tecnico.create({ data: { usuarioId: u5.id, especialidad: 'Reparación de Compresores y Refrigeración Avanzada', telefono: '+57 320 6666666', certificado: 'Refrigeración Avanzada 2024' } });
    console.log('✅ Perfiles creados.');

    // 5. Equipos
    console.log('🌡️ Insertando equipos...');
    await prisma.equipo.create({ data: { clienteId: c1.id, serial: 'AC-2023-001', modelo: 'LG DUALCOOL 24000 BTU', tipo: 'AIRE_ACONDICIONADO', ubicacion: 'Oficina Principal', fechaInstalacion: new Date('2023-01-15'), estado: 'OPERATIVO' } });
    await prisma.equipo.create({ data: { clienteId: c1.id, serial: 'AC-2023-002', modelo: 'Samsung WindFree 18000 BTU', tipo: 'AIRE_ACONDICIONADO', ubicacion: 'Sala de Juntas', fechaInstalacion: new Date('2023-02-20'), estado: 'EN_MANTENIMIENTO' } });
    await prisma.equipo.create({ data: { clienteId: c2.id, serial: 'CHIL-2023-001', modelo: 'Chiller Carrier 30 TR', tipo: 'CHILLER', ubicacion: 'Cuarto de Máquinas', fechaInstalacion: new Date('2022-06-10'), estado: 'OPERATIVO' } });
    
    const finalCount = await prisma.usuario.count();
    console.log(`🎉 PROCESO FINALIZADO. Usuarios finales en DB: ${finalCount}`);

  } catch (error) {
    console.error('❌ FATAL ERROR durante el seeding:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
