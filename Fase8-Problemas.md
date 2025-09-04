# Fase 8 — Generadores de problemas y verificación

Objetivo: definir contratos y crear implementaciones iniciales para Aritmética y Cálculo, entregando `{ question, answer, meta }` y una función de verificación.

## Parámetros y contratos
```ts
export type Problem = {
  question: string; // soporta KaTeX
  answer: unknown;
  meta?: { category: string; subcategory?: string; suggestedTime?: number };
}

export type ProblemGeneratorParams = {
  category: string;
  subcategories?: string[];
  count: number;
  timePerProblem?: number;
  quotas?: Record<string, number>;
  weights?: Record<string, number>;
}

export type SolutionVerificator = (userInput: string, answer: unknown) => boolean
```

Entradas inválidas y errores:
- `count <= 0`, subcategorías vacías, parámetros contradictorios (cuotas vs pesos) → lanzar error claro.
- Límites: números demasiado grandes o complejos → acotar para UX fluida.

## Generador: Aritmética (sumas/restas)
```ts
// src/modules/arithmetic/generators/basic.ts
import type { Problem, ProblemGeneratorParams, SolutionVerificator } from '@modules/core/problems/types'

export function generateArithmetic(params: ProblemGeneratorParams): Problem[] {
  const n = Math.max(1, params.count)
  const problems: Problem[] = []
  for (let i = 0; i < n; i++) {
    const a = Math.floor(Math.random() * 90) + 10
    const b = Math.floor(Math.random() * 90) + 10
    const op = Math.random() < 0.5 ? '+' : '-'
    const ans = op === '+' ? a + b : a - b
    problems.push({
      question: `${a} \\ ${op} \\ ${b}`, // KaTeX inline: `\\` como separación si usas entorno adecuado
      answer: ans,
      meta: { category: 'arithmetic', suggestedTime: params.timePerProblem ?? 8000 },
    })
  }
  return problems
}

export const verifyArithmetic: SolutionVerificator = (user, answer) => {
  const normalized = (user || '').replace(/[^-\d]/g, '')
  const n = Number(normalized)
  return Number.isFinite(n) && n === answer
}
```

Notas KaTeX:
- Para mostrar `a + b`, puedes usar `question: `${a} + ${b}`` y renderizar con `react-katex` en `QuestionBox`.

## Generador: Cálculo (derivadas polinomiales simples)
```ts
// src/modules/calculus/generators/polynomial.ts
import type { Problem, ProblemGeneratorParams, SolutionVerificator } from '@modules/core/problems/types'

function polyToLatex(coeff: number, power: number) {
  if (power === 0) return `${coeff}`
  const c = coeff === 1 ? '' : coeff === -1 ? '-' : `${coeff}`
  const x = power === 1 ? 'x' : `x^{${power}}`
  return `${c}${x}`
}

export function generateDerivatives(params: ProblemGeneratorParams): Problem[] {
  const n = Math.max(1, params.count)
  const problems: Problem[] = []
  for (let i = 0; i < n; i++) {
    const a = Math.floor(Math.random() * 5) + 1 // 1..5
    const p = Math.floor(Math.random() * 4) + 1 // 1..4
    const question = `\\frac{d}{dx}\\left(${polyToLatex(a, p)}\\right)`
    const answer = { coeff: a * p, power: p - 1 }
    problems.push({
      question,
      answer,
      meta: { category: 'calculus', subcategory: 'derivative', suggestedTime: params.timePerProblem ?? 12000 },
    })
  }
  return problems
}

export const verifyDerivative: SolutionVerificator = (user, ans) => {
  const a = ans as { coeff: number; power: number }
  // Acepta formatos: "kx", "kx^n", "k" (si power=0)
  const s = (user || '').replace(/\s/g, '')
  const match = s.match(/^(-?\d+)?x(?:\^(\d+))?$|^(-?\d+)$/)
  if (!match) return false
  if (match[3] !== undefined) {
    // constante
    return a.power === 0 && Number(match[3]) === a.coeff
  }
  const k = match[1] ? Number(match[1]) : 1
  const pow = match[2] ? Number(match[2]) : 1
  return k === a.coeff && pow === a.power
}
```

## Meta y tiempos
- `meta.suggestedTime` se usa para barra de tiempo y métricas.
- Ajustar por subcategoría/dificultad.

## Verificación general
- Normalizar entrada del usuario (espacios, unicode, coma/decimal).
- Tolerancias (cuando aplique) → por ahora exacto.

## Pruebas rápidas
- Generar 5 problemas de aritmética y validar respuestas correctas/incorrectas.
- Generar 5 derivadas y verificar formatos aceptados.

## Próximo
- Fase 9: Motor de práctica (timer, pausa, progreso, racha) + store con Zustand.
