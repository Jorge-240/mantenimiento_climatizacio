# Dockerfile para Backend en Railway
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias desde backend
COPY backend/package*.json ./

# Instalar dependencias (solo producción)
RUN npm install --omit=dev && npm cache clean --force

# Copiar Prisma schema generador
COPY backend/prisma ./prisma/

# Generar Prisma client
RUN npx prisma generate

# Copiar código fuente del backend
COPY backend/src ./src

# Puerto donde corre la aplicación
EXPOSE ${PORT:-3001}

# Comando para iniciar
CMD ["npm", "start"]
