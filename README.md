<div align="center">
  <h1>ThesiFlow</h1>
  <p><strong>Evidence-driven academic project lifecycle management for universities and research institutions.</strong></p>

  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs" alt="Next.js 16">
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express 5">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma 7">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker Compose">
</div>

## Overview

ThesiFlow centralizes academic projects that are normally fragmented across spreadsheets, email, chat and file drives. It supports the full lifecycle of theses, capstones, course projects and research campaigns—from campaign configuration and topic proposals to registration, supervision, document submission, review, evaluation and amendment.

The platform uses version-pinned workflows and immutable evidence so every decision can be traced to the correct actor, state, document version and rubric. A multi-tenant architecture, scoped RBAC and resource-level authorization isolate institutional data while allowing each organization to configure its own academic structure and policies.

## Academic Workflow

```mermaid
flowchart TD
    A[Publish campaign] --> B[Propose and approve topic]
    B --> C[Register team and supervisor]
    C --> D[Create project and milestones]
    D --> E[Upload document versions]
    E --> F[Submit a pinned version]
    F --> G[Review with a pinned rubric]
    G --> H[Finalize evaluation]
    H --> I[Appeal or append amendment]
```

## Core Capabilities

| Module | Main capabilities | Technical controls |
| --- | --- | --- |
| Campaigns | Configure thesis, capstone, course-project and research workflows through reusable templates | Published template versions are immutable; campaigns pin an exact policy version |
| Topics | Submit proposals, request changes, approve topics and publish them into a campaign | State-machine guards, scoped approval and idempotent transitions |
| Registration | Form teams, register for topics and assign supervisors | Unique constraints and concurrency control prevent duplicate projects |
| Progress | Manage milestones, deadlines, supervision assignments and progress updates | Project-scoped authorization and evidence history |
| Documents | Upload private files, create immutable versions and submit a selected version | Presigned URLs, checksum/MIME/size validation and private MinIO/S3 storage |
| Feedback | Attach structured feedback to the correct project, submission or document version | Version-pinned targets prevent feedback from drifting to newer files |
| Review | Assign reviewers, publish rubric versions and record criterion-level scores | Assignment pins the reviewer, submission, rubric version and review round |
| Evaluation | Finalize results, process appeals and record official corrections | Final results are immutable; corrections use append-only amendments |
| Notifications | Notify users about actions, deadlines and workflow changes | Transactional outbox and idempotent worker dispatch after commit |
| Audit | Reconstruct critical decisions and state transitions | Append-only actor, reason, old/new state and correlation evidence |

## Roles and Access

| Role | Responsibility |
| --- | --- |
| Platform Admin | Manages platform-level organization onboarding and configuration |
| Organization Admin | Manages memberships, roles and academic structures within a tenant |
| Coordinator | Configures campaigns, topics, assignments, milestones and final decisions |
| Student | Registers projects, updates progress, uploads documents and submits versions |
| Supervisor | Supervises assigned projects and provides version-specific feedback |
| Reviewer | Reviews only assigned submissions using the pinned rubric version |
| Auditor | Inspects authorized evidence and operational timelines without changing academic state |

## System Architecture

```mermaid
flowchart TD
    U[Web browser] --> W[Next.js web application]
    W --> A[Express modular monolith API]
    A --> P[(PostgreSQL)]
    A --> S[Private MinIO or S3 storage]
    A --> O[Transactional outbox]
    O --> K[Background worker]
    K --> N[Notifications and scheduled jobs]
```

## Engineering Decisions

