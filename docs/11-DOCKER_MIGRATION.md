# 11 — Docker & VPS Migration Strategy

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Tujuan**: Dockerize stack untuk mudah migrasi antar VPS (Hetzner ↔ DigitalOcean ↔ lainnya).

## 1. Decision: Dockerize atau Bare Metal?

### 1.1 Trade-off

| Aspek | Bare Metal | Docker |
|-------|-----------|--------|
| **Setup cepat** | ❌ Manual install semua | ✅ `docker compose up -d` |
| **Migrasi VPS** | ❌ Ulang setup | ✅ Copy compose + volumes |
| **Isolasi** | ❌ Shared system | ✅ Container isolated |
| **Resource overhead** | ✅ Minimal | ❌ +50-100MB RAM |
| **Puppeteer di Docker** | ✅ Native Chromium | ⚠️ Butuh config khusus |
| **Caddy auto-HTTPS** | ✅ Native | ⚠️ Butuh config Docker |
| **Debug** | ✅ Langsung | ⚠️ `docker exec` |
| **Backup** | Manual | Volume backup |
| **Learning curve** | Rendah | Sedang |

### 1.2 Rekomendasi untuk KP
**Dockerize** — karena:
1. Migrasi VPS mudah (DO ↔ Hetzner ↔ lainnya)
2. Reproducible environment (tidak "works on my machine")
3. Portfolio value (Docker skill di CV)
4. Backup/restore sederhana (volume snapshot)

**Risiko**: Puppeteer di Docker butuh config khusus (Chromium dependencies). Solusi sudah ada (section 4).

## 2. Docker Compose Stack

### 2.1 Architecture
```
┌─────────────────────────────────────────────────────┐
│  VPS (Docker Engine)                                │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ caddy (reverse proxy + auto HTTPS)            │  │
│  │ :80, :443                                     │  │
│  └───────┬───────────────┬───────────────┬───────┘  │
│          │               │               │          │
│  ┌───────▼───────┐ ┌────▼─────┐ ┌───────▼───────┐  │
│  │ teknomed-web  │ │ 3d-viewer│ │ pdf-service   │  │
│  │ (nginx)       │ │ (nginx)  │ │ (node)        │  │
│  │ :80           │ │ :80      │ │ :3001         │  │
│  └───────┬───────┘ └──────────┘ └───────┬───────┘  │
│          │                               │          │
│  ┌───────▼───────────────────────────────▼───────┐  │
│  │ Volumes (persistent)                          │  │
│  │ - caddy_data (SSL certs)                      │  │
│  │ - caddy_config                                │  │
│  │ - pdf_logs                                    │  │
│  │ - pdf_cache                                   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
          │
          ▼
   Supabase Cloud (external, tidak di-Docker)
```

### 2.2 docker-compose.yml

```yaml
# docker-compose.yml
version: '3.9'

services:
  # ─────────────────────────────────────────────────────────
  # Caddy — Reverse Proxy + Auto HTTPS
  # ─────────────────────────────────────────────────────────
  caddy:
    image: caddy:2-alpine
    container_name: teknomed_caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - teknomed_net
    depends_on:
      - teknomed-web
      - 3d-viewer
      - pdf-service

  # ─────────────────────────────────────────────────────────
  # teknomed-web — Public SPA + Admin (static, served by nginx)
  # ─────────────────────────────────────────────────────────
  teknomed-web:
    build:
      context: ./teknomed-web
      dockerfile: Dockerfile
    container_name: teknomed_web
    restart: unless-stopped
    volumes:
      - ./teknomed-web/dist:/usr/share/nginx/html:ro
    networks:
      - teknomed_net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost/"]
      interval: 30s
      timeout: 5s
      retries: 3

  # ─────────────────────────────────────────────────────────
  # 3d-viewer — 3D Viewer SPA (static, served by nginx)
  # ─────────────────────────────────────────────────────────
  3d-viewer:
    build:
      context: ./3d-viewer
      dockerfile: Dockerfile
    container_name: teknomed_3d_viewer
    restart: unless-stopped
    volumes:
      - ./3d-viewer/dist:/usr/share/nginx/html:ro
    networks:
      - teknomed_net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost/"]
      interval: 30s
      timeout: 5s
      retries: 3

  # ─────────────────────────────────────────────────────────
  # pdf-service — Node + Puppeteer (PDF generator)
  # ─────────────────────────────────────────────────────────
  pdf-service:
    build:
      context: ./pdf-service
      dockerfile: Dockerfile
    container_name: teknomed_pdf
    restart: unless-stopped
    env_file:
      - ./pdf-service/.env
    volumes:
      - pdf_logs:/var/log/teknomed
      - pdf_cache:/tmp/pdf-cache
    networks:
      - teknomed_net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3001/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    # Puppeteer butuh extra shared memory
    shm_size: '1gb'

volumes:
  caddy_data:
  caddy_config:
  pdf_logs:
  pdf_cache:

networks:
  teknomed_net:
    driver: bridge
```

