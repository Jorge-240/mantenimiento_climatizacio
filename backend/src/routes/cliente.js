const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const {
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
} = require('../controllers/clienteController');

router.use(authMiddleware);
router.use(roleMiddleware(['cliente']));

// Perfil
router.get('/perfil', getPerfilCliente);
router.put('/perfil', updatePerfilCliente);

// Equipos
router.get('/equipos', getMisEquipos);

// Órdenes
router.post('/ordenes', solicitarServicio);
router.get('/ordenes', getMisOrdenes);
router.get('/ordenes/:id', getDetalleOrden);
router.put('/ordenes/:id/cancelar', cancelarOrden);

// Cotizaciones
router.get('/cotizaciones', getCotizacionesCliente);
router.put('/cotizaciones/:id/aprobar', aprobarCotizacion);
router.put('/cotizaciones/:id/rechazar', rechazarCotizacion);

module.exports = router;

