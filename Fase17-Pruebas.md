# Fase 17 — Pruebas (unitarias, integración y e2e)

Objetivo: configurar pruebas unitarias/integración con Vitest + RTL y e2e con Playwright.

## Dependencias
Añade (si no están):

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/testing-library__jest-dom @playwright/test
```

## Configuración Vitest
`vitest.config.ts` (raíz):
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setupTests.ts'],
    globals: true,
    css: true,
  },
})
```

`tests/setupTests.ts`:
```ts
import '@testing-library/jest-dom'
```

Notas:
- Vitest no ejecuta Server Components de Next; enfócate en lógica (stores, utils) y Client Components.
- Para módulos que importan `next/*`, mockéalos cuando sea necesario.

## Ejemplo: test de store (Fase 9)
`tests/practice.store.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { usePracticeStore } from '@modules/practice/store'

function getState() { return usePracticeStore.getState() }

describe('practice store', () => {
  it('start → crea sesión', () => {
    const problems = [{ question: '1+1', answer: 2, meta: { category: 'arithmetic' } }]
    getState().start(problems as any, { category: 'arithmetic' })
    const s = getState().session!
    expect(s.running).toBe(true)
    expect(s.attempts.length).toBe(1)
  })
})
```

## Ejemplo: test de componente
`tests/components/ProgressInfo.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProgressInfo } from '@components/ProgressInfo'

describe('ProgressInfo', () => {
  it('muestra índice y racha', () => {
    render(<ProgressInfo remainingMs={500} totalMs={1000} index={1} total={3} streak={2} />)
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByText(/Racha: 2/)).toBeInTheDocument()
  })
})
```

## Scripts en package.json
- `test`: `vitest run`
- `test:watch`: `vitest`
- `coverage`: `vitest run --coverage`

## Playwright (E2E)
Instala navegadores:
```bash
pnpm exec playwright install --with-deps
```

`playwright.config.ts` básico:
```ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

`e2e/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test'

test('home loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/MathRaining/i)
})
```

Scripts:
- `e2e`: `playwright test`
- `e2e:headed`: `playwright test --headed`

## Verificación
- Ejecuta `pnpm test` y `pnpm e2e` (con la app corriendo en `dev` o `start`).
- Asegura cobertura mínima inicial (40%) y sube gradualmente.
