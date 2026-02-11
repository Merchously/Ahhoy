#!/bin/bash
set -e

# SSL Certificate Setup with Let's Encrypt
# Usage: ./scripts/ssl-init.sh your-domain.com [email]

DOMAIN=${1:?"Usage: $0 <domain> [email]"}
EMAIL=${2:-"admin@${DOMAIN}"}

echo "=== SSL Setup for ${DOMAIN} ==="

# Step 1: Get initial certificate
echo "[1/3] Requesting SSL certificate..."
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.${DOMAIN}"

# Step 2: Update nginx config for SSL
echo "[2/3] Updating nginx configuration for HTTPS..."
cat > nginx/conf.d/default.conf <<NGINX
upstream nextjs_app {
    server app:3000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    client_max_body_size 20M;

    location / {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads/ {
        alias /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /_next/static/ {
        proxy_pass http://nextjs_app;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# Step 3: Reload nginx
echo "[3/3] Reloading nginx..."
docker compose restart nginx

echo ""
echo "=== SSL Setup Complete ==="
echo "Site available at: https://${DOMAIN}"
