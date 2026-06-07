FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.5.0 --activate

COPY package.json pnpm-workspace.yaml turbo.json ./

COPY apps/api/package.json ./apps/api/
COPY packages ./packages

RUN pnpm install

COPY . .

WORKDIR /app/apps/api

RUN pnpm prisma:generate
RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/server.js"]