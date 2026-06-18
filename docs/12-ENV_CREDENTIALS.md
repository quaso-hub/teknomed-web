# 12 — Environment & Credentials

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Status**: ✅ All credentials ready, VPS accessible, 3 repos pushed

## 1. Supabase (Cloud) — ✅ READY

| Item | Value |
|------|-------|
| **Project ID** | `jssqoalxnmkpmogouypy` |
| **Project URL** | `https://jssqoalxnmkpmogouypy.supabase.co` |
| **Region** | Singapore |
| **Publishable Key (anon)** | `sb_publishable_Egc7nfZTxy74078Tj3oX2A_4mPyUz3t` |
| **Secret Key (service_role)** | `sb_secret_pLHtfLU1UxB9LfMntLtNRw_a3387Uly` |
| **Anon JWT** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODgwMDcsImV4cCI6MjA5NjY2NDAwN30.NCtOrsbefv4c3wN5DGwe10r8eXoF-uGEI3zpEvZfg_I` |
| **Service Role JWT** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4ODAwNywiZXhwIjoyMDk2NjY0MDA3fQ.e1jKs3C-DigkwMqkk0-8gaQwBs_MEAOasHVOU9lJ7ek` |
| **JWT Secret (legacy)** | `8FCv9PzZbw9l8FP1m01c9Ofi4jX0fShzRz0l3a31WLttxZsbfBlmU+xwVCHTQM+dqFbQRoK7sDLyUXUMzsOyxA==` |
| **JWT Signing Key (current)** | `2e99c289-4fef-4795-b042-2ba35263126d` |
| **JWT Signing key (previous)** | `452daaa2-229f-4a31-9f99-bb8d9481283d` |

### Env vars untuk teknomed-web (`.env.local` / `.env.production`):
```env
VITE_SUPABASE_URL=https://jssqoalxnmkpmogouypy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODgwMDcsImV4cCI6MjA5NjY2NDAwN30.NCtOrsbefv4c3wN5DGwe10r8eXoF-uGEI3zpEvZfg_I
VITE_3D_VIEWER_URL=https://3d.teknomedindotimurpt.co.id
```

### Env vars untuk pdf-service (`/opt/pdf-service/.env`):
```env
SUPABASE_URL=https://jssqoalxnmkpmogouypy.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4ODAwNywiZXhwIjoyMDk2NjY0MDA3fQ.e1jKs3C-DigkwMqkk0-8gaQwBs_MEAOasHVOU9lJ7ek
SUPABASE_JWT_SECRET=2e99c289-4fef-4795-b042-2ba35263126d
RESEND_API_KEY=re_xxx (setup setelah daftar Resend)
PORT=3001
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

## 2. VPS DigitalOcean — ✅ READY (SSH accessible)

| Item | Value |
|------|-------|
| **Public IP** | `159.65.226.164` |
| **Tailscale IP** | `100.104.53.45` (firewall block SSH, pakai public IP) |
| **Tailscale hostname** | `agent-buntu-brutal` |
| **OS** | Ubuntu 22.04.5 LTS (Jammy) |
| **Specs** | 4 vCPU, 8GB RAM, 155GB disk |
| **User** | `root` |
| **SSH key** | `~/.ssh/hermes_vps` (ed25519) |
| **SSH command** | `ssh -i ~/.ssh/hermes_vps root@159.65.226.164` |

### Installed tools di VPS:
- Docker 29.3.0 ✅
- Node v12.22.9 (perlu upgrade ke 20 LTS untuk PDF service)
- npm
- nginx

### SSH key setup
Key `hermes_vps` sudah terdaftar di VPS. Test berhasil:
```bash
ssh -i C:\Users\warma\.ssh\hermes_vps root@159.65.226.164
# Output: agent-buntu-brutal, Ubuntu 22.04.5 LTS
```

## 3. GitHub Repos — ✅ ALL PUSHED

| Repo | URL | Status | Local Path |
|------|-----|--------|------------|
| teknomed-web | https://github.com/quaso-hub/teknomed-web | ✅ Pushed (50 commits, force push) | `D:\playgrounds\teknomed-web` |
| 3dproductvisualization | https://github.com/quaso-hub/3dproductvisualization | ✅ Pushed (29 commits + merge, force push) | `D:\playgrounds\3d-product-catalog\3dproductvisualization` |
| catalog-new | https://github.com/quaso-hub/catalog-new | ✅ Pushed (init, 129 files) | `C:\Users\warma\Documents\brosur-lin\catalog-new` |

### Git config (lokal):
- user.name: `awokawokwkwkw` (perlu update ke `quaso-hub` atau `I Kadek Restu Nugraha`)
- user.email: `147193334+quaso-hub@users.noreply.github.com`
- credential.helper: `manager` (Git Credential Manager)

## 4. Domain — PENDING (pakai IP dulu)

| Domain | Target | Status |
|--------|--------|--------|
| `teknomedindotimurpt.co.id` | `159.65.226.164` | Pending DNS A record (pakai IP dulu) |
| `3d.teknomedindotimurpt.co.id` | `159.65.226.164` | Pending |
| `api.teknomedindotimurpt.co.id` | `159.65.226.164` | Pending |

**Sementara**: akses via `http://159.65.226.164` (tanpa HTTPS, tanpa domain). Caddy bisa setup nanti dengan domain.

## 5. Resend (Email) — PENDING

| Item | Value |
|------|-------|
| **Status** | Belum daftar |
| **URL** | https://resend.com |
| **Free tier** | 100 email/hari, 3000/bulan |
| **Domain verify** | Butuh DNS access (TXT record) |

## 6. Action Items (urutan)

### ✅ Done
- [x] Setup SSH key ke VPS DO (hermes_vps, public IP 159.65.226.164)
- [x] Dapatkan public IP VPS DO (159.65.226.164)
- [x] Push 3 repo ke GitHub (teknomed-web, 3dproductvisualization, catalog-new)
- [x] Dapatkan JWT Secret dari Supabase (current + previous + legacy)

### Phase A (Supabase setup — bisa mulai sekarang)
- [ ] Run schema SQL (docs/05-DATA_MODEL.md section 2)
- [ ] Run RLS policies SQL (section 3)
- [ ] Run storage buckets SQL (section 4)
- [ ] Run seed data SQL (section 5)
- [ ] Create admin user via Supabase Auth
- [ ] Assign role super_admin ke admin user

### Phase G (Deploy — butuh domain dulu)
- [ ] Setup DNS A record (3 domain → 159.65.226.164)
- [ ] Daftar Resend + verify domain
- [ ] Deploy via Docker Compose (docs/11-DOCKER_MIGRATION.md)
- [ ] SSL auto via Caddy
- [ ] Smoke test production

### VPS Preparation (sebelum Phase G)
- [ ] Upgrade Node 12 → 20 LTS di VPS
- [ ] Install Docker Compose plugin (cek `docker compose version`)
- [ ] Setup Caddy di VPS
- [ ] Clone 3 repo ke VPS
