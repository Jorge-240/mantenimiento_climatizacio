const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const {
  getOrdenesAsignadas,
  crearMantenimiento,
  getMantenimientos,
  updateMantenimiento,
  agregarRepuesto,
  eliminarRepuesto,
  completarOrden
} = require('../controllers/tecnicoController');

router.use(authMiddleware);
router.use(roleMiddleware(['tecnico']));

// Órdenes
router.get('/ordenes', getOrdenesAsignadas);
router.put('/ordenes/:id/completar', completarOrden);

// Mantenimientos
router.post('/mantenimientos', crearMantenimiento);
router.get('/mantenimientos', getMantenimientos);
router.put('/mantenimientos/:id', updateMantenimiento);

// Repuestos
router.post('/repuestos', agregarRepuesto);
router.delete('/repuestos/:id', eliminarRepuesto);

module.exports = router;

