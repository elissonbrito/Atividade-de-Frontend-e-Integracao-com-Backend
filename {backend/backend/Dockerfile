FROM node:20-alpine

WORKDIR /app

# Dependências de sistema
RUN apk add --no-cache dumb-init

# Copiar e instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar código-fonte
COPY src/ ./src/
COPY .env.example .env.example

# Usuário não-root (boas práticas de segurança)
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
