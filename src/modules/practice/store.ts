import { create } from 'zustand'
import type { Problem } from '@modules/core/problems/types'

type AttemptResult = 'correct' | 'wrong' | 'timeout'

export type PracticeAttempt = {
  id: string
  problem: Problem
  startedAt: number
  endedAt?: number
  userInput?: string
  result?: AttemptResult
  timeUsedMs?: number
}

export type PracticeSession = {
  id: string
  category: string
  subcategories?: string[]
  attempts: PracticeAttempt[]
  currentIndex: number
  running: boolean
  paused: boolean
  timeoutMs: number
  startedAt: number
  endedAt?: number
  streak: number
  bestStreak: number
}

export type PracticeState = {
  session?: PracticeSession
  start: (problems: Problem[], opts: { category: string; subcategories?: string[]; timeoutMs?: number }) => void
  pause: () => void
  resume: () => void
  submitAnswer: (input: string, verifier: (u: string, a: unknown) => boolean) => void
  timeout: () => void
  next: () => void
  reset: () => void
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  session: undefined,
  start: (problems, opts) => {
    const now = Date.now()
    const attempts: PracticeAttempt[] = problems.map((p, i) => ({ id: `${now}-${i}`, problem: p, startedAt: i === 0 ? now : 0 }))
    set({
      session: {
        id: `${now}`,
        category: opts.category,
        subcategories: opts.subcategories,
        attempts,
        currentIndex: 0,
        running: true,
        paused: false,
        timeoutMs: opts.timeoutMs ?? (problems[0]?.meta?.suggestedTime ? problems[0].meta!.suggestedTime! * 1000 : 10000),
        startedAt: now,
        streak: 0,
        bestStreak: 0,
      },
    })
  },
  pause: () => {
    const s = get().session
    if (!s || !s.running || s.paused) return
    set({ session: { ...s, paused: true } })
  },
  resume: () => {
    const s = get().session
    if (!s || !s.running || !s.paused) return
    set({ session: { ...s, paused: false } })
  },
  submitAnswer: (input, verifier) => {
    const st = get()
    const s = st.session
    if (!s) return
    const i = s.currentIndex
    const curr = s.attempts[i]
    const endedAt = Date.now()
    const timeUsedMs = Math.max(0, endedAt - curr.startedAt)
    const correct = verifier(input, curr.problem.answer)
    const result: AttemptResult = correct ? 'correct' : 'wrong'
    const streak = correct ? s.streak + 1 : 0
    const bestStreak = Math.max(s.bestStreak, streak)
    const updated: PracticeAttempt = { ...curr, endedAt, userInput: input, result, timeUsedMs }
    const attempts = s.attempts.slice()
    attempts[i] = updated
    set({ session: { ...s, attempts, streak, bestStreak } })
  },
  timeout: () => {
    const s = get().session
    if (!s) return
    const i = s.currentIndex
    const curr = s.attempts[i]
    const endedAt = Date.now()
    const timeUsedMs = Math.max(0, endedAt - curr.startedAt)
    const updated: PracticeAttempt = { ...curr, endedAt, result: 'timeout', timeUsedMs }
    const attempts = s.attempts.slice()
    attempts[i] = updated
    set({ session: { ...s, attempts, streak: 0 } })
  },
  next: () => {
    const s = get().session
    if (!s) return
    const nextIndex = s.currentIndex + 1
    if (nextIndex >= s.attempts.length) {
      set({ session: { ...s, running: false, endedAt: Date.now() } })
      return
    }
    const attempts = s.attempts.slice()
    attempts[nextIndex] = { ...attempts[nextIndex], startedAt: Date.now() }
    const timeoutMs = (attempts[nextIndex].problem.meta?.suggestedTime ?? s.timeoutMs / 1000) * 1000
    set({ session: { ...s, attempts, currentIndex: nextIndex, timeoutMs } })
  },
  reset: () => set({ session: undefined }),
}))
