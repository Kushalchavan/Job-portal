FROM node:22-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@11.5.0 --activate

COPY . .

# Disable pnpm strict build checks
ENV PNPM_CONFIG_STRICT_DEP_BUILDS=false

RUN pnpm install

WORKDIR /app/apps/api

# Generate Prisma Client directly
RUN npx prisma generate

# Build API
RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/server.js"]