# next-go-gin

Turborepo monorepo: Next.js frontend + Go (Gin) API.

```
.
├── apps/
│   ├── api/    # Go + Gin API (default :8080)
│   └── web/    # Next.js App Router + TypeScript + Tailwind (default :3000)
├── packages/   # shared JS/TS packages, add as needed
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

- [Turborepo](https://turborepo.dev) runs tasks across apps, with caching.
- pnpm workspace manages JS apps/packages (single root lockfile).
- `apps/api` is a standalone Go module (`github.com/kzamanbd/next-go-gin/apps/api`).
  Its `package.json` only wraps `go` commands so Turborepo can run it next to the web app.

## Requirements

- Go 1.27+
- Node 20+ and pnpm

## Getting started

```bash
pnpm install
pnpm dev        # turbo: API (:8080) + web (:3000) together
```

Run one app:

```bash
pnpm dev:api
pnpm dev:web
```

Open http://localhost:3000. The home page calls `/api/health`, which Next.js
rewrites to the Gin server (see `apps/web/next.config.ts`), so no CORS setup is
needed in development.

## Tasks

| Command            | api (Go)                  | web (Next.js)                  |
| ------------------ | ------------------------- | ------------------------------ |
| `pnpm build`       | `go build -o bin/api .`   | `next build`                   |
| `pnpm start`       | `./bin/api`               | `next start`                   |
| `pnpm lint`        | `go vet ./...`            | `eslint`                       |
| `pnpm check-types` | `go build -o /dev/null ./...` | `next typegen && tsc --noEmit` |
| `pnpm test`        | `go test ./...`           | —                              |

Add `--filter=@next-go-gin/<app>` to scope any task to one app.

## Configuration

| Variable  | App      | Default                 | Purpose                           |
| --------- | -------- | ----------------------- | --------------------------------- |
| `PORT`    | apps/api | `8080`                  | API listen port                   |
| `API_URL` | apps/web | `http://localhost:8080` | Backend target for `/api/*` proxy |
