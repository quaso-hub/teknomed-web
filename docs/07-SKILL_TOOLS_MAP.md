# 07 — Skill, Tools, Agent Mapping

> **Project**: Teknomed Integrated System
> **Versi**: 1.0.0 — 2026-06-18
> **Tujuan**: Mapping skill, tools, agent, MCP yang relevan per phase untuk eksekusi AI-assisted.

## 1. Skill Catalog (relevan untuk project ini)

### 1.1 UI/UX & Frontend
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `shadcn` | `~/.agents/skills/shadcn/` | Manages shadcn/ui components + projects |
| `ui-ux-pro-max` | `~/.agents/skills/ui-ux-pro-max/` | Comprehensive design guide web/mobile |
| `ui-ux-designer` | `~/.agents/skills/ui-ux-designer/` | Interface design, wireframes, design systems |
| `ui-skills` | `~/.agents/skills/ui-skills/` | Opinionated UI constraints |
| `ui-styling` | `~/.claude/skills/ui-styling/` | shadcn/ui + Tailwind + canvas design |
| `design` | `~/.claude/skills/design/` | Brand identity, design tokens, logo, CIP |
| `design-system` | `~/.config/opencode/skills/design-system/` | Audit/document/extend design system |
| `design-taste-frontend` | `~/.agents/skills/design-taste-frontend/` | High-agency frontend with anti-generic rules |
| `frontend-expert` | (agent) | React, Next.js, Tailwind, shadcn/ui specialist |
| `frontend-developer` | `~/.agents/skills/frontend-developer/` | React 19, Next.js 15, modern frontend |
| `tailwind-design-system` | `~/.agents/skills/tailwind-design-system/` | Production-ready design system with Tailwind |
| `tailwind-patterns` | `~/.agents/skills/tailwind-patterns/` | Tailwind v4 CSS-first, container queries |
| `radix-ui-design-system` | `~/.agents/skills/radix-ui-design-system/` | Accessible design systems with Radix |
| `modern-web-design` | `~/.agents/skills/modern-web-design/` | 2024-2025 design trends, micro-interactions |
| `high-end-visual-design` | `~/.agents/skills/high-end-visual-design/` | Premium fonts, spatial rhythm, soft depth |
| `minimalist-ui` | `~/.agents/skills/minimalist-ui/` | Clean editorial interfaces (admin vibe) |
| `gpt-taste` | `~/.agents/skills/gpt-taste/` | GSAP-heavy frontend, AIDA structure |
| `antigravity-design-expert` | `~/.claude/skills/antigravity-design-expert/` | Glassmorphism, 3D CSS, GSAP |
| `baseline-ui` | `~/.agents/skills/baseline-ui/` | Animation durations, typography scale, a11y |
| `fixing-accessibility` | `~/.agents/skills/fixing-accessibility/` | ARIA, keyboard nav, focus, contrast |
| `accessibility-review` | `~/.config/opencode/skills/accessibility-review/` | WCAG 2.1 AA audit |
| `wcag-audit-patterns` | `~/.agents/skills/wcag-audit-patterns/` | WCAG 2.2 audit + remediation |

### 1.2 Backend & Database
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `supabase` | `~/.agents/skills/supabase/` | Supabase Database, Auth, Edge Functions, Storage, RLS |
| `supabase-postgres-best-practices` | `~/.agents/skills/supabase-postgres-best-practices/` | Postgres performance from Supabase |
| `postgres-best-practices` | `~/.agents/skills/postgres-best-practices/` | Postgres query optimization |
| `database-design` | `~/.agents/skills/database-design/` | Schema design, indexing, ORM selection |
| `api-design-principles` | `~/.agents/skills/api-design-principles/` | REST + GraphQL design |
| `auth-implementation-patterns` | `~/.agents/skills/auth-implementation-patterns/` | Auth + authz patterns |
| `drizzle-orm-expert` | `~/.agents/skills/drizzle-orm-expert/` | Drizzle ORM (if needed) |
| `prisma-expert` | `~/.agents/skills/prisma-expert/` | Prisma ORM (alternative) |

