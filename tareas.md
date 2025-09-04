# MathRaining — Plan de trabajo con Next.js (App Router)

Este documento detalla los pasos para crear/migrar el proyecto a Next.js, con parámetros y requisitos de construcción por fase, alineado a la especificación de `Estructura.md`.

## Prerrequisitos (Fase 0)
- Objetivo: Asegurar entornos homogéneos.
- Parámetros:
  - Node.js: >= 20.11 (LTS) recomendado; mínimo 18.18.
  - Gestor de paquetes: pnpm 9.x (sugerido) o npm 10.x.
  - Git >= 2.40, VS Code, extensiones: ESLint, Prettier, Tailwind CSS IntelliSense (opcional).
- Requisitos de construcción:
  - Verificar versión: `node -v`, `pnpm -v`.
  - Habilitar Corepack (si usas pnpm): `corepack enable`.

## Crear proyecto Next.js (Fase 1)
- Objetivo: Scaffold base con TypeScript y App Router.
- Parámetros:
  - Nombre app: mathraining.
  - Router: App Router (./app).
  - TypeScript: sí.
  - ESLint: sí.
  - Tailwind CSS: sí.
- Requisitos de construcción:
  - Crear app: `pnpm create next-app@latest` (responder según parámetros).
  - Entrar al dir y primer build: `pnpm install && pnpm build`.

## Dependencias de dominio (Fase 2)
- Objetivo: Añadir librerías clave.
- Parámetros (versiones mínimas sugeridas):
  - Estado: `zustand@^4`, persist: `zustand/middleware`.
  - YAML: `yaml@^2`.
  - Validación: `zod@^3`.
  - KaTeX: `katex@^0.16`, `react-katex@^3`.
  - i18n: `next-intl@^3`.
  - Gráficas: `chart.js@^4`, `react-chartjs-2@^5`.
  - PWA: `next-pwa@^5.6`.
  - IndexedDB: `idb-keyval@^6`.
  - Iconos: `lucide-react@^0.441`.
  - Accesibilidad testing: `@testing-library/react@^14`, `@testing-library/jest-dom@^6`.
- Requisitos de construcción: `pnpm add <paquetes>`; tipado: `pnpm add -D @types/node` si fuese necesario.

## Estructura de carpetas (Fase 3)
- Objetivo: Preparar layout y módulos.
- Parámetros:
  - `app/` con rutas de `Estructura.md`.
  - `src/` para módulos y componentes compartidos si se activa `baseUrl`.
  - Alias sugeridos: `@app`, `@components`, `@modules`, `@lib`.
- Requisitos de construcción:
  - Configurar `tsconfig.json` con `paths`.

## Rutas y páginas (Fase 4)
- Objetivo: Mapear rutas del documento.
- Parámetros de rutas:
  - `/` (dashboard), `/categories`.
  - `/[category]/` (home de categoría), `/[category]/games`, `/[category]/practice`, `/[category]/configuration`, `/[category]/profile`.
  - `/about`, `/donations`.
- Requisitos de construcción:
  - Crear directorios y `page.tsx` en `app/`.
  - Añadir metadata en `layout.tsx`.

## Layout y shell base (Fase 5)
- Objetivo: Implementar `AppShell` con header, footer y subnav.
- Parámetros:
  - Header: iconos (Home, GitHub, Ko-fi, About, Tema, Teclado, Perfil).
  - Theming: Tailwind + `prefers-color-scheme` + toggle.
  - Subnav: pestañas Juegos/Práctica/Config.
- Requisitos de construcción:
  - Configurar Tailwind: `tailwind.config.ts`, `globals.css`.
  - Añadir `ThemeProvider` y `Header`/`Footer`.

## PWA y offline (Fase 6)
- Objetivo: PWA instalable, caché de assets y rutas públicas.
- Parámetros:
  - Plugin: `next-pwa` modo `appDir`.
  - Estrategia: precache estático + runtime caching para imágenes y fetch limitado.
- Requisitos de construcción:
  - Configurar `next.config.js` con `withPWA`.
  - Añadir `manifest.webmanifest` e iconos.

## Persistencia local y perfiles (Fase 7)
- Objetivo: Abstracción de almacenamiento con drivers conmutables.
- Parámetros:
  - Drivers: `fs-access` (File System Access API), `idb` (IndexedDB), `memory`.
  - Carpeta perfil: seleccionable por usuario cuando `fs-access` está disponible.
  - Estructura YAML por perfil:
    - `global/theme.yaml`, `global/shortcuts.yaml`.
    - `<categoria>/practice_presets/*.yaml`, `progress.yaml`, `stats.yaml`.
  - `schemaVersion` en cada archivo.
- Requisitos de construcción:
  - Crear interfaz `StorageDriver` y fábrica `createStorage`.
  - Implementar `yaml` parse/stringify y validación con `zod`.

