# ThesiFlow

## Run

1. Copy env:
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
- Web: `http://localhost:3000`