### 1.3 DevOps & Deploy
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `cloud-architect` | `~/.agents/skills/cloud-architect/` | AWS/Azure/GCP multi-cloud, IaC |
| `devops-deploy` | `~/.agents/skills/devops-deploy/` | Docker, CI/CD, AWS Lambda, Terraform |
| `docker-expert` | `~/.agents/skills/docker-expert/` | Container optimization, multi-stage builds |
| `deployment-procedures` | `~/.agents/skills/deployment-procedures/` | Safe deployment, rollback |
| `vercel-deployment` | `~/.agents/skills/vercel-deployment/` | Vercel deploy (alternative) |
| `cloudflare-workers-expert` | `~/.agents/skills/cloudflare-workers-expert/` | Cloudflare Workers + Edge |
| `secrets-management` | `~/.agents/skills/secrets-management/` | Vault, AWS Secrets Manager |

### 1.4 Documentation & Planning
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `architecture` | `~/.config/opencode/skills/architecture/` | ADR, system design |
| `architecture-decision-records` | `~/.agents/skills/architecture-decision-records/` | ADR patterns |
| `write-spec` | `~/.config/opencode/skills/write-spec/` | Feature spec / PRD |
| `spec-kit-workflow` | `~/.claude/skills/spec-kit-workflow/` | GitHub Spec-Kit (Specify → Plan → Tasks → Implement) |
| `documentation` | `~/.config/opencode/skills/documentation/` | Technical docs, README, runbook |
| `docs-architect` | `~/.agents/skills/docs-architect/` | Technical manuals from codebase |
| `system-design` | `~/.config/opencode/skills/system-design/` | System architecture, API design |
| `prd` (via architect agent) | — | PRD creation |

### 1.5 Code Quality & Review
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `clean-code` | `~/.agents/skills/clean-code/` | Uncle Bob principles |
| `code-review` | `~/.config/opencode/skills/code-review/` | Review changes for security/perf/correctness |
| `typescript-pro` | `~/.agents/skills/typescript-pro/` | Advanced types, generics, strict safety |
| `typescript-advanced-types` | `~/.agents/skills/typescript-advanced-types/` | Conditional, mapped, template literal types |
| `zod-validation-expert` | `~/.agents/skills/zod-validation-expert/` | Zod schema validation |
| `lint-and-validate` | `~/.agents/skills/lint-and-validate/` | Validation after every code change |
| `tdd-workflow` | `~/.agents/skills/tdd-workflow/` | RED-GREEN-REFACTOR |
| `testing-patterns` | `~/.agents/skills/testing-patterns/` | Jest, factory, mocking |
| `e2e-testing` | `~/.agents/skills/e2e-testing/` | Playwright E2E |

### 1.6 3D & WebGL
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `threejs-webgl` | `~/.agents/skills/threejs-webgl/` | Three.js 3D web dev |
| `threejs-fundamentals` | `~/.agents/skills/threejs-fundamentals/` | Scene, camera, renderer |
| `threejs-loaders` | `~/.agents/skills/threejs-loaders/` | GLTF, textures, HDR |
| `3d-web-experience` | `~/.agents/skills/3d-web-experience/` | Three.js, R3F, Spline, WebGL |
| `blender-3d-pipeline` | `~/.claude/skills/blender-3d-pipeline/` | Blender to web (glTF) |

### 1.7 Office & Docs
| Skill | Lokasi | Use Case |
|-------|--------|----------|
| `docx` | `~/.agents/skills/docx/` | Word document creation |
| `pdf` | `~/.agents/skills/pdf/` | PDF processing |
| `office-crud` | `~/.config/opencode/skills/office-crud/` | DOCX, XLSX, PPTX CRUD |
| `officecli` | `~/.agents/skills/officecli/` | Office CLI |

## 2. MCP Servers (aktif di sesi ini)

| MCP | Tools | Use Case |
|-----|-------|----------|
| `codegraph` | `codegraph_*` | Codebase knowledge graph (structural queries) |
| `shadcn` | (tweakcn.com) | Search, preview, install shadcn components + themes |
| `graphify` | (skill) | Code/docs → knowledge graph |
| `9router` | (skill) | AI gateway (chat, embeddings, web search, fetch) |