## Generadores de problemas (Fase 8)
- Objetivo: Contrato e implementación inicial para Aritmética y Cálculo.
- Parámetros:
  - Interface `ProblemGeneratorParams` y `Problem` `{ question, answer, meta }`.
  - `SolutionVerificator(userInput, answer): boolean`.
  - Config: cuotas/pesos, tiempo por problema, subcategorías, nProblemas.
- Requisitos de construcción:
  - Crear módulo `@modules/core/problems`.
  - Implementar ejemplos: sumas/restas, derivadas simples (placeholder).

## Motor de práctica y juego (Fase 9)
- Objetivo: Loop de práctica con tiempo, racha y verificación.
- Parámetros:
  - Temporizador, pausa, porcentaje de tiempo consumido.
  - Registro de intentos y resultados, actualización de racha.
- Requisitos de construcción:
  - Store con Zustand para sesión de práctica.
  - Hooks: `usePracticeSession`, `useTimer`.

## UI de práctica (Fase 10)
- Objetivo: Componentes `QuestionBox`, `AnswerBox`, `Keyboard`, `ProgressInfo`.
- Parámetros:
  - KaTeX para preguntas.
  - Filtros de caracteres inválidos en respuesta.
  - Teclado matemático configurable.
- Requisitos de construcción:
  - Añadir estilos responsive y accesibles (roles/labels).

## Estadísticas y rachas (Fase 11)
- Objetivo: Estadísticas por categoría/subcategoría/nivel.
- Parámetros:
  - Media, desviación estándar, varianza, n.
  - Historial por sesión y día, racha con ventana de 24h.
- Requisitos de construcción:
  - Módulo `@modules/stats` con utilidades y gráficos con Chart.js.

## Presets (Fase 12)
- Objetivo: CRUD de presets y exportación/importación YAML.
- Parámetros:
  - Acciones: duplicar, renombrar, eliminar, fijar, exportar/importar.
  - Flags UI: mostrar progress box, teclado on/off.
- Requisitos de construcción:
  - Validación con `zod` y guardado con `StorageDriver`.

## Logros y recompensas (Fase 13)
- Objetivo: Sistema de badges.
- Parámetros:
  - Reglas: completar nivel X, racha Y, bajo T% de tiempo.
- Requisitos de construcción:
  - Motor de reglas disparado por eventos de sesión.

## i18n (Fase 14)
- Objetivo: Internacionalización (es, en, zh).
- Parámetros:
  - Librería: `next-intl`.
  - Estrategia: namespaces por dominio.
- Requisitos de construcción:
  - Configurar provider y middleware.

## Atajos de teclado (Fase 15)
- Objetivo: Atajos configurables con aviso de conflicto.
- Parámetros:
  - Persistencia en `global/shortcuts.yaml`.
- Requisitos de construcción:
  - Hook `useShortcuts` con detección de conflictos comunes del navegador.

## Accesibilidad y rendimiento (Fase 16)
- Objetivo: AA mínimo (WCAG), 60fps en interacciones.
- Parámetros:
  - Focus visible, roles adecuados, navegación por teclado.
- Requisitos de construcción:
  - Lints de a11y, medición con React Profiler y Lighthouse.

## Pruebas (Fase 17)
- Objetivo: Cobertura básica y e2e críticos.
- Parámetros:
  - Unit: Vitest + RTL.
  - e2e: Playwright (instalación opcional).
- Requisitos de construcción:
  - Scripts: `test`, `test:watch`, `e2e`.

## Scripts y calidad (Fase 18)
- Objetivo: Scripts de NPM y linters.
- Parámetros:
  - `dev`, `build`, `start`, `lint`, `format`, `typecheck`.
- Requisitos de construcción:
  - Configurar ESLint/Prettier y Git hooks (Husky opcional).

## CI/CD (Fase 19)
- Objetivo: Validaciones automáticas.
- Parámetros:
  - GitHub Actions: lint, typecheck, build, test.
- Requisitos de construcción:
  - Archivo `.github/workflows/ci.yml` básico.

## Deploy (Fase 20)
- Objetivo: Publicación en Vercel u otra plataforma.
- Parámetros:
  - Variables: `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_DEFAULT_LANG`.
- Requisitos de construcción:
  - Conectar repo y establecer variables.

## Documentación (Fase 21)
- Objetivo: Documentos de contribución y arquitectura.
- Parámetros:
  - Mantener `HowToWork.md`, `Estructura.md` como fuente.
- Requisitos de construcción:
  - Actualizar docs por PR.

