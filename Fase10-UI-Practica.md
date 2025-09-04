# Fase 10 — UI de práctica (Question, Answer, Keyboard, Progress)

Objetivo: Construir componentes de la UI de práctica y conectarlos al store de la Fase 9.

## Componentes y contratos

### 1) QuestionBox (KaTeX)
```tsx
// src/components/QuestionBox.tsx
'use client'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export function QuestionBox({ question }: { question: string }) {
  return (
    <div className="p-4 text-xl border rounded-md">
      <BlockMath math={question} />
    </div>
  )
}
```

### 2) AnswerBox (sanitización y envío)
```tsx
// src/components/AnswerBox.tsx
'use client'
import { useState } from 'react'

type Props = {
  onSubmit: (input: string) => void
  invalidChars?: RegExp
}

export function AnswerBox({ onSubmit, invalidChars = /[^0-9+\-*/^x()., ]/g }: Props) {
  const [val, setVal] = useState('')
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(val); setVal('') }}
      className="flex gap-2"
    >
      <input
        className="input input-bordered flex-1 px-3 py-2 rounded-md bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
        value={val}
        onChange={(e) => setVal(e.target.value.replace(invalidChars, ''))}
        aria-label="Respuesta"
        autoFocus
      />
      <button className="btn px-4 py-2 rounded-md border" type="submit">Enviar</button>
    </form>
  )
}
```

### 3) Keyboard (teclado matemático configurable)
```tsx
// src/components/MathKeyboard.tsx
'use client'

const DEFAULT_KEYS = ['7','8','9','+','4','5','6','-','1','2','3','*','0','.','/','^','(',')','x']

type Props = { onKey: (k: string) => void; layout?: string[] }

export function MathKeyboard({ onKey, layout = DEFAULT_KEYS }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {layout.map(k => (
        <button key={k} onClick={() => onKey(k)} className="px-3 py-2 border rounded-md" aria-label={`Tecla ${k}`}>{k}</button>
      ))}
    </div>
  )
}
```

### 4) ProgressInfo (tiempo restante, índice, racha)
```tsx
// src/components/ProgressInfo.tsx
'use client'

type Props = { remainingMs: number; totalMs: number; index: number; total: number; streak: number }

export function ProgressInfo({ remainingMs, totalMs, index, total, streak }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((1 - remainingMs / totalMs) * 100)))
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded">
        <div className="h-2 bg-emerald-500 rounded" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-sm">{index + 1} / {total}</div>
      <div className="text-sm">Racha: {streak}</div>
    </div>
  )
}
```

## Integración en página de práctica
```tsx
// app/[category]/practice/page.tsx (client)
'use client'
import { useMemo } from 'react'
import { usePracticeStore } from '@modules/practice/store'
import { useCountdown } from '@modules/practice/useTimer'
import { QuestionBox } from '@components/QuestionBox'
import { AnswerBox } from '@components/AnswerBox'
import { MathKeyboard } from '@components/MathKeyboard'
import { ProgressInfo } from '@components/ProgressInfo'
import { verifyArithmetic } from '@modules/arithmetic/generators/basic'

export default function PracticePage() {
  const s = usePracticeStore()
  const sess = s.session

  // Si no hay sesión, muestra CTA para empezar (Fase 12 añadirá presets)
  if (!sess) return <div className="p-6">Selecciona un preset e inicia una sesión.</div>

  const curr = sess.attempts[sess.currentIndex]
  const remaining = useCountdown(curr.startedAt, sess.timeoutMs, sess.paused)
  const total = sess.timeoutMs

  const onSubmit = (input: string) => {
    s.submitAnswer(input, verifyArithmetic)
  }

  const onNext = () => s.next()

  return (
    <div className="p-6 space-y-4">
      <ProgressInfo remainingMs={remaining} totalMs={total} index={sess.currentIndex} total={sess.attempts.length} streak={sess.streak} />
      <QuestionBox question={curr.problem.question} />
      <AnswerBox onSubmit={onSubmit} />
      <MathKeyboard onKey={(k) => {
        const el = document.querySelector('input[aria-label="Respuesta"]') as HTMLInputElement | null
        if (el) { el.value = el.value + k; el.dispatchEvent(new Event('input', { bubbles: true })) }
      }} />
      <div className="flex gap-2">
        <button onClick={() => (sess.paused ? s.resume() : s.pause())} className="btn border px-3 py-2">{sess.paused ? 'Reanudar' : 'Pausa'}</button>
        <button onClick={onNext} className="btn border px-3 py-2">Siguiente</button>
      </div>
    </div>
  )
}
```

Notas:
- Usa `verifyArithmetic` como ejemplo; selecciona el verificator según categoría/subcategoría.
- Evita manipulación directa del DOM cuando sea posible; aquí es un atajo para el teclado virtual.

## Accesibilidad
- Inputs con `aria-label`, botones con `aria-pressed` donde aplique.
- Focus visible; navegación por teclado sin bloquear.

## Verificación
- En una sesión de prueba, confirmar: barra de tiempo progresa, botón Pausa congela tiempo, Enviar registra intento, Siguiente avanza índice y reinicia cronómetro.

## Próximo
- Fase 11: Estadísticas y rachas (cálculos y gráficos).
