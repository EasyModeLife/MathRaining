# HowToWork — Guía para contribuir a MathRaining

Bienvenido/a. Este documento explica cómo configurar tu entorno, el flujo de trabajo de Git, los estándares de código y cómo proponer cambios.

## 1) Requisitos y parámetros de entorno
- Sistemas soportados: Linux, macOS, Windows (WSL sugerido).
- Node.js: >= 20.11 (LTS) / mínimo 18.18.
- Gestor: pnpm 9.x (recomendado) o npm 10.x.
- Git >= 2.40.
- VS Code con extensiones: ESLint, Prettier, Tailwind CSS IntelliSense, i18n Ally (opcional).
- Parámetros de entorno (
	crear `.env.local`):
	- `NEXT_PUBLIC_APP_NAME="MathRaining"`
	- `NEXT_PUBLIC_DEFAULT_LANG=es`
	- `NEXT_PUBLIC_PWA=1`
	- `STORAGE_BACKEND=auto`
	- `GITHUB_URL=https://github.com/EasyModeLife/MathRaining`
	- `DONATION_URL=https://ko-fi.com/<tu-kofi>`

## 2) Primeros pasos
1. Clona el repositorio y habilita Corepack si usarás pnpm.
2. Instala dependencias.
3. Ejecuta el servidor de desarrollo.
4. Abre http://localhost:3000.

## 3) Estructura del proyecto
- `app/`: Rutas Next.js (App Router). Incluye `layout.tsx`, `page.tsx` y subrutas.
- `src/components/`: Componentes reutilizables (Header, Footer, etc.).
- `src/modules/`: Lógica de dominio (generadores de problemas, stats, storage).
- `public/`: assets estáticos, manifest e iconos.
- `tests/`: pruebas unitarias e2e (si aplica).
- `docs/`: documentación adicional.

## 4) Estándares de código
- TypeScript estricto; evita `any` sin justificar.
- Componentes Server por defecto; usa Client sólo si hay estado/efectos.
- Accesibilidad: roles ARIA, focus visible, navegación por teclado.
- Estilo: Prettier; ESLint sin warnings en PRs.
- Nomenclatura:
	- Hooks: `useX`.
	- Tipos/Interfaces: `PascalCase`.
	- Funciones y vars: `camelCase`.
- Imports con alias definidos en `tsconfig.json` (`@components`, `@modules`, `@lib`).

## 5) Commits y ramas
- Convención de commits (Conventional Commits):
	- `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `perf:`.
	- Ej.: `feat(practice): loop con temporizador y pausa`.
- Flujo de ramas:
	- `main`: estable.
	- feature branches: `feat/<area>/<descripcion-corta>`.
	- fixes: `fix/<area>/<descripcion-corta>`.
- PRs pequeños y enfocados; incluye descripción, screenshots y checklist.

## 6) Proceso para abrir un PR
1. Abre issue o enlaza a uno existente.
2. Crea rama desde `main` y realiza cambios.
3. Ejecuta calidad:
	 - `pnpm lint` (sin errores).
	 - `pnpm typecheck` (sin TS errors).
	 - `pnpm test` (pasan pruebas relevantes).
	 - `pnpm build` (compila).
4. Añade documentación si cambia el comportamiento público.
5. Abre PR con:
	 - Resumen del cambio.
	 - Cómo probar (pasos, rutas, datos).
	 - Riesgos conocidos y mitigaciones.
	 - Checklist de criterios de aceptación.

## 7) Pruebas
- Unit: Vitest + Testing Library.
- e2e: Playwright (opcional inicial, recomendado a medio plazo).
- Cobertura mínima inicial: 40% (subir gradualmente).
- Incluye al menos: happy path + 1-2 edge cases por módulo.

## 8) Reglas de diseño y UX
- Mantener simple, elegante y rápido.
- Evitar bloqueo con modales; preferir toasts y páginas dedicadas.
- Tema claro/oscuro con toggle.
- Reduce motion: respeta `prefers-reduced-motion`.
- Navegación clara entre Juegos, Práctica, Configuración y Perfil.

## 9) Dominio: contratos clave
- Problem:
	- `question: string` (KaTeX permitido), `answer: unknown`, `meta: { category: string; subcategory?: string; suggestedTime?: number; }`.
- ProblemGenerator:
	- `(params: ProblemGeneratorParams) => Problem[] | AsyncIterable<Problem>`.
- SolutionVerificator:
	- `(userInput: string, answer: unknown) => boolean`.
- StorageDriver:
	- `read(path): Promise<string|undefined>`, `write(path, data): Promise<void>`, `list(dir): Promise<string[]>`, `exists(path): Promise<boolean>`.

## 10) Seguridad y privacidad
- No telemetry ni analytics.
- Datos locales del usuario únicamente.
- Export/Import bajo acción explícita del usuario.

## 11) Rendimiento y calidad
- Evita renders innecesarios (memo, useCallback cuando aporte).
- Code splitting por ruta y módulos pesados (KaTeX, charts) con `dynamic()`.
- Imágenes: `next/image`.
- Mide con Lighthouse (PWA, Performance >= 90 si es posible).

## 12) Roadmap de contribución sugerido
- Toma una tarea de `tareas.md` (Fase actual indicada en issues).
- Sincroniza con `main` antes de abrir PR.
- Pide revisión si el cambio supera 300 líneas (dividir si es posible).

## 13) Preguntas frecuentes
- ¿Puedo usar npm en lugar de pnpm?
	- Sí, pero mantenemos archivos lock separados; preferimos pnpm.
- ¿Soporte SSR?
	- Sí, Next.js con App Router por defecto. Componentes client solo cuando sea necesario.

Gracias por contribuir.