### 2.3 Caddyfile (Docker version)

```caddy
# Caddyfile — Docker version
# Domain routing via container name

teknomedindotimurpt.co.id {
    reverse_proxy teknomed-web:80

    encode gzip zstd

    @static path /assets/* /favicon.svg /logo_pt.png
    header @static Cache-Control "public, max-age=31536000, immutable"

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}

3d.teknomedindotimurpt.co.id {
    reverse_proxy 3d-viewer:80

    encode gzip zstd

    @static path /assets/*
    header @static Cache-Control "public, max-age=31536000, immutable"

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
    }
}

api.teknomedindotimurpt.co.id {
    reverse_proxy pdf-service:3001

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
    }
}
```

## 3. Dockerfiles

### 3.1 teknomed-web/Dockerfile

```dockerfile
# teknomed-web/Dockerfile
# Multi-stage: build di Docker, serve dengan nginx

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_3D_VIEWER_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_3D_VIEWER_URL=$VITE_3D_VIEWER_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** (SPA fallback):
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3.2 3d-viewer/Dockerfile

```dockerfile
# 3d-viewer/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 pdf-service/Dockerfile (Puppeteer)

```dockerfile
# pdf-service/Dockerfile
# Puppeteer butuh Chromium + dependencies

FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    libxcomposite1 \
    libxrandr2 \
    libxdamage1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libnspr4 \
    libnss3 \
    libxkbcommon0 \
    libxshmfence1 \
    fonts-liberation \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

EXPOSE 3001
CMD ["node", "index.js"]
```

## 4. Puppeteer di Docker — Known Issues & Solutions

### 4.1 Issue: Chromium crash di container
**Solusi**: 
- `shm_size: '1gb'` di docker-compose (sudah ada)
- Atau `--disable-dev-shm-usage` flag di Puppeteer launch

```javascript
// pdf-service/index.js
const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',  // Penting untuk Docker
    '--disable-gpu',
  ],
});
```

### 4.2 Issue: Font missing di PDF
**Solusi**: Install fonts di Dockerfile (sudah ada `fonts-liberation`, `fonts-noto-color-emoji`). Tambahkan font Indonesia kalau perlu:
```dockerfile
RUN apt-get install -y fonts-noto
```

### 4.3 Issue: Memory leak Puppeteer
**Solusi**: 
- Close browser setiap generate (jangan reuse)
- Set timeout 120s
- Restart container kalau OOM (`restart: unless-stopped` sudah ada)

## 5. Environment Management

### 5.1 .env structure

**Root `.env`** (untuk docker-compose):
```env
# Supabase
VITE_SUPABASE_URL=https://jssqoalxnmkpmogouypy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODgwMDcsImV4cCI6MjA5NjY2NDAwN30.NCtOrsbefv4c3wN5DGwe10r8eXoF-uGEI3zpEvZfg_I

# 3D Viewer URL
VITE_3D_VIEWER_URL=https://3d.teknomedindotimurpt.co.id
```

**pdf-service/.env**:
```env
SUPABASE_URL=https://jssqoalxnmkpmogouypy.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4ODAwNywiZXhwIjoyMDk2NjY0MDA3fQ.e1jKs3C-DigkwMqkk0-8gaQwBs_MEAOasHVOU9lJ7ek
SUPABASE_JWT_SECRET=... (dari Supabase Dashboard → Settings → API → JWT Secret)
RESEND_API_KEY=re_xxx
PORT=3001
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### 5.2 Docker Secrets (production-grade, optional)
```bash
# Create secret
echo "eyJ...service_role..." | docker secret create supabase_service_key -

# Use in compose
# pdf-service:
#   secrets:
#     - supabase_service_key
#   environment:
#     SUPABASE_SERVICE_KEY_FILE=/run/secrets/supabase_service_key
```

## 6. VPS Migration Procedure

### 6.1 Setup VPS Baru (dari nol)

```bash
# 1. SSH ke VPS baru
ssh root@[NEW_VPS_IP]

# 2. Install Docker + Docker Compose
apt update
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose-plugin git

# 3. Clone project
git clone https://github.com/[USER]/teknomed-deploy.git /opt/teknomed
cd /opt/teknomed

# 4. Setup .env
cp .env.example .env
nano .env  # isi credentials

# 5. Build + start
docker compose up -d --build

# 6. Cek status
docker compose ps
docker compose logs -f

