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
