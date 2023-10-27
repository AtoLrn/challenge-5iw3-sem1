FROM --platform=amd64 node:20.8-alpine AS remix-builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM remix-builder AS remix-dev

ENV APP_ENV=dev

COPY --from=remix-builder /app ./

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM remix-builder AS remix-prod

ENV APP_ENV=prod

COPY --from=remix-builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
