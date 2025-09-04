# Fase 2 — Dependencias clave del dominio

Instala las bibliotecas base que usaremos a lo largo del proyecto. Usa pnpm (recomendado); si usas npm, reemplaza `pnpm` por `npm`.

## Paquetes de runtime
- Estado: `zustand` + `zustand/middleware`
- YAML: `yaml`
- Validación: `zod`
- Matemáticas/KaTeX: `katex`, `react-katex`
- i18n: `next-intl`
- Gráficas: `chart.js`, `react-chartjs-2`
- PWA: `next-pwa`
- Almacenamiento: `idb-keyval`
- Iconos: `lucide-react`

```bash
pnpm add zustand yaml zod katex react-katex next-intl chart.js react-chartjs-2 next-pwa idb-keyval lucide-react
```

## Paquetes de desarrollo (tipos y testing básico)
- Tipos Node (si no vienen del scaffold): `@types/node`
- Testing de UI: `@testing-library/react`, `@testing-library/jest-dom`

```bash
pnpm add -D @types/node @testing-library/react @testing-library/jest-dom
```

Notas:
- `create-next-app` ya incluye la mayoría de tipos base (`@types/react`, `@types/react-dom`).
- La configuración de testing (Vitest/Playwright) se realizará en la Fase 17.

## Verificación rápida
- Listar paquetes instalados:
```bash
pnpm ls zustand yaml zod katex react-katex next-intl chart.js react-chartjs-2 next-pwa idb-keyval lucide-react
```
- El comando no debe mostrar problemas de resolución.

## Siguientes pasos
- Fase 3: Definir alias y estructura de carpetas (tsconfig paths) y preparar `src/modules` y `src/components`.