## 3. Agents (subagent_type untuk Task tool)

| Agent | Use Case |
|-------|----------|
| `frontend-expert` | React, Next.js, Tailwind, shadcn/ui implementation |
| `deepseek-coder` | Code implementation (Kiro Claude Sonnet) |
| `build` | Build execution |
| `architect` | System architecture, PRD, scalable design |
| `db-admin` | Postgres, Prisma, SQL optimization |
| `qa-tester` | Vitest, Playwright test suites |
| `reviewer` | Strict code review (security, perf, best practices) |
| `browser-operator` | Browser automation, UI QA, screenshots |
| `vision-analyst` | Image/screenshot/UI analysis |
| `office-operator` | DOCX, XLSX, PPTX, Markdown CRUD |
| `explorer` | Fast codebase exploration |
| `general` | General-purpose multi-step tasks |

## 4. Mapping per Phase

### Phase A — Supabase Setup
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| A-02 Run schema SQL | `supabase`, `database-design` | `db-admin` | bash (psql/supabase CLI) |
| A-03 RLS policies | `supabase`, `auth-implementation-patterns` | `db-admin` | bash |
| A-04 Storage buckets | `supabase` | `db-admin` | bash |
| A-05 Seed data | `supabase` | `db-admin` | bash |
| A-08 Test RLS | `supabase` | `db-admin`, `qa-tester` | bash |

**Commands**:
```bash
# Install Supabase CLI
npm install -g supabase

# Login + link project
supabase login
supabase link --project-ref [PROJECT_REF]

# Run SQL
supabase db execute --file schema.sql
supabase db execute --file rls.sql
supabase db execute --file storage.sql
supabase db execute --file seed.sql
```

### Phase B — Web Integration
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| B-02 supabase.ts | `supabase`, `typescript-pro` | `deepseek-coder` | edit, bash |
| B-03 api.ts (cache+fallback) | `supabase`, `typescript-pro` | `deepseek-coder` | edit, bash |
| B-04/08 refactor data layer | `supabase`, `typescript-pro` | `deepseek-coder` | edit |
| B-09 loading states | `ui-skills`, `baseline-ui` | `frontend-expert` | edit |
| B-10 error states | `fixing-accessibility` | `frontend-expert` | edit |
| B-11/12 test | `e2e-testing` | `qa-tester` | bash, browser-operator |

**Skill load sequence**:
```
skill: supabase
skill: typescript-pro
skill: ui-skills
```

### Phase C — Admin Panel
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| C-01 shadcn init | `shadcn` | (direct) | bash, shadcn MCP |
| C-02 add components | `shadcn`, `ui-styling` | (direct) | shadcn MCP |
| C-03 tweakcn mono theme | `shadcn`, `minimalist-ui` | (direct) | tweakcn MCP |
| C-04 auth context | `supabase`, `auth-implementation-patterns` | `deepseek-coder` | edit |
| C-05 AdminLayout | `ui-ux-pro-max`, `minimalist-ui`, `design-taste-frontend` | `frontend-expert` | edit |
| C-06 Login | `ui-styling`, `fixing-accessibility` | `frontend-expert` | edit |
| C-07 Dashboard | `ui-ux-pro-max` | `frontend-expert` | edit |
| C-08/09 Products CRUD | `shadcn`, `zod-validation-expert`, `typescript-pro` | `frontend-expert` | edit |
| C-10/12 other CRUD | `shadcn`, `zod-validation-expert` | `frontend-expert` | edit |
| C-13 Inquiries inbox | `shadcn`, `ui-ux-pro-max` | `frontend-expert` | edit |
| C-14 Settings | `shadcn`, `zod-validation-expert` | `frontend-expert` | edit |
| C-15 Users | `shadcn`, `auth-implementation-patterns` | `frontend-expert` | edit |
| C-16 image upload | `supabase` | `deepseek-coder` | edit |
| C-17 3D config editor | `supabase`, `threejs-webgl` | `frontend-expert` | edit |
| C-18 RBAC guard | `auth-implementation-patterns` | `deepseek-coder` | edit |
| C-19 focus trap | `fixing-accessibility` | `deepseek-coder` | edit (reuse useFocusTrap) |
| C-20/21 test | `e2e-testing`, `testing-patterns` | `qa-tester` | bash, browser-operator |

