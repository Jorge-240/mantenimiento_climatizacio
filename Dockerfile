FROM node:20-slim

# Instalar OpenSSL necesario para Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

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
CMD ["sh", "-c", "npm start & sleep 5 ; npx prisma db push --accept-data-loss ; npm run seed"]
