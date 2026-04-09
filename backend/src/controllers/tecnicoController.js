// Técnico Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============ ÓRDENES ASIGNADAS ============
const getOrdenesAsignadas = async (req, res) => {
  try {
    const tecnico = await prisma.tecnico.findUnique({
      where: { usuarioId: req.user.id }
    });

    if (!tecnico) {
      return res.status(404).json({ error: 'Perfil de técnico no encontrado' });
    }

    const { estado, limit = 10, skip = 0 } = req.query;
    const where = {
      tecnicoId: tecnico.id,
      ...(estado && { estado })
    };

    const [ordenes, total] = await Promise.all([
      prisma.ordenTrabajo.findMany({
        where,
        include: {
          cliente: { include: { usuario: true } },
          equipo: true,
          mantenimientos: { include: { repuestos: true } }
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { fechaAsignacion: 'desc' }
      }),
      prisma.ordenTrabajo.count({ where })
    ]);

    res.json({ data: ordenes, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ MANTENIMIENTOS ============
const crearMantenimiento = async (req, res) => {
  try {
    const { ordenId, tipo, descripcion, evidenciaUrl, horasTrabajadas } = req.body;

    if (!ordenId || !tipo || !descripcion) {
      return res.status(400).json({ error: 'OrdenId, tipo y descripción requeridos' });
    }

    const mantenimiento = await prisma.mantenimiento.create({
      data: {
        ordenId: parseInt(ordenId),
        tipo,
        descripcion,
        evidenciaUrl,
        horasTrabajadas: horasTrabajadas ? parseFloat(horasTrabajadas) : null,
        fechaEjecucion: new Date()
      },
      include: { repuestos: true }
    });

    // Actualizar estado de la orden
    await prisma.ordenTrabajo.update({
      where: { id: parseInt(ordenId) },
      data: { estado: 'EN_PROGRESO' }
    });

    res.status(201).json({ success: true, mantenimiento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMantenimientos = async (req, res) => {
  try {
    const tecnico = await prisma.tecnico.findUnique({
      where: { usuarioId: req.user.id }
    });

    if (!tecnico) {
      return res.status(404).json({ error: 'Perfil de técnico no encontrado' });
    }

    const { limit = 10, skip = 0 } = req.query;

    const [mantenimientos, total] = await Promise.all([
      prisma.mantenimiento.findMany({
        where: {
          orden: { tecnicoId: tecnico.id }
        },
        include: {
          orden: { include: { cliente: true, equipo: true } },
          repuestos: true
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { fechaEjecucion: 'desc' }
      }),
      prisma.mantenimiento.count({
        where: { orden: { tecnicoId: tecnico.id } }
      })
    ]);

    res.json({ data: mantenimientos, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, descripcion, evidenciaUrl, horasTrabajadas } = req.body;

    const mantenimiento = await prisma.mantenimiento.update({
      where: { id: parseInt(id) },
      data: {
        tipo,
        descripcion,
        evidenciaUrl,
        horasTrabajadas: horasTrabajadas ? parseFloat(horasTrabajadas) : null
      },
      include: { repuestos: true }
    });

    res.json({ success: true, mantenimiento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ REPUESTOS ============
const agregarRepuesto = async (req, res) => {
  try {
    const { mantenimientoId, repuestoId, cantidad } = req.body;

    if (!mantenimientoId || !repuestoId || !cantidad) {
      return res.status(400).json({ error: 'MantenimientoId, repuestoId y cantidad requeridos' });
    }

    const repuesto = await prisma.repuesto.findUnique({
      where: { id: parseInt(repuestoId) }
    });

    if (!repuesto) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }

    const costoTotal = repuesto.precioUnitario * cantidad;

    const detalleRepuesto = await prisma.detalleRepuesto.create({
      data: {
        mantenimientoId: parseInt(mantenimientoId),
        repuestoId: parseInt(repuestoId),
        cantidad: parseInt(cantidad),
        costoTotal
      },
      include: { repuesto: true }
    });

    res.status(201).json({ success: true, detalleRepuesto });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Repuesto ya agregado a este mantenimiento' });
    }
    res.status(500).json({ error: error.message });
  }
};

const eliminarRepuesto = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.detalleRepuesto.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Repuesto removido' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ COMPLETAR ORDEN ============
const completarOrden = async (req, res) => {
  try {
    const { ordenId, observacionesFinal } = req.body;

    if (!ordenId) {
      return res.status(400).json({ error: 'OrdenId requerido' });
    }

    const orden = await prisma.ordenTrabajo.update({
      where: { id: parseInt(ordenId) },
      data: { estado: 'COMPLETADA' },
      include: {
        cliente: { include: { usuario: true } },
        equipo: true,
        tecnico: { include: { usuario: true } },
        mantenimientos: { include: { repuestos: true } }
      }
    });

    res.json({ success: true, orden });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrdenesAsignadas,
  crearMantenimiento,
  getMantenimientos,
  updateMantenimiento,
  agregarRepuesto,
  eliminarRepuesto,
  completarOrden
};