**Skill load sequence**:
```
skill: shadcn
skill: ui-ux-pro-max
skill: minimalist-ui
skill: design-taste-frontend
skill: supabase
skill: zod-validation-expert
skill: fixing-accessibility
```

**shadcn MCP commands**:
```
# Search component
mcp__shadcn__search({ query: "data-table" })

# Install component
mcp__shadcn__install({ name: "data-table" })

# Preview theme
mcp__shadcn__preview_theme({ theme: "mono" })

# Install theme
mcp__shadcn__install_theme({ theme: "mono" })
```

**tweakcn mono theme install**:
```bash
npx shadcn@latest add https://tweakcn.com/r/themes/mono.json
```

### Phase D — 3D Viewer Integration
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| D-01 deploy 3D viewer | `devops-deploy`, `cloud-architect` | `build` | bash |
| D-02/04 viewer + Supabase | `supabase`, `threejs-webgl`, `threejs-loaders` | `deepseek-coder` | edit |
| D-05 postMessage | `typescript-pro` | `deepseek-coder` | edit |
| D-06/08 teknomed-web route | `typescript-pro` | `deepseek-coder` | edit |
| D-07 Product3DViewer | `ui-ux-pro-max` | `frontend-expert` | edit |
| D-11/12 test | `e2e-testing` | `qa-tester`, `browser-operator` | bash |

**Skill load sequence**:
```
skill: threejs-webgl
skill: threejs-loaders
skill: supabase
skill: devops-deploy
```

### Phase E — Inquiry System
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| E-01 form + zod | `zod-validation-expert`, `ui-styling`, `fixing-accessibility` | `frontend-expert` | edit |
| E-02 submit Supabase | `supabase` | `deepseek-coder` | edit |
| E-03 honeypot | `auth-implementation-patterns` | `deepseek-coder` | edit |
| E-05 Edge Function | `supabase` | `deepseek-coder` | bash (supabase functions) |
| E-07/08 admin inbox | `shadcn`, `ui-ux-pro-max` | `frontend-expert` | edit |
| E-09 status update | `supabase`, `typescript-pro` | `deepseek-coder` | edit |
| E-10/11 test | `e2e-testing` | `qa-tester` | bash, browser-operator |

**Skill load sequence**:
```
skill: zod-validation-expert
skill: supabase
skill: ui-styling
skill: fixing-accessibility
```

### Phase F — PDF Generator
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| F-01 Node service | `api-design-principles` | `deepseek-coder` | edit, bash |
| F-03 JWT verify | `auth-implementation-patterns`, `supabase` | `deepseek-coder` | edit |
| F-04 fetch Supabase | `supabase` | `deepseek-coder` | edit |
| F-05 Astro render | (catalog-new existing) | `deepseek-coder` | edit |
| F-06 Puppeteer PDF | `devops-deploy` | `deepseek-coder` | edit, bash |
| F-07 upload Storage | `supabase` | `deepseek-coder` | edit |
| F-09/10 admin UI | `shadcn`, `ui-ux-pro-max` | `frontend-expert` | edit |
| F-12/13 test | `e2e-testing` | `qa-tester` | bash |

**Skill load sequence**:
```
skill: api-design-principles
skill: supabase
skill: devops-deploy
```

### Phase G — Polish + Deploy
| Task | Skill | Agent | Tools |
|------|-------|-------|-------|
| G-01/02 VPS + Caddy | `devops-deploy`, `cloud-architect`, `deployment-procedures` | `build` | bash |
| G-03/04 build + deploy | `deployment-procedures` | `build` | bash |
| G-05 systemd service | `devops-deploy` | `build` | bash |
| G-08 foto asli | `ui-ux-pro-max` | `frontend-expert` | edit |
| G-09/10/11 SEO | `seo`, `seo-technical`, `seo-schema` | `deepseek-coder` | edit |
| G-12 Lighthouse | `web-performance-optimization`, `fixing-accessibility` | `qa-tester`, `browser-operator` | bash |
| G-13 backup | `devops-deploy` | `build` | bash |
| G-15 user guide | `documentation`, `office-operator` | `office-operator` | docx |
| G-16 smoke test | `e2e-testing` | `qa-tester`, `browser-operator` | bash |

