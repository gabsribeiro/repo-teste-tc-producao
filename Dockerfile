# Estágio 1: Construir a aplicação
FROM node:20.11.0 AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

# Estágio 2: Configurar a imagem de produção
FROM node:20.11.0

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./

RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/main"]
