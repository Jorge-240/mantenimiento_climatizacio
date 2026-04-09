// Admin Controller - CRUD Clientes, Tecnicos, Equipos, Ordenes, Cotizaciones
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ============ CLIENTES ============
const getClientes = async (req, res) => {
  try {
    const { search, limit = 10, skip = 0 } = req.query;
    const where = search ? {
      usuario: {
        nombre: { contains: search }
      }
    } : {};

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        include: {
          usuario: true,
          _count: { select: { equipos: true, ordenes: true } }
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { id: 'desc' }
      }),
      prisma.cliente.count({ where })
    ]);

    res.json({ data: clientes, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCliente = async (req, res) => {
  try {
    const { nombre, email, password, empresa, nit, telefono, direccion } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: 'CLIENTE'
      }
    });

    const cliente = await prisma.cliente.create({
      data: {
        usuarioId: usuario.id,
        empresa,
        nit,
        telefono,
        direccion
      },
      include: { usuario: true }
    });

    res.status(201).json({ success: true, cliente });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email o NIT ya registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, empresa, nit, telefono, direccion } = req.body;

    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const updated = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        empresa,
        nit,
        telefono,
        direccion,
        usuario: {
          update: { nombre }
        }
      },
      include: { usuario: true }
    });

    res.json({ success: true, cliente: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cliente.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ TECNICOS ============
const getTecnicos = async (req, res) => {
  try {
    const { search, limit = 10, skip = 0 } = req.query;
    const where = search ? {
      usuario: {
        nombre: { contains: search }
      }
    } : {};

    const [tecnicos, total] = await Promise.all([
      prisma.tecnico.findMany({
        where,
        include: {
          usuario: true,
          _count: { select: { ordenes: true } }
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { id: 'desc' }
      }),
      prisma.tecnico.count({ where })
    ]);

    res.json({ data: tecnicos, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTecnico = async (req, res) => {
  try {
    const { nombre, email, password, especialidad, telefono, certificado } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y password requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: 'TECNICO'
      }
    });

    const tecnico = await prisma.tecnico.create({
      data: {
        usuarioId: usuario.id,
        especialidad,
        telefono,
        certificado
      },
      include: { usuario: true }
    });

    res.status(201).json({ success: true, tecnico });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email ya registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, especialidad, telefono, certificado } = req.body;

    const tecnico = await prisma.tecnico.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico no encontrado' });
    }

    const updated = await prisma.tecnico.update({
      where: { id: parseInt(id) },
      data: {
        especialidad,
        telefono,
        certificado,
        usuario: {
          update: { nombre }
        }
      },
      include: { usuario: true }
    });

    res.json({ success: true, tecnico: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTecnico = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.tecnico.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Técnico eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ EQUIPOS ============
const getEquipos = async (req, res) => {
  try {
    const { clienteId, search, limit = 10, skip = 0 } = req.query;
    const where = {
      ...(clienteId && { clienteId: parseInt(clienteId) }),
      ...(search && { modelo: { contains: search } })
    };

    const [equipos, total] = await Promise.all([
      prisma.equipo.findMany({
        where,
        include: { cliente: { include: { usuario: true } } },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.equipo.count({ where })
    ]);

    res.json({ data: equipos, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEquipo = async (req, res) => {
  try {
    const { clienteId, serial, modelo, tipo, ubicacion, fechaInstalacion } = req.body;
    
    if (!clienteId || !serial || !modelo || !tipo) {
      return res.status(400).json({ error: 'ClienteId, serial, modelo y tipo requeridos' });
    }

    const equipo = await prisma.equipo.create({
      data: {
        clienteId: parseInt(clienteId),
        serial,
        modelo,
        tipo,
        ubicacion,
        fechaInstalacion: fechaInstalacion ? new Date(fechaInstalacion) : null
      },
      include: { cliente: { include: { usuario: true } } }
    });

    res.status(201).json({ success: true, equipo });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Serial ya existe' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { serial, modelo, tipo, ubicacion, estado, fechaInstalacion } = req.body;

    const equipo = await prisma.equipo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }

    const updated = await prisma.equipo.update({
      where: { id: parseInt(id) },
      data: {
        serial,
        modelo,
        tipo,
        ubicacion,
        estado,
        fechaInstalacion: fechaInstalacion ? new Date(fechaInstalacion) : null
      },
      include: { cliente: { include: { usuario: true } } }
    });

    res.json({ success: true, equipo: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.equipo.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Equipo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ ORDENES ============
const getOrdenes = async (req, res) => {
  try {
    const { estado, tecnicoId, clienteId, limit = 10, skip = 0 } = req.query;
    const where = {
      ...(estado && { estado }),
      ...(tecnicoId && { tecnicoId: parseInt(tecnicoId) || null }),
      ...(clienteId && { clienteId: parseInt(clienteId) })
    };

    const [ordenes, total] = await Promise.all([
      prisma.ordenTrabajo.findMany({
        where,
        include: {
          cliente: { include: { usuario: true } },
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

const asignarTecnico = async (req, res) => {
  try {
    const { ordenId, tecnicoId } = req.body;
    
    if (!ordenId || !tecnicoId) {
      return res.status(400).json({ error: 'OrdenId y tecnicoId requeridos' });
    }

    const orden = await prisma.ordenTrabajo.update({
      where: { id: parseInt(ordenId) },
      data: {
        tecnicoId: parseInt(tecnicoId),
        estado: 'ASIGNADA',
        fechaAsignacion: new Date()
      },
      include: {
        cliente: { include: { usuario: true } },
        equipo: true,
        tecnico: { include: { usuario: true } }
      }
    });

    res.json({ success: true, orden });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEstadoOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado) {
      return res.status(400).json({ error: 'Estado requerido' });
    }

    const orden = await prisma.ordenTrabajo.update({
      where: { id: parseInt(id) },
      data: { estado },
      include: {
        cliente: { include: { usuario: true } },
        equipo: true,
        tecnico: { include: { usuario: true } }
      }
    });

    res.json({ success: true, orden });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ COTIZACIONES ============
const getCotizaciones = async (req, res) => {
  try {
    const { estado, limit = 10, skip = 0 } = req.query;
    const where = estado ? { estado } : {};

    const [cotizaciones, total] = await Promise.all([
      prisma.cotizacion.findMany({
        where,
        include: {
          orden: {
            include: {
              cliente: { include: { usuario: true } },
              equipo: true,
              tecnico: { include: { usuario: true } }
            }
          }
        },
        take: parseInt(limit),
        skip: parseInt(skip),
        orderBy: { fechaGeneracion: 'desc' }
      }),
      prisma.cotizacion.count({ where })
    ]);

    res.json({ data: cotizaciones, total, limit: parseInt(limit), skip: parseInt(skip) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCotizacion = async (req, res) => {
  try {
    const { ordenId, total, descripcion } = req.body;
    
    if (!ordenId || total === undefined) {
      return res.status(400).json({ error: 'OrdenId y total requeridos' });
    }

    const cotizacion = await prisma.cotizacion.create({
      data: {
        ordenId: parseInt(ordenId),
        total: parseFloat(total),
        descripcion
      },
      include: { orden: { include: { cliente: true, equipo: true } } }
    });

    res.status(201).json({ success: true, cotizacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cotizacion = await prisma.cotizacion.update({
      where: { id: parseInt(id) },
      data: { estado },
      include: { orden: true }
    });

    res.json({ success: true, cotizacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============ DASHBOARD ============
const getDashboardMetrics = async (req, res) => {
  try {
    const [
      totalClientes,
      totalTecnicos,
      totalEquipos,
      totalOrdenes,
      ordenesPendientes,
      ordenesEnProgreso,
      ordenesCompletadas,
      cotizacionesPendientes
    ] = await Promise.all([
      prisma.cliente.count(),
      prisma.tecnico.count(),
      prisma.equipo.count(),
      prisma.ordenTrabajo.count(),
      prisma.ordenTrabajo.count({ where: { estado: 'PENDIENTE' } }),
      prisma.ordenTrabajo.count({ where: { estado: 'EN_PROGRESO' } }),
      prisma.ordenTrabajo.count({ where: { estado: 'COMPLETADA' } }),
      prisma.cotizacion.count({ where: { estado: 'PENDIENTE' } })
    ]);

    res.json({
      totalClientes,
      totalTecnicos,
      totalEquipos,
      totalOrdenes,
      ordenesPendientes,
      ordenesEnProgreso,
      ordenesCompletadas,
      cotizacionesPendientes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  // Clientes
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  // Técnicos
  getTecnicos,
  createTecnico,
  updateTecnico,
  deleteTecnico,
  // Equipos
  getEquipos,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  // Órdenes
  getOrdenes,
  asignarTecnico,
  updateEstadoOrden,
  // Cotizaciones
  getCotizaciones,
  createCotizacion,
  updateCotizacion,
  // Dashboard
  getDashboardMetrics
};