# 7. Setup DNS (A record ke NEW_VPS_IP)
# Tunggu propagate, Caddy auto-obtain SSL
```

### 6.2 Migrasi dari VPS Lama ke VPS Baru

```bash
# ── Di VPS LAMA ──────────────────────────────────
cd /opt/teknomed

# Backup volumes
docker compose stop
tar -czf /tmp/teknomed-backup-$(date +%Y%m%d).tar.gz \
  -C /var/lib/docker/volumes/ \
  teknomed_caddy_data \
  teknomed_caddy_config \
  teknomed_pdf_logs \
  teknomed_pdf_cache

# Transfer ke VPS baru
scp /tmp/teknomed-backup-*.tar.gz root@[NEW_VPS_IP]:/tmp/

# ── Di VPS BARU ──────────────────────────────────
ssh root@[NEW_VPS_IP]

# Setup Docker (section 6.1)
# ...

# Restore volumes
cd /opt/teknomed
docker compose up -d  # start dulu biar volumes ke-create
docker compose stop

# Extract backup ke volumes
tar -xzf /tmp/teknomed-backup-*.tar.gz -C /var/lib/docker/volumes/

# Start lagi
docker compose up -d

# Update DNS A record ke IP VPS baru
# Tunggu propagate (5-30 menit)

# Test
curl -I https://teknomedindotimurpt.co.id
```

### 6.3 Rollback (kalau VPS baru bermasalah)

```bash
# Di VPS lama (DNS masih belum di-update)
docker compose start  # start lagi