**Skill load sequence**:
```
skill: devops-deploy
skill: cloud-architect
skill: deployment-procedures
skill: seo
skill: web-performance-optimization
skill: documentation
```

## 5. Tools Call Sequence (per phase)

### Phase A — Supabase Setup
```
1. bash: npm install -g supabase
2. bash: supabase login
3. bash: supabase link --project-ref [REF]
4. bash: supabase db execute --file docs/sql/01-schema.sql
5. bash: supabase db execute --file docs/sql/02-rls.sql
6. bash: supabase db execute --file docs/sql/03-storage.sql
7. bash: supabase db execute --file docs/sql/04-seed.sql
8. (manual) Create admin user via Supabase Dashboard
9. bash: supabase db execute --file docs/sql/05-assign-role.sql
10. Task(db-admin): test RLS policies
```

### Phase B — Web Integration
```
1. bash: npm install @supabase/supabase-js
2. Write: src/shared/lib/supabase.ts
3. Write: src/app/lib/api.ts
4. skill: supabase
5. skill: typescript-pro
6. Task(deepseek-coder): refactor src/data/products.ts → async
7. Task(deepseek-coder): refactor src/data/projects.ts → async
8. Task(deepseek-coder): refactor src/data/services.ts → async
9. Task(deepseek-coder): refactor src/data/testimonials.ts → async
10. Task(deepseek-coder): refactor src/config/site.ts → fetch site_settings
11. Task(frontend-expert): update pages loading/error states
12. Task(qa-tester): test offline fallback + cache
13. bash: npm run build && npm run lint
```

### Phase C — Admin Panel
```
1. skill: shadcn
2. bash: npx shadcn@latest init
3. bash: npx shadcn@latest add button input table dialog form dropdown-menu select tabs toast badge card separator sheet command
4. bash: npx shadcn@latest add https://tweakcn.com/r/themes/mono.json
5. Write: src/admin/admin.css (tweakcn mono, scoped [data-area="admin"])
6. skill: ui-ux-pro-max
7. skill: minimalist-ui
8. skill: supabase
9. skill: zod-validation-expert
10. Task(deepseek-coder): src/admin/lib/auth.ts
11. Task(frontend-expert): src/admin/components/AdminLayout.tsx
12. Task(frontend-expert): src/admin/pages/Login.tsx
13. Task(frontend-expert): src/admin/pages/Dashboard.tsx
14. Task(frontend-expert): src/admin/pages/Products/List.tsx + Form.tsx
15. Task(frontend-expert): src/admin/pages/Projects/* + Services/* + Testimonials/*
16. Task(frontend-expert): src/admin/pages/Inquiries/Inbox.tsx
17. Task(frontend-expert): src/admin/pages/Settings.tsx
18. Task(frontend-expert): src/admin/pages/Users.tsx
19. Task(deepseek-coder): image upload + 3D config editor
20. Task(deepseek-coder): RBAC guard + focus trap
21. Task(qa-tester): test CRUD + RBAC
22. bash: npm run build && npm run lint
```

### Phase D — 3D Viewer
```
1. skill: threejs-webgl
2. skill: supabase
3. skill: devops-deploy
4. Task(deepseek-coder): modifikasi 3dproductvisualization (env Supabase, fetch config)
5. Task(deepseek-coder): postMessage communication
6. bash: cd D:\playgrounds\3d-product-catalog\3dproductvisualization && npm run build
7. Task(build): deploy ke VPS subdomain
8. Task(deepseek-coder): teknomed-web route /catalog/:slug/3d
9. Task(frontend-expert): Product3DViewer component (iframe embed)
10. Task(qa-tester): test iframe + 3D + close
```

