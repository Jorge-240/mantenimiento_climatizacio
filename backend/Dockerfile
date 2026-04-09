FROM node:20-alpine

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

