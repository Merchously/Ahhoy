#!/bin/bash
set -e

# Ahhoy VPS Deployment Script
# Usage: ./scripts/deploy.sh [domain]

DOMAIN=${1:-"your-domain.com"}
APP_DIR="/opt/ahhoy"
REPO_URL="https://github.com/Merchously/Ahhoy.git"

echo "=== Ahhoy Deployment ==="
echo "Domain: $DOMAIN"
echo "App directory: $APP_DIR"
echo ""

# ---- Step 1: System setup ----
echo "[1/8] Installing system dependencies..."
apt-get update -qq
apt-get install -y -qq docker.io docker-compose-plugin git curl

systemctl enable docker
systemctl start docker

# ---- Step 2: Clone/pull repository ----
echo "[2/8] Setting up repository..."
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
  git pull origin main
else
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# ---- Step 3: Create .env if not exists ----
echo "[3/8] Checking environment file..."
if [ ! -f ".env" ]; then
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=' | head -c 32)

  cat > .env <<EOF
# Database
DATABASE_URL=postgresql://ahhoy_user:${DB_PASSWORD}@postgres:5432/ahhoy
POSTGRES_USER=ahhoy_user
POSTGRES_PASSWORD=${DB_PASSWORD}

# NextAuth
NEXTAUTH_URL=https://${DOMAIN}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Google OAuth (fill in manually)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe (fill in manually)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Mapbox (fill in manually)
NEXT_PUBLIC_MAPBOX_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://${DOMAIN}
PLATFORM_FEE_PERCENT=15
EOF

  echo "  -> .env created with generated secrets."
  echo "  -> IMPORTANT: Fill in Stripe, Google OAuth, and Mapbox tokens manually!"
else
  echo "  -> .env already exists, skipping."
fi

# ---- Step 4: Update nginx config with domain ----
echo "[4/8] Configuring nginx for domain..."
sed -i "s/server_name _;/server_name ${DOMAIN} www.${DOMAIN};/" nginx/conf.d/default.conf

# ---- Step 5: Create required directories ----
echo "[5/8] Creating directories..."
mkdir -p certbot/conf certbot/www public/uploads

# ---- Step 6: Build and start containers ----
echo "[6/8] Building and starting Docker containers..."
docker compose down --remove-orphans 2>/dev/null || true
docker compose build --no-cache app
docker compose up -d postgres
echo "  -> Waiting for PostgreSQL to be healthy..."
sleep 10

# ---- Step 7: Run database migrations and seed ----
echo "[7/8] Running database migrations..."
docker compose run --rm app npx prisma migrate deploy
echo "  -> Seeding activity types..."
docker compose run --rm app npx prisma db seed

# ---- Step 8: Start all services ----
echo "[8/8] Starting all services..."
docker compose up -d

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Services running:"
docker compose ps
echo ""
echo "Next steps:"
echo "  1. Point DNS A record for ${DOMAIN} to this server's IP"
echo "  2. Run SSL setup: ./scripts/ssl-init.sh ${DOMAIN}"
echo "  3. Fill in API keys in ${APP_DIR}/.env"
echo "  4. Restart app: docker compose restart app"
echo ""
echo "App available at: http://${DOMAIN}"
