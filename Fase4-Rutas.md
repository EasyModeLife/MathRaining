# Fase 4 — Rutas y páginas (App Router)

Objetivo: mapear las rutas descritas en `Estructura.md` usando el App Router de Next.js y crear stubs mínimos de página.

## Rutas requeridas
- `/` — Dashboard inicial
- `/categories` — Selección de categorías
- `/[category]/` — Home de categoría
- `/[category]/games` — Juegos
- `/[category]/practice` — Práctica
- `/[category]/configuration` — Configuración
- `/[category]/profile` — Perfil
- `/about` — Información del sitio
- `/donations` — Donaciones

## Árbol sugerido en `app/`
```
app/
  layout.tsx
  page.tsx
  categories/
    page.tsx
  about/
    page.tsx
  donations/
    page.tsx
  [category]/
    page.tsx
    games/
      page.tsx
    practice/
      page.tsx
    configuration/
      page.tsx
    profile/
      page.tsx
```

## Stubs mínimos de página
Ejemplo de stub accesible para cualquier `page.tsx`:

```tsx
export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Stub de página</h1>
      <p>Remplaza este contenido con la implementación real.</p>
    </main>
  );
}
```

## Metadata básica
En `app/layout.tsx` configura `metadata` y layout global (Tailwind y ThemeProvider se añaden en Fase 5).

```tsx
export const metadata = {
  title: {
    default: 'MathRaining',
    template: '%s — MathRaining',
  },
  description: 'Práctica de matemáticas enfocada en repetición, offline y PWA.',
};
```

## Verificación
- `pnpm dev` sirve todas las rutas con páginas stub sin errores.
- Navegar manualmente a `/about`, `/categories`, `/donations` y rutas dinámicas `/<categoria>/...`.

## Siguiente fase
- Fase 5: Layout y shell base (Header, Footer, Subnav, theming) con Tailwind.
