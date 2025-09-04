# Backlog de issues — MathRaining

Lista de issues sugeridos (copia/pega para crearlos en GitHub). Incluye título, etiquetas, descripción, tareas, criterios y referencias a las guías por fase.

## Fase 1 — Scaffold Next.js
- Título: Fase 1 — Scaffold base Next.js (TS, ESLint, Tailwind, App Router)
- Etiquetas: [phase:1, area:frontend, type:feature, priority:high]
- Descripción: Crear el proyecto Next.js con App Router y Tailwind, asegurando compilación inicial.
- Tareas:
  - [ ] Crear app: `pnpm create next-app@latest mathraining`
  - [ ] Instalar y build inicial
  - [ ] Verificar `app/`, `tsconfig.json`, `tailwind.config.ts`
- Criterios:
  - [ ] `pnpm dev` sirve `/` sin errores
  - [ ] Tailwind operativo
- Referencias: `Fase1-Scaffold.md`

## Fase 2 — Dependencias
- Etiquetas: [phase:2, area:tooling, type:chore]
- Descripción: Instalar dependencias clave (zustand, yaml, zod, katex, next-intl, charts, next-pwa, idb-keyval, lucide-react).
- Tareas:
  - [ ] Instalar runtime
  - [ ] Instalar dev (tipos/testing)
  - [ ] Verificar resolución de paquetes
- Criterios:
  - [ ] Paquetes instalados sin conflictos
- Referencias: `Fase2-Dependencias.md`

## Fase 3 — Alias y estructura
- Etiquetas: [phase:3, area:frontend, type:chore]
- Descripción: Configurar `tsconfig` paths y preparar carpetas `src/components`, `src/modules`, `src/lib`.
- Tareas:
  - [ ] Añadir `@app`, `@components`, `@modules`, `@lib`
  - [ ] Crear stubs de tipos (Problem, StorageDriver)
- Criterios:
  - [ ] Imports con alias funcionan y dev arranca
- Referencias: `Fase3-Estructura.md`

## Fase 4 — Rutas App Router
- Etiquetas: [phase:4, area:frontend, type:feature]
- Descripción: Crear árbol de rutas stub según Estructura.md.
- Tareas:
  - [ ] `/`, `/categories`, `/about`, `/donations`
  - [ ] `/[category]` y subrutas `games`, `practice`, `configuration`, `profile`
- Criterios:
  - [ ] Páginas stub accesibles en dev
- Referencias: `Fase4-Rutas.md`

## Fase 5 — Layout/Shell y theming
- Etiquetas: [phase:5, area:frontend, type:feature]
- Descripción: Implementar Header, Footer, Subnav y ThemeProvider con persistencia.
- Tareas:
  - [ ] ThemeProvider/Toggle
  - [ ] Header/Footer/Subnav accesibles
- Criterios:
  - [ ] Toggle de tema persiste y funciona
- Referencias: `Fase5-Layout.md`

## Fase 6 — PWA
- Etiquetas: [phase:6, area:infra, type:feature]
- Descripción: Configurar `next-pwa`, manifest e iconos, habilitar offline básico.
- Tareas:
  - [ ] `next.config` con PWA
  - [ ] `manifest.webmanifest` e iconos
- Criterios:
  - [ ] Instalación y offline verificados (Lighthouse)
- Referencias: `Fase6-PWA.md`

## Fase 7 — Persistencia y perfiles
- Etiquetas: [phase:7, area:domain, type:feature]
- Descripción: Abstracción StorageDriver (`fs-access`, `idb`, `memory`) y YAML con Zod.
- Tareas:
  - [ ] Implementar drivers
  - [ ] Helpers `loadYaml/saveYaml`
  - [ ] Flujo selección de perfil
- Criterios:
  - [ ] Lectura/escritura `theme.yaml` y `stats.yaml` validada
- Referencias: `Fase7-Persistencia.md`

## Fase 8 — Generadores y verificación
- Etiquetas: [phase:8, area:domain, type:feature]
- Descripción: Generadores iniciales (Aritmética, Cálculo) y verificadores.
- Tareas:
  - [ ] `generateArithmetic/verifyArithmetic`
  - [ ] `generateDerivatives/verifyDerivative`
- Criterios:
  - [ ] Casos correctos/incorrectos pasan tests
- Referencias: `Fase8-Problemas.md`

## Fase 9 — Motor de práctica
- Etiquetas: [phase:9, area:domain, type:feature]
- Descripción: Store Zustand para sesión con timer, pausa, racha y transiciones.
- Tareas:
  - [ ] `usePracticeStore`
  - [ ] Hooks de temporizador
- Criterios:
  - [ ] Racha y tiempos se actualizan correctamente
- Referencias: `Fase9-Practica.md`

