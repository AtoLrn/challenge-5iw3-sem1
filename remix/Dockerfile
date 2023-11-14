FROM node:20.8-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:20.8 AS dev

WORKDIR /app

ENV NODE_ENV=development

EXPOSE 3000

CMD ["sh", "-c", "npm install; npm run dev"]

FROM builder AS prod

ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
