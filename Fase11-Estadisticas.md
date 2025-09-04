# Fase 11 — Estadísticas y rachas (Chart.js)

Objetivo: calcular métricas (media, desviación estándar, varianza, n), manejar histórico por sesión y día, y visualizar con Chart.js. Incluir racha basada en ventana de 24h.

## Parámetros
- Data sources: sesiones de práctica guardadas en YAML (`stats.yaml`) por categoría.
- Cálculos por: categoría, subcategoría y preset (si aplica).
- Racha (streak):
  - Nivel 1: consecutivas dentro de una sesión.
  - Nivel 2: continuidad diaria: no más de 24h entre el primer y último problema del streak (global).

## Requisitos de construcción
- Paquetes: `chart.js`, `react-chartjs-2` (instalados en Fase 2).
- Registro de elementos Chart.js en cliente.

## Esquema de datos
`stats.yaml` (ver Fase 7) contiene `sessions` y `aggregates`.

Ejemplo de sesión añadida:
```ts
// src/modules/stats/types.ts
export type SessionStat = {
  startedAt: string // ISO
  endedAt: string
  problems: number
  correct: number
  avgTimeMs: number
}
```

## Utilidades de estadística
```ts
// src/modules/stats/math.ts
export function mean(xs: number[]): number { return xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : 0 }
export function variance(xs: number[]): number {
  if (!xs.length) return 0
  const m = mean(xs)
  return mean(xs.map(x => (x - m) ** 2))
}
export function sd(xs: number[]): number { return Math.sqrt(variance(xs)) }

export function accuracy(correct: number, total: number): number { return total ? correct/total : 0 }
```

## Agregadores
```ts
// src/modules/stats/aggregate.ts
import { mean, sd, variance } from './math'

export function aggregateSessions(sessions: { avgTimeMs: number; problems: number; correct: number }[]) {
  const times = sessions.map(s => s.avgTimeMs)
  const totals = sessions.map(s => s.problems)
  const corrects = sessions.map(s => s.correct)
  const n = sessions.length
  return {
    mean: mean(times),
    sd: sd(times),
    variance: variance(times),
    n,
    totalProblems: totals.reduce((a,b)=>a+b,0),
    totalCorrect: corrects.reduce((a,b)=>a+b,0)
  }
}
```

## Racha (24h)
```ts
// src/modules/stats/streak.ts
// Asume timestamps en ms
export function computeDailyStreak(timestamps: number[]): number {
  if (!timestamps.length) return 0
  const sorted = [...timestamps].sort((a,b)=>a-b)
  let best = 1, curr = 1
  for (let i=1;i<sorted.length;i++) {
    const dt = sorted[i] - sorted[i-1]
    if (dt <= 24*60*60*1000) { curr++ } else { best = Math.max(best, curr); curr = 1 }
  }
  return Math.max(best, curr)
}
```

Timestamps sugeridos: hora del primer intento de cada sesión.

## Visualizaciones (react-chartjs-2)
Registro común en cliente:
```ts
// src/modules/stats/chart-setup.ts
'use client'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend,
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)
```

Línea: tiempos promedio por sesión
```tsx
// src/components/charts/AvgTimeLine.tsx
'use client'
import { Line } from 'react-chartjs-2'

type Pt = { date: string; avgTimeMs: number }
export function AvgTimeLine({ data }: { data: Pt[] }) {
  const labels = data.map(d=>d.date)
  const ds = data.map(d=>Math.round(d.avgTimeMs))
  return (
    <Line data={{
      labels,
      datasets: [{ label: 'Tiempo medio (ms)', data: ds, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.2)' }]
    }} options={{ responsive: true, plugins: { legend: { display: true } } }} />
  )
}
```

Barra: precisión por sesión
```tsx
// src/components/charts/AccuracyBar.tsx
'use client'
import { Bar } from 'react-chartjs-2'

export function AccuracyBar({ data }: { data: { date: string; correct: number; total: number }[] }) {
  const labels = data.map(d=>d.date)
  const acc = data.map(d=> d.total ? Math.round((d.correct/d.total)*100) : 0)
  return (
    <Bar data={{ labels, datasets: [{ label: 'Precisión (%)', data: acc, backgroundColor: '#6366f1' }] }} />
  )
}
```

## Integración de datos
- Transformar `sessions` en arrays `[{ date, avgTimeMs }]` y `[{ date, correct, total }]` (usar `new Date(startedAt).toLocaleDateString()` o formato ISO corto).
- Calcular agregados con `aggregateSessions` y racha con `computeDailyStreak`.

## Verificación
- Con sesiones simuladas, las gráficas deben renderizar en `/[category]/profile`.
- Métricas agregadas deben coincidir con cálculos manuales.

## Próximo
- Fase 12: Presets (CRUD + export/import YAML).
