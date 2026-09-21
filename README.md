# Career Finder — Job Posting Discovery Agent

A personalised career discovery system built for **Bella Daniel-Hunsicker** (MSc Gender Studies, LSE 2026). Live at [careerdiscoverysystem.netlify.app](https://careerdiscoverysystem.netlify.app).

Built by Chris Daniel using Claude (Anthropic) as the intelligence layer.

---

## What It Does

A live job posting discovery agent that scans target organisations and broader job markets for Bella's specific profile — LGBTQ+ rights, immigrant rights, reproductive rights, and digital rights advocacy. Results are filtered, scored for relevance, and saved across devices via Supabase. A feedback loop learns from saved roles and adapts future scans automatically.

---

## Features

- **Org Scan** — live web search across 16 named target organisations, returning current openings scored High / Medium / Low for Bella's profile
- **Broader Search** — 8 market-wide searches across Idealist, LinkedIn, Charity Village, and sector-specific job boards
- **Saved Roles** — persistent cross-device storage via Supabase; star roles from any scan to save them
- **Add Posting** — paste any job posting URL; the system fetches and decomposes it into a structured saved role
- **Insights** — live dashboard showing city focus, category distribution, relevance breakdown, top orgs, and active learning signals
- **Feedback Loop** — every starred or submitted role fires a signal that adapts subsequent scan prompts and relevance scoring
- **Email to Bella** — one-click Gmail compose pre-filled with role details, sent to bella@danielhunsicker.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Hosting | Netlify |
| Database | Supabase (PostgreSQL + RLS) |
| AI | Anthropic Claude Sonnet 4.6 with web search tool |
| API proxy | Netlify Functions (serverless) |
| Deploy | GitHub → Netlify CI/CD via custom deploy.py script |

---

## Database Schema

```sql
-- Saved job roles
saved_roles (id, title, org, org_name, location, type, relevance, deadline,
             why_fit, direct_url, linkedin_url, idealist_url, source, saved_at)

-- Scan results cache
scan_results (id, scan_type, result jsonb, scanned_at)

-- Feedback signals from saved/submitted roles
feedback_signals (id, role_id, org, category, city, relevance, source, created_at)

-- Orgs discovered via broader search or user submissions
learned_orgs (id, name, city, category, source_role_id, created_at)
```

---

## Deployment

Uses a custom Python deploy script that pushes changed files to GitHub, triggering a Netlify auto-deploy.

```bash
python3 /Users/chrisdaniel/Documents/AutoDeploy/deploy_career_finder.py \
  /Users/chrisdaniel/Downloads/career-finder/career-finder-deploy-vX.zip
```

Environment variable required in Netlify:
```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Version History

| Version | Date | Changes |
|---|---|---|
| v1 | Sep 2026 | Initial deploy — org scan, broader search, saved roles, localStorage |
| v2 | Sep 2026 | Fix: JSON extraction robustness, scan results persist on empty |
| v3 | Sep 2026 | Fix: template literal syntax errors resolved |
| v4 | Sep 2026 | City filters, global stats header, scan-all on both panels, simplified row layout, condensed hints, clickable role titles, BucketLab-style header/footer |
| v5 | Sep 2026 | Supabase backend replacing localStorage — cross-device persistence for saved roles and scan results |
| v6 | Sep 2026 | Feedback loop (signals → adaptive scan prompts), Add Posting panel (URL decomposition), Insights tab (city/category/relevance analytics), learned orgs tracking, GitHub README |

---

## Part of the CF 1.x Career Discovery System

This app is Agent 1.3b in a larger multi-agent career discovery pipeline:

| Agent | Description |
|---|---|
| 1.0 | Market Trend Agent — macro signals and sector intelligence |
| 1.1 | SD-Discovery Agent — 29 role category universe |
| 1.2 | SD-Matching Agent — scoring and candidate review interface |
| 1.3 | SD-Job Search Targeting Agent — targeting report and alignment review |
| **1.3b** | **SD-Open Role Discovery Agent — this app** |
| 1.4 | SD-Application Materials Agent — CV, cover letters, LinkedIn framework |
| 1.5 | Interview Preparation Agent *(planned)* |
| 1.6 | Negotiation & Offer Evaluation Agent *(planned)* |
