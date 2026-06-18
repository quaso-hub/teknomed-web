# 08 — Deployment Guide (VPS + Supabase + Caddy)

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Target**: VPS Hetzner CX22 / DigitalOcean Droplet + Supabase Cloud

## 1. Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet                                  │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐    ┌─────────────────────────────┐
│  Cloudflare (optional) │    │  Supabase Cloud              │
│  CDN + DNS             │    │  - Postgres + RLS            │
└───────────┬────────────┘    │  - Auth (JWT)                │
            │                  │  - Storage (S3)              │
            ▼                  │  - Edge Functions            │
┌────────────────────────┐    └─────────────────────────────┘
│  VPS Hetzner/DO        │
│  Ubuntu 24.04 LTS      │
│  ┌──────────────────┐  │
│  │ Caddy :443       │  │  Auto HTTPS (Let's Encrypt)
│  │  reverse proxy   │  │
│  └────────┬─────────┘  │
│           │             │
│  ┌────────┴─────────┐  │
│  │  Nginx (static)  │  │  Serve SPA builds
│  │  /var/www/*      │  │
│  └──────────────────┘  │
│  ┌──────────────────┐  │
│  │  Node :3001      │  │  PDF generator service
│  │  systemd         │  │
│  └──────────────────┘  │
└────────────────────────┘
```

## 2. Prerequisites

### 2.1 Accounts
- [ ] Supabase account (gratis, daftar via GitHub) — https://supabase.com
- [ ] VPS Hetzner atau DigitalOcean (butuh kartu kredit/PayPal)
  - Hetzner CX22: €4.5/bulan (1 vCPU, 2GB RAM, 20GB disk)
  - DO Droplet: $6/bulan (1 vCPU, 1GB RAM, 25GB SSD)
  - **Rekomendasi**: Hetzner CX22 (lebih RAM untuk Puppeteer)
- [ ] Domain teknomedindotimurpt.co.id (sudah ada, butuh DNS access)
- [ ] Resend account (gratis 100 email/hari) — https://resend.com
- [ ] Cloudflare account (optional, untuk CDN/DNS)

### 2.2 Local Tools
- [ ] Node 20 LTS
- [ ] npm/pnpm
- [ ] git
- [ ] SSH client
- [ ] Supabase CLI: `npm install -g supabase`
- [ ] Caddy (di VPS, install via apt)

### 2.3 SSH Keys
Generate SSH key lokal (kalau belum):
```bash
ssh-keygen -t ed25519 -C "teknomed-deploy" -f ~/.ssh/teknomed_deploy
```
Tambahkan public key ke VPS saat create droplet/instance.

## 3. Supabase Setup

### 3.1 Create Project
1. Login ke https://supabase.com
2. New Project → nama: `teknomed-prod`
3. Pilih region: Singapore (terdekat Indonesia)
4. Set database password (simpan di password manager!)
5. Tunggu 2-3 menit sampai project ready

### 3.2 Get Credentials
Di Supabase Dashboard → Settings → API:
- `Project URL`: `https://[PROJECT_REF].supabase.co`
- `anon public key`: `eyJ...` (safe untuk frontend)
- `service_role key`: `eyJ...` (JANGAN expose ke frontend, server only!)

Simpan di `.env.local` teknomed-web:
```env
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...anon...
```

Simpan di VPS `/opt/pdf-service/.env`:
```env
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_SERVICE_KEY=eyJ...service_role...
SUPABASE_JWT_SECRET=... (Settings → API → JWT Secret)
RESEND_API_KEY=...
PORT=3001
```

### 3.3 Run Schema
```bash
# Link project
supabase link --project-ref [PROJECT_REF]

# Run SQL (dari docs/05-DATA_MODEL.md)
supabase db execute --file docs/sql/01-schema.sql
supabase db execute --file docs/sql/02-rls.sql
supabase db execute --file docs/sql/03-storage.sql
supabase db execute --file docs/sql/04-seed.sql
```

### 3.4 Create Admin User
1. Supabase Dashboard → Authentication → Users → Add user
2. Email: `admin@teknomedindotimurpt.co.id` (atau email owner)
3. Password: generate strong password
4. Auto Confirm: ON
5. Save

### 3.5 Assign super_admin Role
```sql
-- Di Supabase SQL Editor
update profiles
set role = 'super_admin'
where email = 'admin@teknomedindotimurpt.co.id';
```

### 3.6 Setup Resend
1. Login ke https://resend.com
2. Add domain `teknomedindotimurpt.co.id` (verify via DNS)
3. Get API key
4. Set di Supabase:
```bash
supabase secrets set RESEND_API_KEY=re_xxx...
```

## 4. VPS Setup

### 4.1 Initial Server Setup
```bash
# SSH ke VPS
ssh root@[VPS_IP]

# Update system
apt update && apt upgrade -y

# Install Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install -y caddy

# Install Nginx (static serve)
apt install -y nginx

# Install PM2 (process manager, optional)
npm install -g pm2

# Create directories
mkdir -p /var/www/teknomed-web
mkdir -p /var/www/3d-viewer
mkdir -p /opt/pdf-service
mkdir -p /var/log/teknomed

# Create non-root user (security)
adduser teknomed --gecos ""
usermod -aG sudo teknomed
mkdir -p /home/teknomed/.ssh
cp ~/.ssh/authorized_keys /home/teknomed/.ssh/
chown -R teknomed:teknomed /home/teknomed/.ssh
chmod 700 /home/teknomed/.ssh
chmod 600 /home/teknomed/.ssh/authorized_keys
```

### 4.2 Firewall
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 4.3 Disable Root SSH (setelah test teknomed user bisa sudo)
```bash
# Edit /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

## 5. Caddy Configuration

### 5.1 Caddyfile
Edit `/etc/caddy/Caddyfile`:

```caddy
# Main domain — teknomed-web SPA
teknomedindotimurpt.co.id {
    root * /var/www/teknomed-web
    try_files {path} /index.html
    file_server

    # Gzip
    encode gzip zstd

    # Cache static assets
    @static path /assets/* /favicon.svg /logo_pt.png
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }
}

# 3D viewer subdomain
3d.teknomedindotimurpt.co.id {
    root * /var/www/3d-viewer
    try_files {path} /index.html
    file_server

    encode gzip zstd

    @static path /assets/*
    header @static Cache-Control "public, max-age=31536000, immutable"

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
    }
}

# API subdomain — Node PDF service
api.teknomedindotimurpt.co.id {
    reverse_proxy localhost:3001

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
    }
}
```

### 5.2 Reload Caddy
```bash
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
systemctl status caddy
```

Caddy auto-obtain SSL certificate dari Let's Encrypt saat start.

## 6. DNS Configuration

Di domain registrar (tempat beli domain) atau Cloudflare DNS:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `[VPS_IP]` | 300 |
| A | `3d` | `[VPS_IP]` | 300 |
| A | `api` | `[VPS_IP]` | 300 |
| CNAME | `www` | `teknomedindotimurpt.co.id` | 300 |

Tunggu DNS propagate (5-30 menit). Cek dengan:
```bash
dig teknomedindotimurpt.co.id
dig 3d.teknomedindotimurpt.co.id
dig api.teknomedindotimurpt.co.id
```

## 7. Build & Deploy SPA

### 7.1 teknomed-web
```bash
# Di lokal
cd D:\playgrounds\teknomed-web

# Set env production
echo "VITE_SUPABASE_URL=https://[REF].supabase.co" > .env.production
echo "VITE_SUPABASE_ANON_KEY=eyJ...anon..." >> .env.production
echo "VITE_3D_VIEWER_URL=https://3d.teknomedindotimurpt.co.id" >> .env.production

# Build
npm run build

# Deploy
scp -r dist/* root@[VPS_IP]:/var/www/teknomed-web/
# atau pakai teknomed user:
scp -r dist/* teknomed@[VPS_IP]:/var/www/teknomed-web/
```

### 7.2 3dproductvisualization
```bash
# Di lokal
cd D:\playgrounds\3d-product-catalog\3dproductvisualization

# Set env
echo "VITE_SUPABASE_URL=https://[REF].supabase.co" > .env.production
echo "VITE_SUPABASE_ANON_KEY=eyJ...anon..." >> .env.production

# Build
npm run build

# Deploy
scp -r dist/* root@[VPS_IP]:/var/www/3d-viewer/
```

### 7.3 Verify
```bash
curl -I https://teknomedindotimurpt.co.id
curl -I https://3d.teknomedindotimurpt.co.id
```
Harus return `200 OK` + `content-type: text/html`.

## 8. Node PDF Service Deploy

### 8.1 Copy Code
```bash
# Di VPS
cd /opt/pdf-service
# (copy code dari lokal, atau git clone)

# Atau dari lokal:
scp -r pdf-service/* root@[VPS_IP]:/opt/pdf-service/
```

### 8.2 Install Dependencies
```bash
cd /opt/pdf-service
npm install --production

# Install Puppeteer dependencies (Chromium)
apt install -y chromium-browser
# atau
npx puppeteer browsers install chrome
```

### 8.3 Environment
```bash
cat > /opt/pdf-service/.env << 'EOF'
SUPABASE_URL=https://[REF].supabase.co
SUPABASE_SERVICE_KEY=eyJ...service_role...
SUPABASE_JWT_SECRET=...
RESEND_API_KEY=...
PORT=3001
NODE_ENV=production
EOF

chmod 600 /opt/pdf-service/.env
```

### 8.4 Systemd Service
Buat `/etc/systemd/system/pdf-service.service`:

```ini
[Unit]
Description=Teknomed PDF Generator Service
After=network.target

[Service]
Type=simple
User=teknomed
WorkingDirectory=/opt/pdf-service
EnvironmentFile=/opt/pdf-service/.env
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=5
StandardOutput=append:/var/log/teknomed/pdf-service.log
StandardError=append:/var/log/teknomed/pdf-service-error.log

[Install]
WantedBy=multi-user.target
```

### 8.5 Start Service
```bash
chown -R teknomed:teknomed /opt/pdf-service /var/log/teknomed

systemctl daemon-reload
systemctl enable pdf-service
systemctl start pdf-service
systemctl status pdf-service

# Test
curl http://localhost:3001/health
```

## 9. Supabase Edge Function Deploy

### 9.1 Create Function
```bash
# Di lokal
supabase functions new inquiry-notification
```

Edit `supabase/functions/inquiry-notification/index.ts`:
```typescript
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const { record } = await req.json()

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_KEY")!
  )

  // Fetch admin emails
  const { data: admins } = await supabase
    .from("profiles")
    .select("email")
    .in("role", ["super_admin", "admin", "editor"])

  // Send email via Resend
  const resendResp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Teknomed <noreply@teknomedindotimurpt.co.id>",
      to: admins.map(a => a.email),
      subject: `Inquiry Baru dari ${record.company_name}`,
      html: `
        <h2>Inquiry Baru</h2>
        <p><strong>Perusahaan:</strong> ${record.company_name}</p>
        <p><strong>Kontak:</strong> ${record.contact_person}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Telepon:</strong> ${record.phone || "-"}</p>
        <p><strong>Pesan:</strong> ${record.message}</p>
        <a href="https://teknomedindotimurpt.co.id/admin/inquiries">Lihat di Admin Panel</a>
      `,
    }),
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

### 9.2 Deploy Function
```bash
supabase functions deploy inquiry-notification

# Set webhook trigger di Supabase Dashboard:
# Database → Webhooks → Create
# Table: inquiries, Event: INSERT
# Function: inquiry-notification
```

## 10. Backup Strategy

### 10.1 Supabase (automatic)
- Free tier: daily backup, 7 days retention
- Pro tier ($25/bln): daily backup, 30 days retention + PITR

### 10.2 Manual Backup (cron di VPS)
Buat `/etc/cron.daily/backup-supabase`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR=/var/backups/supabase

mkdir -p $BACKUP_DIR

# Dump database (pakai pg_dump via Supabase connection string)
pg_dump "postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres" \
  -F c -f $BACKUP_DIR/teknomed-$DATE.dump

# Keep only last 7 days
find $BACKUP_DIR -name "*.dump" -mtime +7 -delete
```

```bash
chmod +x /etc/cron.daily/backup-supabase
```

### 10.3 VPS Snapshot
- Hetzner: weekly automatic snapshot (€0.012/GB/bln)
- DigitalOcean: weekly automatic backup ($1/bulan)

## 11. Monitoring

### 11.1 Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) (free 50 monitors)
  - Monitor: `https://teknomedindotimurpt.co.id` (HTTP 200)
  - Monitor: `https://3d.teknomedindotimurpt.co.id` (HTTP 200)
  - Monitor: `https://api.teknomedindotimurpt.co.id/health` (HTTP 200)
  - Alert: email + Telegram

### 11.2 Error Tracking (optional)
- [Sentry](https://sentry.io) (free 5k errors/bulan)
  - Setup di teknomed-web: `npm install @sentry/react`
  - DSN di `.env.production`

### 11.3 Log Monitoring
```bash
# Caddy logs
journalctl -u caddy -f

# PDF service logs
tail -f /var/log/teknomed/pdf-service.log

# System logs
journalctl -f
```

### 11.4 Supabase Monitoring
- Dashboard → Reports: DB size, API requests, Auth users
- Alert: email jika DB size > 80% quota

## 12. CI/CD (optional, GitHub Actions)

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_3D_VIEWER_URL: ${{ secrets.VITE_3D_VIEWER_URL }}

      - name: Deploy to VPS
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "dist/*"
          target: "/var/www/teknomed-web/"
          strip_components: 1
```

## 13. Troubleshooting

### 13.1 Caddy SSL gagal
```bash
# Cek logs
journalctl -u caddy -n 50

# Common: DNS belum propagate
dig teknomedindotimurpt.co.id

# Force retry
systemctl restart caddy
```

### 13.2 SPA 404 di refresh
Pastikan `try_files {path} /index.html` di Caddyfile (sudah ada di config atas).

### 13.3 PDF service timeout
```bash
# Cek memory
free -h

# Puppeteer butuh minimal 512MB free
# Kalau OOM, upgrade VPS atau add swap:
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 13.4 Supabase RLS block
```sql
-- Cek policy
select * from pg_policies where tablename = 'products';

-- Test sebagai anon
select * from products; -- harus return published=true only

-- Test sebagai admin (pakai service_role di backend)
```

### 13.5 3D viewer iframe blocked
Cek header `X-Frame-Options` di 3d-viewer domain. Pastikan `SAMEORIGIN` atau hapus jika perlu cross-origin.

## 14. Maintenance Checklist

### Weekly
- [ ] Cek VPS disk space: `df -h`
- [ ] Cek VPS memory: `free -h`
- [ ] Cek backup Supabase terbaru
- [ ] Cek UptimeRobot report

### Monthly
- [ ] Update VPS: `apt update && apt upgrade`
- [ ] Update Node: `npm install -g n && n latest`
- [ ] Cek Supabase usage (DB size, API requests)
- [ ] Review audit log (jika ada)
- [ ] Rotate secrets (optional)

### Quarterly
- [ ] Renew domain (jika perlu)
- [ ] Review Supabase plan (upgrade kalau perlu)
- [ ] Security audit (RLS, JWT, secrets)
- [ ] Update dependencies: `npm audit && npm update`

## 15. Rollback Procedure

### 15.1 SPA Rollback
```bash
# Keep previous build
cp -r /var/www/teknomed-web /var/www/teknomed-web.bak.$(date +%Y%m%d)

# Deploy new build
scp -r dist/* root@[VPS]:/var/www/teknomed-web/

# Kalau rollback:
rm -rf /var/www/teknomed-web
mv /var/www/teknomed-web.bak.* /var/www/teknomed-web
```

### 15.2 Database Rollback
```bash
# Restore dari backup
pg_restore -d "postgresql://postgres:[PWD]@db.[REF].supabase.co:5432/postgres" \
  /var/backups/supabase/teknomed-YYYYMMDD.dump
```

### 15.3 Supabase Point-in-Time Recovery (Pro tier)
Supabase Dashboard → Database → Backups → Restore to timestamp.

## 16. Cost Estimate (monthly)

| Item | Cost |
|------|------|
| VPS Hetzner CX22 | €4.5 (~$5) |
| Domain (annual /12) | ~$1 |
| Supabase free tier | $0 |
| Resend free tier | $0 |
| Cloudflare free | $0 |
| UptimeRobot free | $0 |
| **Total** | **~$6/bulan** |

Kalau Supabase upgrade ke Pro: +$25/bulan (untuk 8GB DB + 30-day backup).

## 17. Security Checklist

- [ ] HTTPS only (Caddy auto)
- [ ] HSTS header
- [ ] RLS enabled semua table
- [ ] service_role key tidak di frontend
- [ ] JWT secret di VPS env, tidak di git
- [ ] Firewall (ufw) aktif
- [ ] Root SSH disabled
- [ ] Password strong untuk admin user
- [ ] Supabase Auth: email confirm + secure password
- [ ] Rate limit inquiry (Supabase Edge Function atau Caddy)
- [ ] Input validation (zod) semua form
- [ ] CSP header (optional, tambah di Caddy)
- [ ] Regular backup
- [ ] Monitor logs
