# Fase 6 — PWA y soporte offline

Objetivo: convertir la app en PWA instalable con caché básico de assets y runtime caching selectivo.

## 1) Dependencia
- `next-pwa` (instalada en Fase 2)

## 2) Configuración en `next.config.js`/`next.config.mjs`
Ejemplo con `appDir` activo y deshabilitado en desarrollo:

```js
// next.config.mjs
import withPWA from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
  // experimental: { appDir: true }, // en Next 14+ no es necesario
})
```

Si usas CommonJS:
```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})
module.exports = withPWA({})
```

## 3) `manifest.webmanifest`
Crea en `public/manifest.webmanifest`:
```json
{
  "name": "MathRaining",
  "short_name": "MR",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

## 4) Iconos
Coloca imágenes en `public/icons/icon-192.png` y `public/icons/icon-512.png`.

## 5) Inclusión del manifest en el layout
En `<head>` de `app/layout.tsx`:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body> {children} </body>
    </html>
  )
}
```

## 6) Verificación
- `pnpm build && pnpm start` y abre en navegador.
- Lighthouse PWA: App es instalable, service worker registrado, offline básico funcionando.

## 7) Notas
- Evita cachear rutas que dependan de estado dinámico sensible.
- Para cachés a medida, personaliza `runtimeCaching` (imágenes, fonts, API pública).

## 8) Siguiente fase
- Fase 7: Persistencia local y perfiles (drivers `fs-access`, `idb`, `memory`).
