# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm ci

# ---- Stage 2: Build ----
FROM node:20-alpine AS builder
WORKDIR /app

# Next.js needs NEXT_PUBLIC_ vars at build time
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=placeholder
ARG NEXT_PUBLIC_MAPBOX_TOKEN=placeholder
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Stage 3: Production Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install prisma CLI (matching project version) + seed dependencies
RUN npm install -g prisma@7 dotenv bcryptjs pg

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/scripts/seed-admin.mjs ./scripts/seed-admin.mjs
COPY --from=builder /app/scripts/seed-listings.mjs ./scripts/seed-listings.mjs

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Push schema + seed admin user on startup, then start the server
# NODE_PATH includes global modules so scripts can find prisma/dotenv/bcryptjs/pg
CMD ["sh", "-c", "export NODE_PATH=$(npm root -g); prisma db push 2>&1; node scripts/seed-admin.mjs 2>&1; node scripts/seed-listings.mjs 2>&1; node server.js"]