# Update DNS balik ke IP lama
# Done
```

## 7. Image Registry Strategy

### 7.1 Option A: Build di VPS (simple, untuk KP)
```bash
# Clone repo ke VPS, build di sana
docker compose up -d --build
```
**Pro**: Simple, no registry needed.
**Con**: Build di VPS (butuh RAM saat build).

### 7.2 Option B: GitHub Container Registry (GHCR)
```yaml
# .github/workflows/build-push.yml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [teknomed-web, 3d-viewer, pdf-service]
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: ./services/${{ matrix.service }}
          push: true
          tags: ghcr.io/${{ github.repository }}/${{ matrix.service }}:latest
          build-args: |
            VITE_SUPABASE_URL=${{ secrets.VITE_SUPABASE_URL }}
            VITE_SUPABASE_ANON_KEY=${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

**Di VPS**:
```yaml
# docker-compose.yml (pull dari GHCR)
services:
  teknomed-web:
    image: ghcr.io/user/teknomed-deploy/teknomed-web:latest
    # tidak perlu build context
```

```bash
# Deploy = pull image baru + restart
docker compose pull
docker compose up -d
```

**Pro**: Build di CI (VPS ringan), version control images.
**Con**: Butuh setup GitHub Actions.

### 7.3 Rekomendasi untuk KP
**Option A** (build di VPS) — simple, cukup untuk KP. Upgrade ke Option B kalau ada waktu.

## 8. Backup Strategy (Docker)

### 8.1 Volume Backup (cron di VPS)
```bash
# /etc/cron.daily/backup-teknomed
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR=/var/backups/teknomed

mkdir -p $BACKUP_DIR

# Backup volumes
docker run --rm \
  -v teknomed_caddy_data:/data \
  -v $BACKUP_DIR:/backup \
  alpine tar -czf /backup/caddy_data-$DATE.tar.gz -C /data .

# Keep 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### 8.2 Database Backup (Supabase, external)
Supabase cloud: daily automatic backup (7 days retention).
Manual: `pg_dump` via Supabase connection string (lihat docs/08-DEPLOYMENT.md).

### 8.3 Full VPS Snapshot
- DigitalOcean: weekly automatic backup ($1/bln, 20% droplet price)
- Hetzner: weekly automatic snapshot (€0.012/GB/bln)

## 9. Monitoring (Docker)

### 9.1 Health Check
```yaml
# docker-compose.yml
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost/"]
  interval: 30s
  timeout: 5s
  retries: 3
```

```bash
# Cek health
docker compose ps
# STATUS: healthy / unhealthy / starting
```

### 9.2 Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f teknomed-web
docker compose logs -f pdf-service

# Last 100 lines
docker compose logs --tail 100 pdf-service
```

### 9.3 Resource Usage
```bash
# Container stats (real-time)
docker stats

# Disk usage
docker system df

# Clean up (unused images, containers)
docker system prune -a
```

### 9.4 Portainer (optional GUI)
```bash
docker run -d -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```
Akses: `https://[VPS_IP]:9443` (self-signed cert, atau setup domain).

## 10. Security Checklist (Docker)

- [ ] `.env` tidak di-git (`.gitignore`)
- [ ] `service_role` key tidak di frontend (hanya pdf-service)
- [ ] Container run as non-root (tambah `USER node` di Dockerfile)
- [ ] Read-only filesystem untuk static (nginx)
- [ ] Network isolation (internal network `teknomed_net`)
- [ ] Rate limit di Caddy (inquiry endpoint)
- [ ] Firewall (ufw) hanya allow 22, 80, 443
- [ ] Docker daemon config: `live-restore: true` (container tetap jalan saat daemon restart)
- [ ] Regular `docker compose pull` untuk update image base
- [ ] Scan image: `docker scout cves teknomed-web`

## 11. Cost Estimate (Docker vs Bare Metal)

| Item | Bare Metal | Docker |
|------|-----------|--------|
| VPS Hetzner CX22 | €4.5/bln | €4.5/bln |
| Resource overhead | 0 | +100MB RAM |
| Backup (snapshot) | €0.24/bln | €0.24/bln |
| **Total** | **€4.74/bln** | **€4.74/bln** |

Docker tidak tambah biaya, hanya tambah ~100MB RAM overhead. CX22 (2GB RAM) masih cukup.

## 12. Migration Checklist (VPS to VPS)

### Pre-migration
- [ ] VPS baru sudah setup Docker + Docker Compose
- [ ] DNS access siap (untuk update A record)
- [ ] Backup VPS lama lengkap (volumes + DB)
- [ ] Test restore backup di local/staging

### Migration day
- [ ] Stop services di VPS lama: `docker compose stop`
- [ ] Backup volumes: `tar -czf backup.tar.gz ...`
- [ ] Transfer backup ke VPS baru: `scp backup.tar.gz root@NEW:/tmp/`
- [ ] Clone repo ke VPS baru: `git clone ... /opt/teknomed`
- [ ] Setup `.env` di VPS baru
- [ ] Start services: `docker compose up -d`
- [ ] Stop services: `docker compose stop`
- [ ] Restore volumes: `tar -xzf backup.tar.gz -C /var/lib/docker/volumes/`
- [ ] Start services: `docker compose up -d`
- [ ] Update DNS A record ke IP VPS baru
- [ ] Tunggu DNS propagate (5-30 menit)
- [ ] Test: `curl -I https://teknomedindotimurpt.co.id`
- [ ] Test: admin login + CRUD
- [ ] Test: 3D viewer
- [ ] Test: PDF generate

### Post-migration
- [ ] Monitor logs 24 jam: `docker compose logs -f`
- [ ] Update UptimeRobot monitor ke IP baru (atau biarkan domain)
- [ ] Decommission VPS lama (setelah 7 hari stabil)
- [ ] Document new VPS credentials + SSH key

## 13. Folder Structure (Deploy Repo)

```
teknomed-deploy/                    # Repo terpisah untuk deploy
├── docker-compose.yml
├── Caddyfile
├── .env.example
├── .gitignore
├── README.md
├── teknomed-web/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── dist/                       # (gitignored, build di VPS atau CI)
├── 3d-viewer/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── dist/                       # (gitignored)
├── pdf-service/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── .env                        # (gitignored)
└── scripts/
    ├── backup.sh
    ├── restore.sh
    └── deploy.sh
```

**Atau**: Monorepo dengan teknomed-web, 3d-viewer, pdf-service sebagai subfolder. Build context masing-masing.

## 14. Commands Cheat Sheet

```bash
# ── Build & Start ──────────────────────────────
docker compose up -d --build        # Build + start detached
docker compose up -d                # Start tanpa rebuild
docker compose down                 # Stop + remove containers
docker compose restart pdf-service  # Restart 1 service

# ── Logs ───────────────────────────────────────
docker compose logs -f              # Follow all logs
docker compose logs -f teknomed-web # Follow 1 service
docker compose logs --tail 100      # Last 100 lines

# ── Status ─────────────────────────────────────
docker compose ps                   # List containers + status
docker stats                        # Real-time resource usage
docker system df                    # Disk usage

# ── Exec ───────────────────────────────────────
docker compose exec teknomed-web sh # Shell ke container
docker compose exec pdf-service node # Node REPL di container

# ── Update ─────────────────────────────────────
git pull                            # Pull code terbaru
docker compose up -d --build        # Rebuild + restart
docker compose pull                 # Pull image dari registry

# ── Backup ─────────────────────────────────────
docker compose stop
tar -czf backup-$(date +%Y%m%d).tar.gz /var/lib/docker/volumes/teknomed_*
docker compose start

# ── Cleanup ────────────────────────────────────
docker system prune -a              # Hapus unused images, containers
docker volume prune                 # Hapus unused volumes (HATI-HATI)
```