### Phase E — Inquiry System
```
1. skill: zod-validation-expert
2. skill: supabase
3. skill: fixing-accessibility
4. Task(frontend-expert): Contact form + zod validation
5. Task(deepseek-coder): submit to Supabase + honeypot
6. bash: supabase functions new inquiry-notification
7. Task(deepseek-coder): Edge Function (Resend email)
8. bash: supabase secrets set RESEND_API_KEY=xxx
9. bash: supabase functions deploy inquiry-notification
10. Task(frontend-expert): admin inbox + drawer
11. Task(deepseek-coder): status update
12. Task(qa-tester): test end-to-end
```

### Phase F — PDF Generator
```
1. skill: api-design-principles
2. skill: supabase
3. skill: devops-deploy
4. Write: pdf-service/index.ts (Hono server)
5. bash: cd pdf-service && npm install
6. Task(deepseek-coder): JWT verify + fetch Supabase
7. Task(deepseek-coder): render Astro template + Puppeteer
8. Task(deepseek-coder): upload to Storage
9. Task(frontend-expert): admin UI generate button
10. Task(qa-tester): test generate < 60s
```

### Phase G — Polish + Deploy
```
1. skill: devops-deploy
2. skill: cloud-architect
3. skill: deployment-procedures
4. bash: ssh root@vps "apt update && apt install -y caddy nodejs npm"
5. Write: /etc/caddy/Caddyfile (3 domain)
6. bash: npm run build (teknomed-web)
7. bash: scp -r dist/* root@vps:/var/www/teknomed-web/
8. bash: cd 3dproductvisualization && npm run build && scp -r dist/* root@vps:/var/www/3d-viewer/
9. bash: scp -r pdf-service/* root@vps:/opt/pdf-service/
10. bash: ssh root@vps "systemctl enable pdf-service && systemctl start pdf-service"
11. bash: ssh root@vps "systemctl reload caddy"
12. skill: seo
13. Task(deepseek-coder): sitemap.xml + JSON-LD + robots.txt
14. Task(frontend-expert): foto proyek asli
15. Task(qa-tester): Lighthouse audit
16. skill: documentation
17. Task(office-operator): user guide admin (DOCX)
18. Task(qa-tester): smoke test production
```

## 6. Recommended Skill Load Order (per sesi)

### Sesi 1: Phase A (Supabase)
```
skill: supabase
skill: database-design
skill: auth-implementation-patterns
```

### Sesi 2: Phase B (Web Integration)
```
skill: supabase
skill: typescript-pro
skill: ui-skills
skill: baseline-ui
```

### Sesi 3-4: Phase C (Admin Panel)
```
skill: shadcn
skill: ui-ux-pro-max
skill: minimalist-ui
skill: design-taste-frontend
skill: supabase
skill: zod-validation-expert
skill: fixing-accessibility
skill: typescript-pro
```

### Sesi 5: Phase D (3D Viewer)
```
skill: threejs-webgl
skill: threejs-loaders
skill: supabase
skill: devops-deploy
```

### Sesi 6: Phase E (Inquiry)
```
skill: zod-validation-expert
skill: supabase
skill: ui-styling
skill: fixing-accessibility
```

### Sesi 7: Phase F (PDF)
```
skill: api-design-principles
skill: supabase
skill: devops-deploy
```

### Sesi 8: Phase G (Deploy)
```
skill: devops-deploy
skill: cloud-architect
skill: deployment-procedures
skill: seo
skill: web-performance-optimization
skill: documentation
```

## 7. Quality Gates (per phase)

Setiap phase selesai hanya jika:
- [ ] `npx tsc --noEmit` 0 error
- [ ] `npx eslint src/` 0 error
- [ ] `npm run build` sukses
- [ ] Smoke test (browser-operator) 0 error runtime
- [ ] Commit + push (ataau commit lokal)
- [ ] Update docs/06-ROADMAP.md checklist

## 8. Fallback Skill (jika utama tidak available)

| Skill utama | Fallback |
|-------------|----------|
| `shadcn` | `ui-styling` + manual install |
| `supabase` | `database-design` + raw SQL |
| `frontend-expert` (agent) | `deepseek-coder` (agent) |
| `db-admin` (agent) | `deepseek-coder` + manual SQL |
| `qa-tester` (agent) | `browser-operator` + manual test |
| `office-operator` (agent) | `docx` skill + manual |