## Guías por fase (en este repo)
- Fase 1: `Fase1-Scaffold.md`
- Fase 2: `Fase2-Dependencias.md`
- Fase 3: `Fase3-Estructura.md`
- Fase 4: `Fase4-Rutas.md`
- Fase 5: `Fase5-Layout.md`
- Fase 6: `Fase6-PWA.md`
- Fase 7: `Fase7-Persistencia.md`
- Fase 8: `Fase8-Problemas.md`
- Fase 9: `Fase9-Practica.md`
- Fase 10: `Fase10-UI-Practica.md`
- Fase 11: `Fase11-Estadisticas.md`
- Fase 12: `Fase12-Presets.md`
- Fase 13: `Fase13-Logros.md`
- Fase 14: `Fase14-i18n.md`
- Fase 15: `Fase15-Atajos.md`
- Fase 16: `Fase16-Accesibilidad.md`
- Fase 17: `Fase17-Pruebas.md`
- Fase 18: `Fase18-Scripts-Calidad.md`
- Fase 19: `Fase19-CI-CD.md`
- Fase 20: `Fase20-Deploy.md`
- Fase 21: `Fase21-Documentacion.md`

---

# Backlog detallado con criterios de aceptación

Cada ítem incluye: objetivo, parámetros, requisitos de construcción, criterios de aceptación.

1) Bootstrap Next.js y Tailwind
- Parámetros: App Router, TS, ESLint, Tailwind.
- Requisitos: proyecto compila y arranca.
- Criterios: `pnpm dev` sirve `/` con layout base.

2) Theming con toggle y persistencia
- Parámetros: `theme: 'system'|'light'|'dark'` en storage global.
- Requisitos: Provider + localStorage/driver.
- Criterios: tema se recuerda tras recarga.

3) Header con iconos y enlaces
- Parámetros: URLs `GITHUB_URL`, `DONATION_URL`.
- Requisitos: íconos de `lucide-react` y accesibles.
- Criterios: navegación funcional y a11y básica.

4) Rutas de categorías y subpáginas
- Parámetros: `category` dinámica.
- Requisitos: páginas stub con navegación.
- Criterios: todas las rutas de `Estructura.md` accesibles.

5) Abstracción de almacenamiento
- Parámetros: `STORAGE_BACKEND='fs-access'|'idb'|'memory'`.
- Requisitos: drivers con interfaz común.
- Criterios: cambiar backend no rompe flujos.

6) Estructura de perfiles y YAML
- Parámetros: `schemaVersion` por archivo, validación `zod`.
- Requisitos: CRUD de perfiles, select carpeta.
- Criterios: crear perfil, escribir y leer YAML.

7) Problem Generator (aritmética básico)
- Parámetros: `nProblemas`, `tiempo`, `subcategorías`.
- Requisitos: genera `{question, answer, meta}` KaTeX-ready.
- Criterios: verificación True/False confiable.

8) Motor de práctica
- Parámetros: `timeout`, `pausa`, `progreso`.
- Requisitos: loop, cálculo de racha y tiempo usado.
- Criterios: métricas actualizadas correctamente.

9) UI de práctica
- Parámetros: teclado on/off, filtros de caracteres.
- Requisitos: componentes accesibles, responsivos.
- Criterios: interacción fluida y sin errores.

10) Estadísticas y gráficos
- Parámetros: media, sd, var, n; histórico por sesión/día.
- Requisitos: gráficos con Chart.js.
- Criterios: datos coinciden con sesiones guardadas.

11) Presets (CRUD + import/export)
- Parámetros: YAML portable, flags UI.
- Requisitos: validación y persistencia.
- Criterios: export/import entre perfiles funciona.

12) i18n (es/en/zh)
- Parámetros: `NEXT_PUBLIC_DEFAULT_LANG`.
- Requisitos: provider y mensajes por namespace.
- Criterios: alternar idioma cambia textos.

13) PWA
- Parámetros: manifest, iconos, sw.
- Requisitos: instalación y offline básico.
- Criterios: Lighthouse PWA >= 90.

14) Atajos de teclado
- Parámetros: YAML `shortcuts.yaml`.
- Requisitos: captura y conflicto.
- Criterios: atajos disparan acciones y alertan conflictos.

15) Logros y badges
- Parámetros: reglas declarativas.
- Requisitos: almacenamiento y UI badges.
- Criterios: desbloqueo persistente y consistente.

---

## Variables de entorno sugeridas
- `NEXT_PUBLIC_APP_NAME=MathRaining`
- `NEXT_PUBLIC_DEFAULT_LANG=es`
- `NEXT_PUBLIC_PWA=1`
- `STORAGE_BACKEND=auto` (auto-> fs-access si disponible, sino idb)
- `GITHUB_URL=https://github.com/EasyModeLife/MathRaining`
- `DONATION_URL=https://ko-fi.com/<tu-kofi>`

## Scripts sugeridos en package.json
- `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `test`, `test:watch`.

## Notas de migración desde el código actual
- Reubicar componentes a `app/(components)` o `src/components` y páginas a `app/`.
- `AppShell.tsx`, `Header.tsx`, `Footer.tsx`, `GameFrame.tsx` pueden adaptarse como Server/Client Components según uso de estado.
- Los módulos `arithmetic/calculus` pasarán a `src/modules/<categoria>/` con interfaz común de generadores.