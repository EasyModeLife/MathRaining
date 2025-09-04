# Fase 19 — CI/CD (GitHub Actions)

Objetivo: validar automáticamente lint, typecheck, pruebas y build en cada PR y en `main`.

## Workflow básico
`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Enable Corepack
        run: corepack enable
      - name: Install deps
        run: pnpm install --frozen-lockfile
      - name: Lint
        run: pnpm lint
      - name: Typecheck
        run: pnpm typecheck
      - name: Test
        run: pnpm test
      - name: Build
        run: pnpm build
```

## Playwright en CI (opcional)
Job extra con servicio web levantado o usando `next start`:
```yaml
  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm build
      - run: pnpm start &
      - run: pnpm e2e
```

## Verificación
- Abrir un PR y revisar checks.
- Forzar un lint error y confirmar que falla.