| Concern | ThesiFlow approach |
| --- | --- |
| Multi-tenancy | Tenant context comes from an authenticated membership; client-provided tenant IDs are never trusted |
| Authorization | Permission checks combine tenant, role, scope, resource relationship and workflow state; default is deny |
| Workflow integrity | State machines define valid transitions, actors, guards, transactions and side effects |
| Version integrity | Campaigns, submissions, reviews and evaluations pin immutable template, document and rubric versions |
| Retry safety | Idempotency keys, request hashes, unique constraints and locking prevent duplicate side effects |
| Async reliability | Business state and outbox intent are committed in one PostgreSQL transaction, then dispatched by a worker |
| File security | Clients upload directly with short-lived presigned URLs; completion revalidates checksum, MIME type, size and expiry |
| Auditability | Audit logs preserve decision evidence; outbox events handle delivery and are not used as audit records |

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, TanStack React Query, Zod |
| Backend | Node.js 22, Express 5, TypeScript, Zod, JWT, Argon2 |
| Database | PostgreSQL 16, Prisma 7 |
| Storage | MinIO/S3-compatible private object storage, presigned upload/download |
| Worker | TypeScript worker, PostgreSQL transactional outbox |
| Testing | Vitest, Supertest, Playwright, API/integration/E2E testing |
| DevOps | npm workspaces, Docker Compose, GitHub Actions, Nginx |

> Redis and BullMQ are intentionally deferred. They should be introduced only when multiple worker instances or measured database-polling latency require independent queue scaling.

<details>
<summary><strong>Repository structure</strong></summary>

```text
ThesiFlow/
├── apps/
│   ├── web/       # Next.js frontend
│   ├── api/       # Express modular monolith and Prisma
│   └── worker/    # Outbox and background processing
├── docker-compose.yml
├── .env.example
└── package.json   # npm workspaces and quality commands
```

</details>

<details>
<summary><strong>Run with Docker Compose</strong></summary>

### Requirements

- Node.js 22 or later and npm 10 or later
- Docker and Docker Compose

### Start

```bash
git clone https://github.com/MinLD/ThesiFlow.git
cd ThesiFlow
cp .env.example .env
docker compose up -d --build
```

| Service | Address |
| --- | --- |
| Web application | `http://localhost:3000` |
| API | `http://localhost:4000` |
| API health | `http://localhost:4000/health` |
| API readiness | `http://localhost:4000/ready` |
| PostgreSQL | `localhost:5433` |

</details>

<details>
<summary><strong>Local development and quality checks</strong></summary>

```bash
npm install
npm run dev
```

```bash
npm run db:validate
npm run db:migrate
npm run db:seed
npm run lint
npm run typecheck
npm run test
npm run build
```

</details>

<details>
<summary><strong>Required environment variables</strong></summary>

```dotenv
NODE_ENV=development
DATABASE_URL=postgresql://thesiflow:change-me@localhost:5433/thesiflow?schema=public
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

POSTGRES_USER=thesiflow
POSTGRES_PASSWORD=change-me
POSTGRES_DB=thesiflow
POSTGRES_PORT=5433

ACCESS_TOKEN_SECRET=replace-with-at-least-32-characters
REFRESH_TOKEN_SECRET=replace-with-at-least-32-characters
ADMIN_EMAIL=admin@thesiflow.local
ADMIN_PASSWORD=change-me
```

Never commit production credentials, tokens, presigned URLs or private document locations.

</details>

## Author

**Do Dang Minh Luan** — Full-stack Developer  
[GitHub profile](https://github.com/MinLD) · [Project repository](https://github.com/MinLD/ThesiFlow)

```bash
cp .env.example .env
```
2. Edit `.env` if needed, especially `POSTGRES_PASSWORD`, `API_PORT`, `WEB_PORT`.
3. Start:
```bash
docker compose up -d --build
```

## Local dev

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## DB

- Host: `localhost`
- Port: `5433`
- DB: `thesiflow`
- User: `thesiflow`
- Password: from `.env`

## Health

- API: `http://localhost:4000/health`
- Ready: `http://localhost:4000/ready`
- Meta: `http://localhost:4000/api/v1/meta`
- Web: `http://localhost:3000`

## Worker

- `apps/worker` polls `outbox_events` and marks claimed events published.
- Current worker is Phase 1 plumbing only; real notification adapters come later.
