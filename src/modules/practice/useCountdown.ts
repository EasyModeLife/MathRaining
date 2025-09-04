'use client'
import { useEffect, useRef, useState } from 'react'

export function useCountdown(startAt: number, timeoutMs: number, paused: boolean) {
  const [remaining, setRemaining] = useState(timeoutMs)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    const tick = () => {
      if (paused) { raf.current = requestAnimationFrame(tick); return }
      const now = Date.now()
      const elapsed = now - startAt
      const rem = Math.max(0, timeoutMs - elapsed)
      setRemaining(rem)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [startAt, timeoutMs, paused])
  return remaining
}
