# Fase 20 — Deploy (Vercel y alternativa self-host)

Objetivo: desplegar la aplicación en producción.

## Opción A: Vercel (recomendada)
1. Conecta el repo a Vercel.
2. Variables de entorno (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_APP_NAME`
   - `NEXT_PUBLIC_DEFAULT_LANG`
   - `NEXT_PUBLIC_PWA`
   - `STORAGE_BACKEND` (usual: `auto`)
   - `GITHUB_URL`, `DONATION_URL`
3. Build & Output: usa los defaults de Next.js (`next build`).
4. Una vez desplegado, verifica PWA (instalable) y rutas.

## Opción B: Self-host (Node)
Configura build `standalone` en `next.config.js`:
```js
module.exports = { output: 'standalone' }
```

Dockerfile ejemplo:
```Dockerfile
# Etapa build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Etapa runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

Despliegue:
- Configura reverse proxy (Nginx) si necesitas TLS/domino.
- Variables de entorno en el contenedor (ver arriba).

## Verificación
- Health check en `/` (200), PWA instalable, funcionalidad offline básica.