## Fase 10 — UI práctica
- Etiquetas: [phase:10, area:frontend, type:feature]
- Descripción: UI Question/Answer/Keyboard/Progress integrada al store.
- Tareas:
  - [ ] Componentes y wiring
  - [ ] Página `/[category]/practice`
- Criterios:
  - [ ] Flujo completo con Pausa/Enviar/Siguiente
- Referencias: `Fase10-UI-Practica.md`

## Fase 11 — Estadísticas
- Etiquetas: [phase:11, area:domain, type:feature]
- Descripción: Cálculos y visualizaciones (línea y barras) + racha 24h.
- Tareas:
  - [ ] Utilidades mean/sd/variance
  - [ ] Gráficas AvgTime/Accuracy
- Criterios:
  - [ ] Datos consistentes con sesiones guardadas
- Referencias: `Fase11-Estadisticas.md`

## Fase 12 — Presets
- Etiquetas: [phase:12, area:domain, type:feature]
- Descripción: CRUD de presets y export/import en YAML.
- Tareas:
  - [ ] `list/load/save/export/import`
  - [ ] UI básica de gestión
- Criterios:
  - [ ] Export/Import entre perfiles funciona
- Referencias: `Fase12-Presets.md`

## Fase 13 — Logros
- Etiquetas: [phase:13, area:domain, type:feature]
- Descripción: Motor de reglas por eventos y badges persistentes.
- Tareas:
  - [ ] Reglas de racha/sesión/velocidad
  - [ ] Actualización de `achievements.yaml`
- Criterios:
  - [ ] Badges cambian de estado al cumplir reglas
- Referencias: `Fase13-Logros.md`

## Fase 14 — i18n
- Etiquetas: [phase:14, area:frontend, type:feature]
- Descripción: Internacionalización es/en/zh con `next-intl` y middleware.
- Tareas:
  - [ ] Mensajes por namespace
  - [ ] Middleware de locales
- Criterios:
  - [ ] Navegación `/es`, `/en`, `/zh` correcta
- Referencias: `Fase14-i18n.md`

## Fase 15 — Atajos
- Etiquetas: [phase:15, area:frontend, type:feature]
- Descripción: Hook de atajos configurables y aviso de conflictos del navegador.
- Tareas:
  - [ ] `useShortcuts` y normalización
  - [ ] UI de edición y validación
- Criterios:
  - [ ] Acciones disparan y preven default cuando procede
- Referencias: `Fase15-Atajos.md`

## Fase 16 — A11y y performance
- Etiquetas: [phase:16, area:frontend, type:chore]
- Descripción: WCAG AA, lint a11y, optimizaciones y dynamic imports.
- Tareas:
  - [ ] Reglas `jsx-a11y`
  - [ ] Medición Lighthouse
- Criterios:
  - [ ] Lighthouse ≥ 90 en PWA/Perf si es viable
- Referencias: `Fase16-Accesibilidad.md`

## Fase 17 — Pruebas
- Etiquetas: [phase:17, area:tooling, type:test]
- Descripción: Configurar Vitest/RTL y Playwright con pruebas base.
- Tareas:
  - [ ] `vitest.config.ts` y setup
  - [ ] e2e smoke
- Criterios:
  - [ ] Unit y e2e en verde, cobertura inicial ≥ 40%
- Referencias: `Fase17-Pruebas.md`

## Fase 18 — Scripts y calidad
- Etiquetas: [phase:18, area:tooling, type:chore]
- Descripción: ESLint/Prettier/Husky y scripts de npm.
- Tareas:
  - [ ] Linters y hooks
  - [ ] Scripts `lint`, `format`, `typecheck`
- Criterios:
  - [ ] Pre-commit funcional, linters limpios
- Referencias: `Fase18-Scripts-Calidad.md`

## Fase 19 — CI
- Etiquetas: [phase:19, area:infra, type:chore]
- Descripción: Workflow de GitHub Actions para lint, typecheck, test y build.
- Tareas:
  - [ ] `ci.yml`
  - [ ] (Opcional) job e2e
- Criterios:
  - [ ] Checks pasan en PR y `main`
- Referencias: `Fase19-CI-CD.md`

## Fase 20 — Deploy
- Etiquetas: [phase:20, area:infra, type:chore]
- Descripción: Deploy en Vercel o self-host con Docker.
- Tareas:
  - [ ] Variables de entorno
  - [ ] Build standalone (si self-host)
- Criterios:
  - [ ] Producción accesible y PWA verificable
- Referencias: `Fase20-Deploy.md`

## Fase 21 — Documentación
- Etiquetas: [phase:21, area:docs, type:docs]
- Descripción: Mantener documentación actualizada, ADRs y índice.
- Tareas:
  - [ ] `docs/README.md` con índice
  - [ ] ADRs clave
- Criterios:
  - [ ] Docs actualizadas y enlazadas
- Referencias: `Fase21-Documentacion.md`
