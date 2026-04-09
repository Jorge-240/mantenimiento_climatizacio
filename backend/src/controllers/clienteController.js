// Cliente Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============ PERFIL ============
const getPerfilCliente = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findFirst({
      where: {
        usuario: { id: req.user.id }
      },
      include: { usuario: true }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePerfilCliente = async (req, res) => {
  try {
    const { empresa, nit, telefono, direccion } = req.body;

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const updated = await prisma.cliente.update({
      where: { id: cliente.id },
      data: { empresa, nit, telefono, direccion },
      include: { usuario: true }
    });

    res.json({ success: true, cliente: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ EQUIPOS ============
const getMisEquipos = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const { limit = 10, skip = 0 } = req.query;

    const [equipos, total] = await Promise.all([
      prisma.equipo.findMany({
        where: { clienteId: cliente.id },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.equipo.count({ where: { clienteId: cliente.id } })
    ]);

    res.json({ data: equipos, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ ÓRDENES ============
const solicitarServicio = async (req, res) => {
  try {
    const { equipoId, descripcion, prioridad = 'MEDIA' } = req.body;

    if (!equipoId || !descripcion) {
      return res.status(400).json({ error: 'EquipoId y descripción requeridos' });
    }

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const orden = await prisma.ordenTrabajo.create({
      data: {
        clienteId: cliente.id,
        equipoId: parseInt(equipoId),
        descripcion,
        prioridad,
        estado: 'PENDIENTE'
      },
      include: {
        equipo: true,
        cliente: { include: { usuario: true } }
      }
    });

    res.status(201).json({ success: true, orden });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMisOrdenes = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const { estado, limit = 10, skip = 0 } = req.query;
    const where = {
      clienteId: cliente.id,
      ...(estado && { estado })
    };

    const [ordenes, total] = await Promise.all([
      prisma.ordenTrabajo.findMany({
        where,
        include: {
          equipo: true,
          tecnico: { include: { usuario: true } },
          mantenimientos: true,
          cotizaciones: true
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { fechaSolicitud: 'desc' }
      }),
      prisma.ordenTrabajo.count({ where })
    ]);

    res.json({ data: ordenes, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDetalleOrden = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!orden || orden.clienteId !== cliente.id) {
      return res.status(403).json({ error: 'No tienes acceso a esta orden' });
    }

    const detail = await prisma.ordenTrabajo.findUnique({
      where: { id: parseInt(id) },
      include: {
        equipo: true,
        tecnico: { include: { usuario: true } },
        mantenimientos: { include: { repuestos: true } },
        cotizaciones: true
      }
    });

    res.json(detail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelarOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const orden = await prisma.ordenTrabajo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!orden || orden.clienteId !== cliente.id) {
      return res.status(403).json({ error: 'No tienes acceso a esta orden' });
    }

    if (orden.estado === 'COMPLETADA' || orden.estado === 'CANCELADA') {
      return res.status(400).json({ error: 'No puedes cancelar una orden completada o ya cancelada' });
    }

    const updated = await prisma.ordenTrabajo.update({
      where: { id: parseInt(id) },
      data: { estado: 'CANCELADA' },
      include: {
        equipo: true,
        tecnico: { include: { usuario: true } },
        mantenimientos: true
      }
    });

    res.json({ success: true, orden: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ COTIZACIONES ============
const getCotizacionesCliente = async (req, res) => {
  try {
    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const { limit = 10, skip = 0 } = req.query;

    const [cotizaciones, total] = await Promise.all([
      prisma.cotizacion.findMany({
        where: {
          orden: { clienteId: cliente.id }
        },
        include: {
          orden: {
            include: {
              equipo: true,
              tecnico: { include: { usuario: true } }
            }
          }
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { fechaGeneracion: 'desc' }
      }),
      prisma.cotizacion.count({
        where: { orden: { clienteId: cliente.id } }
      })
    ]);

    res.json({ data: cotizaciones, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const aprobarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id: parseInt(id) },
      include: { orden: true }
    });

    if (!cotizacion || cotizacion.orden.clienteId !== cliente.id) {
      return res.status(403).json({ error: 'No tienes acceso a esta cotización' });
    }

    const updated = await prisma.cotizacion.update({
      where: { id: parseInt(id) },
      data: { estado: 'APROBADA' },
      include: { orden: true }
    });

    res.json({ success: true, cotizacion: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rechazarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findFirst({
      where: { usuario: { id: req.user.id } }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
    }

    const cotizacion = await prisma.cotizacion.findUnique({
      where: { id: parseInt(id) },
      include: { orden: true }
    });

    if (!cotizacion || cotizacion.orden.clienteId !== cliente.id) {
      return res.status(403).json({ error: 'No tienes acceso a esta cotización' });
    }

    const updated = await prisma.cotizacion.update({
      where: { id: parseInt(id) },
      data: { estado: 'RECHAZADA' },
      include: { orden: true }
    });

    res.json({ success: true, cotizacion: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPerfilCliente,
  updatePerfilCliente,
  getMisEquipos,
  solicitarServicio,
  getMisOrdenes,
  getDetalleOrden,
  cancelarOrden,
  getCotizacionesCliente,
  aprobarCotizacion,
  rechazarCotizacion
};

