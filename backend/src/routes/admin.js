const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const {
  // Clientes
  getClientes, createCliente, updateCliente, deleteCliente,
  // Técnicos
  getTecnicos, createTecnico, updateTecnico, deleteTecnico,
  // Equipos
  getEquipos, createEquipo, updateEquipo, deleteEquipo,
  // Órdenes
  getOrdenes, asignarTecnico, updateEstadoOrden,
  // Cotizaciones
  getCotizaciones, createCotizacion, updateCotizacion,
  // Dashboard
  getDashboardMetrics
} = require('../controllers/adminController');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// ============ CLIENTES ============
router.get('/clientes', getClientes);
router.post('/clientes', createCliente);
router.put('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

// ============ TÉCNICOS ============
router.get('/tecnicos', getTecnicos);
router.post('/tecnicos', createTecnico);
router.put('/tecnicos/:id', updateTecnico);
router.delete('/tecnicos/:id', deleteTecnico);

// ============ EQUIPOS ============
router.get('/equipos', getEquipos);
router.post('/equipos', createEquipo);
router.put('/equipos/:id', updateEquipo);
router.delete('/equipos/:id', deleteEquipo);

// ============ ÓRDENES ============
router.get('/ordenes', getOrdenes);
router.post('/ordenes/asignar', asignarTecnico);
router.put('/ordenes/:id/estado', updateEstadoOrden);

// ============ COTIZACIONES ============
router.get('/cotizaciones', getCotizaciones);
router.post('/cotizaciones', createCotizacion);
router.put('/cotizaciones/:id', updateCotizacion);

// ============ DASHBOARD ============
router.get('/dashboard', getDashboardMetrics);
router.post('/reseed', (req, res, next) => {
  // Solo permitir reseed si se envía un secreto o si estamos en desarrollo
  // Para simplicidad en este debug, lo dejaremos pasar con auth
  next();
}, require('../controllers/adminController').forceReseed);

module.exports = router;

