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

## Docker Compose

Run both apps as production containers:

```bash
docker compose up --build    # web :3000, api :8080
docker compose down
```

- `api` builds from `apps/api/Dockerfile`.
- `web` builds from `apps/web/Dockerfile` using the repo root as context
  (`turbo prune` + Next.js `standalone` output). Its `/api/*` proxy points at
  `http://api:8080` (the compose service name), set via the `API_URL` build arg.

## Deployment

Both apps deploy to Vercel as two projects connected to this repo:

| Project           | Root Directory | Framework | Build / install command                                            | URL                                 |
| ----------------- | -------------- | --------- | ------------------------------------------------------------------ | ----------------------------------- |
| `next-go-gin`     | `apps/web`     | Next.js   | default (`turbo run build`)                                        | https://next-go-gin.vercel.app      |
| `next-go-gin-api` | `apps/api`     | Go        | `go build -trimpath -ldflags="-s -w" -o bin/api .` / `go mod download` | https://next-go-gin-api.vercel.app |

**Production only.** Both projects deploy to production from `main` and nothing
else:

- Production branch: `main` on both projects.
- Preview deployments: disabled on both projects, so pushes to other branches
  and pull requests do not deploy.
- Environment variables: production only. Use `localhost` defaults for local
  development (see [Configuration](#configuration)).

**Other settings:**

- The web project has `API_URL=https://next-go-gin-api.vercel.app` (production).
  It is read at build time, so redeploy web after changing it.
- The API project sets explicit Go commands because Vercel otherwise detects
  Turborepo and switches the build to `turbo run build`.
- Both projects skip builds when a push doesn't affect them.

To ship, merge or push to `main`. To redeploy without a new commit, use
**Redeploy** on the latest production deployment in the Vercel dashboard.

**api** also runs on any container host (Fly.io, Railway, Render, ECS, …) using
`apps/api/Dockerfile`:

```bash
docker build -t next-go-gin-api apps/api
docker run --rm -p 8080:8080 next-go-gin-api
curl localhost:8080/api/health
```

The image is a static binary on distroless (~16 MB), runs as non-root, and uses
`GIN_MODE=release`. It honours `PORT`, which most hosts set for you.

## Configuration

| Variable  | App      | Default                 | Purpose                           |
| --------- | -------- | ----------------------- | --------------------------------- |
| `PORT`    | apps/api | `8080`                  | API listen port                   |
| `API_URL` | apps/web | `http://localhost:8080` | Backend target for `/api/*` proxy |
