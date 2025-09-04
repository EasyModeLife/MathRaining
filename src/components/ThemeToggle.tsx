'use client'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="inline-flex gap-2">
      <button aria-pressed={theme==='light'} onClick={() => setTheme('light')} title="Claro"><Sun size={18} /></button>
      <button aria-pressed={theme==='dark'} onClick={() => setTheme('dark')} title="Oscuro"><Moon size={18} /></button>
      <button aria-pressed={theme==='system'} onClick={() => setTheme('system')} title="Sistema"><Monitor size={18} /></button>
    </div>
  )
}
