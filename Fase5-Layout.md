# Fase 5 — Layout/Shell, theming y navegación

Objetivo: Implementar App Shell con Header, Footer y Subnav; habilitar tema claro/oscuro respetando `prefers-color-scheme` y un toggle persistente.

## Prerrequisitos
- Proyecto Next.js App Router creado (Fase 1)
- Tailwind configurado (si no lo generó el scaffold)
- Paquetes: `lucide-react`

## 1) Tailwind (si no viene del scaffold)
- tailwind.config.ts
```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
```

- globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light dark; }
```

## 2) Theming (sin dependencias externas)
Crea un pequeño provider cliente que controle `data-theme` en `<html>` y persista en `localStorage`.

```tsx
// src/components/ThemeProvider.tsx
'use client'
import { useEffect, useState, createContext, useContext } from 'react'

type Theme = 'light' | 'dark' | 'system'
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: 'system', setTheme: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(saved)
  }, [])
  useEffect(() => {
    const root = document.documentElement
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && sysDark)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', theme)
  }, [theme])
  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
```

Toggle simple:
```tsx
// src/components/ThemeToggle.tsx
'use client'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="inline-flex gap-2">
      <button aria-pressed={theme==='light'} onClick={() => setTheme('light')}><Sun size={18} /></button>
      <button aria-pressed={theme==='dark'} onClick={() => setTheme('dark')}><Moon size={18} /></button>
      <button aria-pressed={theme==='system'} onClick={() => setTheme('system')}><Monitor size={18} /></button>
    </div>
  )
}
```

## 3) App Shell (layout global)
En `app/layout.tsx` envuelve con `ThemeProvider`.

```tsx
// app/layout.tsx
import './globals.css'
import { ThemeProvider } from '@components/ThemeProvider'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'

export const metadata = {
  title: {
    default: 'MathRaining',
    template: '%s — MathRaining',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## 4) Header, Footer y Subnav
Estructura mínima accesible.

```tsx
// src/components/Header.tsx
'use client'
import Link from 'next/link'
import { Home, Github, Heart, Info, Keyboard, User } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700">
      <nav className="flex items-center gap-3">
        <Link href="/" aria-label="Inicio"><Home size={20} /></Link>
        <Link href={process.env.NEXT_PUBLIC_GITHUB_URL || '#'} aria-label="GitHub"><Github size={20} /></Link>
        <Link href="/donations" aria-label="Donaciones"><Heart size={20} /></Link>
        <Link href="/about" aria-label="Sobre el sitio"><Info size={20} /></Link>
      </nav>
      <div className="flex items-center gap-3">
        <button aria-label="Teclado virtual"><Keyboard size={20} /></button>
        <button aria-label="Perfil"><User size={20} /></button>
        <ThemeToggle />
      </div>
    </header>
  )
}
```

```tsx
// src/components/Footer.tsx
export function Footer() {
  return (
    <footer className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
  <p>© {new Date().getFullYear()} MathRaining — Libre y sin telemetry</p>
    </footer>
  )
}
```

Subnav para páginas de categoría:
```tsx
// src/components/Subnav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Subnav({ base }: { base: string }) {
  const pathname = usePathname()
  const tabs = [
    { href: `${base}`, label: 'Inicio' },
    { href: `${base}/games`, label: 'Juegos' },
    { href: `${base}/practice`, label: 'Práctica' },
    { href: `${base}/configuration`, label: 'Configuración' },
    { href: `${base}/profile`, label: 'Perfil' },
  ]
  return (
    <div className="flex gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className={pathname===t.href ? 'font-semibold underline' : ''}>{t.label}</Link>
      ))}
    </div>
  )
}
```

Uso en páginas de categoría (`app/[category]/layout.tsx`):
```tsx
// app/[category]/layout.tsx
import { Subnav } from '@components/Subnav'

export default function CategoryLayout({ children, params }: { children: React.ReactNode; params: { category: string } }) {
  return (
    <section>
      <Subnav base={`/${params.category}`} />
      {children}
    </section>
  )
}
```

## 5) Requisitos de construcción
- Variables de entorno recomendadas:
  - `NEXT_PUBLIC_GITHUB_URL` (en `.env.local`)
- Lint sin errores, build sin warnings críticos.

## 6) Verificación
- `pnpm dev` y comprobar:
  - Header y Footer visibles en todas las rutas.
  - Toggle de tema cambia y persiste entre recargas.
  - Subnav aparece bajo rutas de categoría y resalta la pestaña activa.

## 7) Siguiente fase
- Fase 6: PWA y soporte offline (`next-pwa`, manifest, iconos).
