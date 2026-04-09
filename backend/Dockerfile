FROM node:20-slim

# Instalar OpenSSL necesario para Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev && npm cache clean --force

# Copiar Prisma schema y generar client
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar código fuente
COPY src ./src

EXPOSE 3001

CMD ["npm", "start"]

