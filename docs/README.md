# Teknomed Integrated System — Documentation

> Source of truth untuk seluruh sistem terintegrasi PT Teknomed Indo Timur:
> website publik + katalog digital + 3D viewer + inquiry system + admin panel.
> Sesuai proposal KP I Kadek Restu Nugraha (NIM 160422146).

## Daftar Dokumen

| # | Dokumen | Deskripsi | Audiens |
|---|---|---|---|
| 01 | [BRD](./01-BRD.md) | Business Requirements Document — konteks bisnis, masalah, tujuan, stakeholder, KPI | Sponsor, dosen, owner |
| 02 | [PRD](./02-PRD.md) | Product Requirements Document — vision, personas, user stories, fitur MoSCoW | PM, designer, dev |
| 03 | [SRS](./03-SRS.md) | Software Requirements Specification — functional + non-functional requirements detail | Developer, QA |
| 04 | [SAD](./04-SAD.md) | Software Architecture Document — diagram, tech stack, ADR, data flow, security | Architect, dev lead |
| 05 | [DATA_MODEL](./05-DATA_MODEL.md) | Supabase schema, RLS policies, storage buckets, relationships | Backend, DBA |
| 06 | [ROADMAP](./06-ROADMAP.md) | Phase-by-phase execution plan, effort, dependency, deliverable | PM, dev |
| 07 | [SKILL_TOOLS_MAP](./07-SKILL_TOOLS_MAP.md) | Mapping skill, tools, agent, MCP per phase | AI agent operator |
| 08 | [DEPLOYMENT](./08-DEPLOYMENT.md) | VPS setup, Caddy, CI/CD, backup, monitoring | DevOps |
| 09 | [PROJECT_ANALYSIS](./09-PROJECT_ANALYSIS.md) | Analisis mendalam catalog-new + 3dproductvisualization | Developer, integrator |
| 10 | [LAPORAN_KP_PLAN](./10-LAPORAN_KP_PLAN.md) | Struktur laporan KP UBAYA (7 bab, format, aturan bahasa) | Mahasiswa, dosen |
| 11 | [DOCKER_MIGRATION](./11-DOCKER_MIGRATION.md) | Docker compose stack + VPS migration strategy | DevOps |
| 12 | [ENV_CREDENTIALS](./12-ENV_CREDENTIALS.md) | Supabase, VPS, domain, Resend credentials + action items | DevOps, developer |

## Cara Membaca

1. **Sponsor/owner**: baca 01-BRD dulu, lalu 02-PRD section vision + scope
2. **Developer**: baca 03-SRS + 04-SAD + 05-DATA_MODEL sebelum ngoding
3. **PM**: baca 02-PRD + 06-ROADMAP untuk planning sprint
4. **AI agent operator**: baca 07-SKILL_TOOLS_MAP untuk tahu skill/tools mana per phase
5. **DevOps**: baca 08-DEPLOYMENT untuk setup VPS

## Hierarki Dokumen

```
BRD (mengapa)  →  PRD (apa)  →  SRS (spesifikasi detail)
                                    ↓
                                SAD (arsitektur)  →  DATA_MODEL (skema)
                                    ↓
                                ROADMAP (kapan)  →  SKILL_TOOLS_MAP (bagaimana pakai AI)
                                    ↓
                                DEPLOYMENT (operasional)
```

## Status

- **Dibuat**: 2026-06-18
- **Versi**: 1.0.0
- **Author**: OpenCode agent (GLM-5.2) berdasarkan proposal KP + analisis 3 project existing
- **Review**: pending oleh owner (I Kadek Restu Nugraha)

## Konvensi

- Prioritas pakai **MoSCoW**: Must / Should / Could / Won't
- Status pakai **RFC 2119**: MUST / SHOULD / MAY
- Effort pakai **story point** (1 SP ≈ 4 jam kerja fokus)
- Diagram pakai **Mermaid** (render di GitHub/VS Code)
