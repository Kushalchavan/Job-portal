FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

COPY . .

RUN pnpm install --config.strict-dep-builds=false

WORKDIR /app/apps/api

RUN pnpm prisma:generate
RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/server.js"]