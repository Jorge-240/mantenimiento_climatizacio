const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { verifyToken } = require('../utils/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, rol: true, activo: true }
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Usuario no autorizado' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error auth' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Convertir todo a mayúsculas para evitar problemas de case-sensitivity
    const userRole = req.user?.rol?.toUpperCase();
    const allowedRoles = roles.map(r => r.toUpperCase());

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Rol no autorizado' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};

