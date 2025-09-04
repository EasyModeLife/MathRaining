# Fase 3 — Alias (tsconfig paths) y estructura de carpetas

Objetivo: definir los alias de importación y preparar la estructura base de módulos y componentes para alinear el proyecto a Next.js App Router.

## 1) Alias en `tsconfig.json`

Agrega/ajusta `baseUrl` y `paths` para usar imports limpios:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["app/*"],
      "@components/*": ["src/components/*"],
      "@modules/*": ["src/modules/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

Notas:
- Si el scaffold generó `src/`, puedes mover `app/` fuera o mantenerlo en raíz; el alias `@app` asume `app/` en raíz del proyecto Next.
- Tras cambios a `tsconfig.json`, reinicia el servidor (`pnpm dev`).

## 2) Estructura de carpetas recomendada

- `app/` — rutas (App Router)
  - `(shell)/` — componentes de layout compartidos opcionalmente agrupados
  - `about/`, `donations/`, `categories/`
  - `[category]/`
    - `page.tsx`, `games/page.tsx`, `practice/page.tsx`, `configuration/page.tsx`, `profile/page.tsx`
- `src/components/` — UI reutilizable
  - `Header/`, `Footer/`, `Subnav/`, `GameFrame/`, `QuestionBox/`, `AnswerBox/`, `Keyboard/`, `ProgressInfo/`
- `src/modules/` — lógica de dominio
  - `core/`
    - `problems/` — contratos y utilidades (Problem, Generator, Verificator)
    - `storage/` — drivers (`fs-access`, `idb`, `memory`)
    - `stats/` — métricas, rachas, agregadores
  - `arithmetic/` — implementaciones iniciales
    - `generators/`, `verificators/`, `ui/` (si hay UI específica)
  - `calculus/` — implementaciones iniciales
    - `generators/`, `verificators/`, `ui/`
- `src/lib/`
  - `i18n/` — configuración `next-intl`
  - `pwa/` — helpers para `next-pwa`
  - `utils/` — utilidades comunes
- `public/`
  - `manifest.webmanifest`, iconos PWA, imágenes estáticas

## 3) Contratos mínimos a preparar (stubs)

Crea interfaces para alinear implementaciones posteriores:

```ts
// src/modules/core/problems/types.ts
export type Problem = {
  question: string; // KaTeX permitido
  answer: unknown;
  meta?: { category: string; subcategory?: string; suggestedTime?: number };
};

export type ProblemGeneratorParams = {
  category: string;
  subcategories?: string[];
  count: number;
  timePerProblem?: number;
  quotas?: Record<string, number>; // o weights
  weights?: Record<string, number>;
};

export type SolutionVerificator = (userInput: string, answer: unknown) => boolean;
```

```ts
// src/modules/core/storage/types.ts
export interface StorageDriver {
  read(path: string): Promise<string | undefined>;
  write(path: string, data: string): Promise<void>;
  list(dir: string): Promise<string[]>;
  exists(path: string): Promise<boolean>;
}
```

(Implementación concreta llegará en Fase 7; aquí sólo definimos tipos.)

## 4) Verificación
- El IDE resuelve imports como `@components/Header` y `@modules/core/problems` sin errores.
- El servidor de desarrollo arranca tras cambios de `tsconfig.json`.

## 5) Siguiente fase
- Fase 4: Crear las rutas base en `app/` según `Estructura.md` y stubs de páginas.
