# Fase 18 — Scripts y calidad (ESLint, Prettier, Hooks)

Objetivo: estandarizar scripts, linters y formateo, y añadir hooks pre-commit.

## Dependencias
```bash
pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-jsx-a11y husky lint-staged typescript
```

## ESLint
`.eslintrc.cjs`:
```js
module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:jsx-a11y/recommended', 'prettier'],
  plugins: ['jsx-a11y'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
  },
}
```

## Prettier
`prettier.config.cjs`:
```js
module.exports = { semi: false, singleQuote: true, trailingComma: 'all' }
```

## Scripts package.json
- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `eslint . --ext .ts,.tsx`
- `format`: `prettier --write .`
- `typecheck`: `tsc --noEmit`
- `test`: `vitest run`
- `test:watch`: `vitest`
- `e2e`: `playwright test`

## Hooks (Husky + lint-staged)
Inicializa Husky y añade hook pre-commit:
```bash
pnpm dlx husky init
```

`.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

`package.json` (sección):
```json
{
  "lint-staged": {
    "**/*.{ts,tsx,js,jsx}": ["eslint --fix"],
    "**/*.{ts,tsx,js,jsx,css,md}": ["prettier --write"]
  }
}
```

## Verificación
- Al hacer commit, se formatean y corrigen archivos staged.
- `pnpm lint` y `pnpm typecheck` sin errores.
