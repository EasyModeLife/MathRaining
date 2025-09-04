# Fase 14 — Internacionalización (next-intl)

Objetivo: añadir soporte multilenguaje (es, en, zh) con `next-intl`, namespaces por dominio y middleware para negociación de idioma.

## Requisitos de construcción
- Paquete: `next-intl` (Fase 2).

## Estructura sugerida
```
src/lib/i18n/
  messages/
    es/
      common.json
      header.json
      practice.json
      profile.json
    en/
      common.json
      header.json
      practice.json
      profile.json
    zh/
      common.json
      header.json
      practice.json
      profile.json
```

## Configuración del provider
```tsx
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

export function generateStaticParams() { return [{ locale: 'es' }, { locale: 'en' }, { locale: 'zh' }] }

async function getMessages(locale: string) {
  try {
    return (await import(`@lib/i18n/messages/${locale}/common.json`)).default
  } catch (error) {
    notFound()
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = await getMessages(params.locale)
  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

Nota: Puedes usar layout anidado por locale o un provider en `app/layout.tsx` con `getRequestConfig`.

## Middleware para redirección por idioma
```ts
// middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['es', 'en', 'zh'],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANG || 'es'
})

export const config = { matcher: ['/((?!_next|api|.*\\.\w+$).*)'] }
```

## Uso en componentes
```tsx
'use client'
import { useTranslations } from 'next-intl'

export function Greeting() {
  const t = useTranslations('common')
  return <p>{t('hello')}</p>
}
```

`common.json` ejemplo:
```json
{ "hello": "Hola" }
```

## Estrategia de mensajes
- Namespaces por dominio (common, header, practice, profile, stats, presets).
- Evitar concatenación dinámica; usar placeholders: `"greeting": "Hola, {name}"`.

## Verificación
- Navegar a `/es`, `/en`, `/zh` y ver cambios de idioma.
- Cambiar `NEXT_PUBLIC_DEFAULT_LANG` y reiniciar; el middleware debe redirigir al default.

## Próximo
- Fase 15: Atajos de teclado configurables.
