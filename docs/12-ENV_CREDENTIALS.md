# 12 — Environment & Credentials

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Status**: Credentials ready, VPS SSH butuh setup key

## 1. Supabase (Cloud) — READY

| Item | Value |
|------|-------|
| **Project ID** | `jssqoalxnmkpmogouypy` |
| **Project URL** | `https://jssqoalxnmkpmogouypy.supabase.co` |
| **Region** | Singapore (terdekat Indonesia) |
| **Publishable Key (anon)** | `sb_publishable_Egc7nfZTxy74078Tj3oX2A_4mPyUz3t` |
| **Secret Key (service_role)** | `sb_secret_pLHtfLU1UxB9LfMntLtNRw_a3387Uly` |
| **Anon JWT** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODgwMDcsImV4cCI6MjA5NjY2NDAwN30.NCtOrsbefv4c3wN5DGwe10r8eXoF-uGEI3zpEvZfg_I` |
| **Service Role JWT** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3FvYWx4bm1rcG1vZ291eXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA4ODAwNywiZXhwIjoyMDk2NjY0MDA3fQ.e1jKs3C-DigkwMqkk0-8gaQwBs_MEAOasHVOU9lJ7ek` |
| **JWT Secret** | (ambil di Supabase Dashboard → Settings → API → JWT Secret) |
| **DB Password** | (set saat create project, simpan di password manager) |

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
SUPABASE_JWT_SECRET=... (ambil dari Dashboard)
RESEND_API_KEY=re_xxx (setup setelah daftar Resend)
PORT=3001
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

## 2. VPS DigitalOcean — READY (butuh SSH key setup)

| Item | Value |
|------|-------|
| **IP (Tailscale)** | `100.104.53.45` |
| **Tailscale hostname** | `agent-buntu-brutal` |
| **OS** | Linux (Ubuntu, asumsi) |
| **User** | `root` |
| **SSH keys lokal** | `~/.ssh/id_ed25519`, `~/.ssh/kiro_vps_key`, `~/.ssh/n8n_vps_key`, `~/.ssh/id_rsa` |
| **Status SSH** | ❌ Permission denied (key belum terdaftar di VPS) |

### 2.1 SSH Key Setup (TODO)
Semua 4 key lokal gagal SSH ke VPS. Kemungkinan:
1. VPS butuh SSH key yang belum di-add (generate baru atau add public key via DO console)
2. VPS pakai password auth (butuh password dari DO dashboard)
3. SSH key sudah ada tapi untuk user berbeda (bukan root)

### 2.2 Solusi (pilih satu):
**Option A: Add SSH key via DigitalOcean Console**
1. Login ke https://cloud.digitalocean.com
2. Droplets → pilih VPS → Access → Launch Droplet Console
3. Jalankan di console:
```bash
# Add public key id_ed25519
mkdir -p ~/.ssh
echo "ssh-ed25519 AAAA... user@host" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Option B: Reset root password**
1. DO Dashboard → Droplet → Reset root password
2. Cek email untuk password baru
3. SSH dengan password: `ssh root@100.104.53.45`
4. Add SSH key setelah login

**Option C: Generate SSH key baru khusus VPS ini**
```bash
ssh-keygen -t ed25519 -C "teknomed-vps" -f ~/.ssh/teknomed_vps
# Copy public key
cat ~/.ssh/teknomed_vps.pub
# Add ke DO Console (Option A)
```

### 2.3 Public keys lokal (untuk reference)
```bash
# id_ed25519.pub (ed25519, recommended)
cat ~/.ssh/id_ed25519.pub

# kiro_vps_key.pub
cat ~/.ssh/kiro_vps_key.pub

# n8n_vps_key.pub
cat ~/.ssh/n8n_vps_key.pub

# id_rsa.pub (RSA, legacy)
cat ~/.ssh/id_rsa.pub
```

## 3. Domain — PENDING DNS ACCESS

| Domain | Target | Status |
|--------|--------|--------|
| `teknomedindotimurpt.co.id` | VPS IP (public, bukan Tailscale) | Pending DNS A record |
| `3d.teknomedindotimurpt.co.id` | VPS IP | Pending |
| `api.teknomedindotimurpt.co.id` | VPS IP | Pending |

**Note**: VPS DO saat ini hanya punya Tailscale IP (`100.104.53.45`). Untuk domain public, butuh:
- **Public IP** VPS DO (cek di DO Dashboard → Droplet → Networking → Public IP), ATAU
- **Cloudflare Tunnel** (expose VPS via tunnel, tidak butuh public IP), ATAU
- **VPS lain** dengan public IP (Hetzner)

## 4. Resend (Email) — PENDING

| Item | Value |
|------|-------|
| **Status** | Belum daftar |
| **URL** | https://resend.com |
| **Free tier** | 100 email/hari, 3000/bulan |
| **Domain verify** | Butuh DNS access (TXT record) |

## 5. GitHub (repo + CI/CD) — PENDING

| Item | Value |
|------|-------|
| **Repo teknomed-web** | `D:\playgrounds\teknomed-web` (local, belum push) |
| **Repo 3d-viewer** | `D:\playgrounds\3d-product-catalog\3dproductvisualization` (local) |
| **Repo catalog-new** | `C:\Users\warma\Documents\brosur-lin\catalog-new` (local) |
| **GHCR** | Optional, untuk image registry |

## 6. Action Items (urutan)

### Immediate (sebelum eksekusi Phase A)
- [ ] Setup SSH key ke VPS DO (section 2.2)
- [ ] Dapatkan public IP VPS DO (atau setup Cloudflare Tunnel)
- [ ] Daftar Resend + verify domain
- [ ] Push 3 repo ke GitHub (atau git remote private)
- [ ] Dapatkan JWT Secret dari Supabase Dashboard

### Phase A (Supabase setup)
- [ ] Run schema SQL (docs/05-DATA_MODEL.md)
- [ ] Run RLS policies SQL
- [ ] Run storage buckets SQL
- [ ] Run seed data SQL
- [ ] Create admin user + assign super_admin role

### Phase G (Deploy)
- [ ] Setup DNS A record (3 domain)
- [ ] Deploy via Docker Compose (docs/11-DOCKER_MIGRATION.md)
- [ ] SSL auto via Caddy
- [ ] Smoke test production
