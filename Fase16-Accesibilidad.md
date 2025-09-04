# Fase 16 — Accesibilidad (a11y) y rendimiento

Objetivo: garantizar AA mínimo (WCAG) y mantener interacciones a 60fps.

## Accesibilidad
- Focus visible en todos los controles (usar clases Tailwind o `:focus-visible`).
- Roles y labels:
  - Botones con `aria-label` cuando no hay texto visible.
  - Inputs con `aria-label` o `<label htmlFor>`.
  - Regiones: `<main>`, `<nav>`, `<header>`, `<footer>`.
- Navegación por teclado completa (no atrapar focus).
- Contraste: usa Tailwind `dark:` y paletas con contraste adecuado.
- KaTeX: proporciona texto alternativo si renderizas fórmulas complejas.

Lint y pruebas:
- Añadir `eslint-plugin-jsx-a11y` y habilitar reglas básicas.
- Testing: usa RTL para verificar roles/labels (`getByRole`, `getByLabelText`).

## Rendimiento
- Minimizar renders:
  - Memorizar componentes puros con `React.memo`.
  - `useCallback`/`useMemo` en props que cambian frecuentemente.
- Carga diferida:
  - `next/dynamic` para módulos pesados (KaTeX, charts).
  - Split por rutas (App Router lo hace por defecto).
- Imágenes: `next/image` con tamaños y `priority` cuando necesario.
- Evitar trabajo pesado en el hilo principal; usa Web Workers si procede.

Medición:
- Lighthouse (PWA/Perf/Best Practices/SEO ≥ 90 idealmente).
- React Profiler para detectar renders excesivos.
- `performance.mark/measure` para tramos críticos del loop de práctica.

## Ejemplos
Carga diferida de Chart.js:
```tsx
import dynamic from 'next/dynamic'
const AvgTimeLine = dynamic(() => import('@components/charts/AvgTimeLine'), { ssr: false, loading: () => <div>Cargando…</div> })
```

Memo de componente:
```tsx
import { memo } from 'react'
export const ProgressInfo = memo(ProgressInfoBase)
```

## Verificación
- Sin errores a11y en el panel del navegador y ESLint.
- Perf estable: barra de tiempo fluida, interacciones sin jank.

## Próximo
- Fase 17: Pruebas (unitarias y e2e).
