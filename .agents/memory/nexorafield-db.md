---
name: NexoraField DB Architecture
description: PostgreSQL + Drizzle ORM setup decisions, seed guard logic, and API hydration pattern.
---

## DB Layer Files
- `db/schema.ts` — Drizzle table definitions (users, companies, technicians, tickets, financial_transactions, ai_audit_logs)
- `db/index.ts` — Pool connection + `initializeSchema()` (runs CREATE TABLE IF NOT EXISTS on startup)
- `db/seed.ts` — `seedDatabase()` seeds initial data; guards by checking `tickets` table (not `users`) because users seeded successfully on first partial run before tickets failed

## Auth
- 4 seeded users with bcrypt SALT_ROUNDS=12: admin@nexorafield.com/admin123, operacoes@solarsol.com.br/solarsol123, alexandre.tech@gmail.com/tech123, mariana.fibra@outlook.com/comercial123
- Login via `POST /api/auth/login` uses `bcrypt.compare` against DB — no hardcoded credentials

## REST Endpoints Added
- GET/POST/PUT/DELETE `/api/companies`
- GET/POST/PUT/DELETE `/api/technicians`
- GET/POST/PUT + PATCH `/api/tickets/:id/status`
- GET/POST `/api/transactions`
- GET/POST `/api/audit-logs`
- POST `/api/auth/register`

## Frontend Hydration (App.tsx)
- On mount: parallel fetch all 5 entity endpoints → hydrate React state (replaces localStorage-only)
- Mutations: optimistic local update + fire-and-forget API call with `console.warn` on failure
- Map helpers: `mapTechRow`, `mapTicketRow`, `mapTxRow`, `mapLogRow` handle snake_case → camelCase

**Why:** Replit's DB skill provisions PostgreSQL with env vars (DATABASE_URL etc.) automatically. `drizzle-orm/node-postgres` + `pg` Pool are the correct imports (not `drizzle-orm/postgres-js`).
