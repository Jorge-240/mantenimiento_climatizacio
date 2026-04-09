const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware seguridad
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:19006', 'exp://192.168.1.*:19000'], // web + expo dev
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'OK', message: 'Backend conectado a MySQL via Prisma' });
  } catch (error) {
    res.status(500).json({ error: 'DB conexión fallida', details: error.message });
  }
});

// Test Prisma
app.get('/api/test-db', async (req, res) => {
  try {
    const users = await prisma.usuario.findMany({
      take: 3,
      select: { id: true, nombre: true, rol: true }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/tecnico', require('./routes/tecnico'));
app.use('/api/cliente', require('./routes/cliente'));

// API root
app.get('/api', (req, res) => {
  res.json({
    message: 'Sistema Gestión Mantenimiento Climatización API v1.0 ✅',
    endpoints: [
      'POST /api/auth/register {rol:cliente|tecnico}',
      'POST /api/auth/login',
      'GET /api/admin/clientes, /admin/dashboard (JWT admin)',
      'GET /api/tecnico/ordenes (JWT tecnico)',
      'POST /api/cliente/ordenes (JWT cliente)',
      'GET /health',
      'GET /api/test-db'
    ],
    status: 'Backend COMPLETO - Fase 2 ✅ (CRUD básico por rol)'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Backend API completa en http://localhost:${PORT}`);
  console.log(`🔬 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login {email:'admin@sena.com', password:'password'}`);
});

process.on('SIGTERM', async () => {
  console.log('🔴 Cerrando...');
  await prisma.$disconnect();
  server.close();
});

module.exports = app;

