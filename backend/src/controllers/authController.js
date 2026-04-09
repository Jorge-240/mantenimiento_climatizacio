const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const normalizedRol = rol?.toUpperCase();

    // Validación básica
    if (!nombre || !email || !password || !normalizedRol) {
      return res.status(400).json({ error: 'Todos los campos requeridos' });
    }

    if (!['ADMIN', 'TECNICO', 'CLIENTE'].includes(normalizedRol)) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: normalizedRol
      }
    });

    // Auto-crear perfil según rol
    if (normalizedRol === 'CLIENTE') {
      await prisma.cliente.create({
        data: { usuarioId: usuario.id }
      });
    } else if (normalizedRol === 'TECNICO') {
      await prisma.tecnico.create({
        data: { usuarioId: usuario.id }
      });
    }

    const token = generateToken({ id: usuario.id, rol: usuario.rol });

    res.status(201).json({
      success: true,
      message: 'Usuario creado',
      token,
      user: { id: usuario.id, nombre, email, rol }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email ya registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password requeridos' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        cliente: true,
        tecnico: true
      }
    });

    if (!usuario || !await bcrypt.compare(password, usuario.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    const token = generateToken({ id: usuario.id, rol: usuario.rol });

    res.json({
      success: true,
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login
};

