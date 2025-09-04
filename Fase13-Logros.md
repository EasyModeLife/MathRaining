# Fase 13 — Logros y recompensas (badges)

Objetivo: definir un sistema de logros basado en reglas disparadas por eventos de práctica, persistirlos por perfil y mostrarlos como badges.

## Parámetros
- Eventos fuente: `attempt:submitted`, `attempt:timeout`, `session:ended`.
- Tipos de logro (ejemplos):
  - Progreso: completar N problemas en una sesión.
  - Racha: alcanzar racha Y.
  - Eficiencia: resolver Z problemas bajo T% del tiempo asignado.
  - Consistencia: mantener racha diaria por D días (usa Fase 11 streak 24h).
- Persistencia: `achievements.yaml` en `<perfil>/global/`.

## Requisitos de construcción
- Uso de `StorageDriver` (Fase 7) + `yaml` + `zod`.
- No requiere paquetes adicionales.

## Esquema YAML sugerido
```yaml
schemaVersion: 1
unlocked:
  - id: streak_10
    unlockedAt: 2025-08-31T12:34:56.000Z
  - id: speed_5_under_50
    unlockedAt: 2025-08-31T13:00:00.000Z
progress:
  streakBest: 15
  sessionsCount: 42
```

## Contratos y reglas
```ts
// src/modules/achievements/types.ts
export type Achievement = { id: string; title: string; description: string; icon?: string }
export type EventPayload =
  | { type: 'attempt:submitted'; correct: boolean; timeUsedMs: number; timeoutMs: number; streak: number }
  | { type: 'attempt:timeout' }
  | { type: 'session:ended'; problems: number; correct: number; avgTimeMs: number; bestStreak: number; startedAt: number; endedAt: number }

export type Rule = {
  id: string
  check: (e: EventPayload, ctx: { unlocked: Set<string> }) => string[] // ids de logros desbloqueados
}
```

Reglas ejemplo:
```ts
// src/modules/achievements/rules.ts
export const rules: Rule[] = [
  {
    id: 'streak_10',
    check: (e) => (e.type === 'attempt:submitted' && e.streak >= 10 ? ['streak_10'] : []),
  },
  {
    id: 'speed_5_under_50',
    check: (e) => (e.type === 'attempt:submitted' && e.correct && e.timeUsedMs <= 0.5 * e.timeoutMs ? ['speed_5_under_50_once'] : []),
  },
  {
    id: 'session_50_done',
    check: (e) => (e.type === 'session:ended' && e.problems >= 50 ? ['session_50_done'] : []),
  },
]
```

Catálogo de logros (para UI):
```ts
// src/modules/achievements/catalog.ts
export const catalog: Record<string, Achievement> = {
  streak_10: { id: 'streak_10', title: 'Racha 10', description: 'Alcanza una racha de 10.' },
  speed_5_under_50_once: { id: 'speed_5_under_50_once', title: 'Rápido', description: 'Resuelve bajo 50% del tiempo.' },
  session_50_done: { id: 'session_50_done', title: 'Maratón', description: 'Completa 50 problemas en una sesión.' },
}
```

## Motor simple
```ts
// src/modules/achievements/engine.ts
import YAML from 'yaml'
import type { StorageDriver } from '@modules/core/storage/types'
import { rules } from './rules'

const PATH = 'global/achievements.yaml'

export async function dispatch(storage: StorageDriver, e: EventPayload) {
  const txt = (await storage.read(PATH)) || 'schemaVersion: 1\nunlocked: []\nprogress: {}\n'
  const data = YAML.parse(txt) as { schemaVersion: 1; unlocked: { id: string; unlockedAt: string }[] }
  const unlockedSet = new Set(data.unlocked.map(u => u.id))
  const newly: string[] = []
  for (const r of rules) {
    const ids = r.check(e, { unlocked: unlockedSet })
    for (const id of ids) if (!unlockedSet.has(id)) { unlockedSet.add(id); newly.push(id) }
  }
  if (newly.length) {
    const now = new Date().toISOString()
    data.unlocked.push(...newly.map(id => ({ id, unlockedAt: now })))
    await storage.write(PATH, YAML.stringify(data))
  }
  return newly
}
```

## UI (badges)
- Grilla de badges en `/[category]/profile` o `/<profile>/achievements` (según diseño final).
- Estado: desbloqueado vs. oculto (mostrar silueta/tooltip con hint).

## Verificación
- Disparar eventos al enviar respuesta y al terminar sesión.
- Ver que `achievements.yaml` se actualiza y los badges cambian de estado.

## Próximo
- Fase 14: i18n (es/en/zh) con `next-intl`.
