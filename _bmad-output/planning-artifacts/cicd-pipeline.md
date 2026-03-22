# CI/CD Pipeline Design - task-tracker

**Role:** BMAD DevOps Engineer  
**Date:** 22 March 2026  
**Platform:** GitHub Actions

## Objective

Design a simple, production-friendly CI/CD pipeline for a Dockerised task tracker with:
- Node.js backend
- React/Vite frontend
- SQLite persistence
- GitHub Actions automation

The pipeline should validate code quality on every change, produce deployable container images, and prepare the project for safe deployment without overcomplicating a low-complexity application.

## Current Project Constraints

- Backend has Jest tests
- Frontend has ESLint and TypeScript build
- Dockerfiles exist for backend and frontend
- App is containerised with Docker Compose
- SQLite is file-based, so deployment must preserve a writable volume for the database file
- The current app is suitable for single-instance deployment, not multi-replica database sharing

## Delivery Strategy

### CI

Run on:
- Pull requests to `main`
- Pushes to `main`

Goals:
- Install dependencies deterministically with `npm ci`
- Run backend tests
- Run frontend lint
- Run frontend build
- Validate Docker images can build

### CD

Run on:
- Successful push to `main`
- Optional manual `workflow_dispatch`

Goals:
- Build backend and frontend Docker images
- Tag images with immutable and friendly tags
- Push images to GitHub Container Registry
- Publish deploy-ready metadata/artifacts
- Keep deployment separate from build unless a target environment is configured

## Recommended GitHub Actions Workflows

### 1. `ci.yml`

Purpose: fast feedback for code quality and merge safety.

Jobs:

1. `backend-test`
- Checkout repository
- Setup Node.js 24
- Cache npm dependencies
- Run `npm ci` in `task-tracker/backend`
- Run `npm test -- --runInBand`

2. `frontend-lint-build`
- Checkout repository
- Setup Node.js 24
- Cache npm dependencies
- Run `npm ci` in `task-tracker/frontend`
- Run `npm run lint`
- Run `npm run build`

3. `docker-build-smoke`
- Checkout repository
- Build backend Docker image
- Build frontend Docker image
- Optional: run `docker compose config` as a configuration sanity check

Gates:
- All CI jobs must pass before merge to `main`

### 2. `cd.yml`

Purpose: produce deployable images and release-ready outputs.

Jobs:

1. `build-and-push-images`
- Trigger on push to `main` after CI passes
- Checkout repository
- Login to GHCR using `GITHUB_TOKEN`
- Build and push:
  - `ghcr.io/<owner>/task-tracker-backend`
  - `ghcr.io/<owner>/task-tracker-frontend`
- Tag images with:
  - `sha-<short-sha>`
  - `main`
  - semantic version tag on release, if used later

2. `publish-deploy-artifacts`
- Upload:
  - rendered compose/deployment manifest
  - image tag summary
  - release notes or deployment summary

3. `deploy-staging` (optional now, recommended later)
- Manual approval environment
- Pull latest backend/frontend images
- Start containers with persistent SQLite volume mounted

## Pipeline Shape

```text
Pull Request
  -> backend tests
  -> frontend lint
  -> frontend build
  -> docker build smoke
  -> merge gate

Push to main
  -> repeat CI checks
  -> build Docker images
  -> push images to GHCR
  -> mark release as deploy-ready
  -> optional manual deployment
```

## GitHub Actions Design Details

### Recommended Branch Policy

- Protect `main`
- Require PR review
- Require `ci.yml` to pass before merge
- Prevent direct pushes to `main` except for maintainers if needed

### Recommended Caching

- Use `actions/setup-node` npm cache for both frontend and backend
- Use Docker Buildx cache for image builds

### Recommended Secrets

For CI only:
- No custom secrets required if only using GitHub-hosted runners and `GITHUB_TOKEN`

For CD/deploy later:
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PATH`
- Any production environment variables

### Recommended Environments

- `ci`
- `staging`
- `production`

Use GitHub Environments for:
- secret scoping
- manual approvals
- deployment audit trail

## SQLite Deployment Guidance

SQLite changes the deployment model in important ways:

- Only one active writable app instance should own the database file
- The database file must live on a persistent volume
- Do not treat the database as part of the Docker image
- Container replacement must reattach the same volume

Recommended production pattern:
- Backend container with mounted persistent volume for `/app/data`
- Frontend container as stateless
- No separate SQLite container in production

Reason:
- SQLite is an embedded database, so the app process should manage the file directly
- A separate SQLite container adds complexity without real benefit here

## Recommended Deployment Topology

### Staging / Production (Simple)

- `frontend` container
- `backend` container
- persistent host or named volume mounted to backend data directory

Example deployment behavior:
- pull new frontend/backend images
- stop old containers
- start new containers with the same SQLite data volume
- run health checks
- keep previous image tag available for rollback

## Best Practices

### CI Best Practices

- Use `npm ci`, never `npm install`, in automation
- Run backend tests and frontend lint/build in separate jobs for faster diagnostics
- Keep CI deterministic with pinned Node major version
- Fail fast on lint/test/build issues
- Add status checks as required branch protections

### Docker Best Practices

- Build images in CI on every PR and main push
- Push only from trusted branches
- Use immutable image tags based on commit SHA
- Keep `latest` optional; prefer explicit tags in deployment
- Add `.dockerignore` files if missing to reduce build context

### Release Best Practices

- Separate “build deployable artifact” from “deploy to environment”
- Use manual approval for production deployment
- Keep deployment idempotent
- Record deployed image tags in workflow summary
- Support rollback by redeploying a previous SHA tag

### Security Best Practices

- Use `GITHUB_TOKEN` for GHCR where possible
- Minimize long-lived secrets
- Run Dependabot for npm dependencies and GitHub Actions
- Pin third-party GitHub Actions to stable major versions
- Add container vulnerability scanning later using Trivy or Docker Scout

### Operational Best Practices

- Add backend health checks to deployment verification
- Add smoke test step against `/health` after deployment
- Preserve SQLite data outside containers
- Keep logs on stdout/stderr for runner and container visibility
- Add retention policy for old container images

## Recommended Future Enhancements

1. Add frontend tests when available so CI covers more than lint/build
2. Add container vulnerability scanning
3. Add staging deployment environment with approval gates
4. Replace SQLite with PostgreSQL if multi-instance or concurrent write scale becomes necessary
5. Add semantic release/version tagging once release cadence stabilizes

## Proposed Workflow Files

```text
.github/workflows/
├── ci.yml
└── cd.yml
```

## Suggested CI Job Commands

### Backend

```bash
cd task-tracker/backend
npm ci
npm test -- --runInBand
```

### Frontend

```bash
cd task-tracker/frontend
npm ci
npm run lint
npm run build
```

### Docker

```bash
docker build -t task-tracker-backend:ci task-tracker/backend
docker build -t task-tracker-frontend:ci task-tracker/frontend
docker compose -f task-tracker/docker-compose.yml config
```

## Design Decision Summary

- CI should validate code quality and Docker buildability on every PR
- CD should publish deployable images, not force immediate production deployment
- SQLite should remain volume-backed and owned by the backend container
- GHCR is the best default registry for a GitHub-native project
- Manual approval should guard production deploys

## Recommendation

Implement this in two phases:

### Phase 1
- `ci.yml`
- `cd.yml` with GHCR push only

### Phase 2
- staging deployment job
- production deployment job with approvals
- smoke tests and rollback support
