# Fase 15 — Atajos de teclado configurables

Objetivo: capturar atajos configurables por perfil, detectar conflictos comunes del navegador y despachar acciones de la UI.

## Parámetros
- Archivo YAML: `<perfil>/global/shortcuts.yaml` (ver Fase 7) con `schemaVersion: 1` y `actions: { actionId: 'Ctrl+K' }`.
- Acciones mínimas: `practice.pause`, `practice.next`, `practice.submit`, `ui.toggleKeyboard`, `ui.toggleTheme`.

## Requisitos de construcción
- `StorageDriver` operativo.
- Normalizar combos a formato: `Ctrl+Shift+K`, `Alt+P`, `Space`, `Enter`.

## Conflictos comunes del navegador
- `Ctrl+L`, `Ctrl+T`, `Ctrl+W`, `Ctrl+R`, `Ctrl+Shift+I`, `Ctrl+P`.
- Mostrar aviso si el usuario intenta asignar alguno de los anteriores.

## Hook principal
```ts
// src/modules/shortcuts/useShortcuts.ts
'use client'
import { useEffect, useRef } from 'react'

export type ShortcutMap = Record<string, string> // actionId -> combo ("Ctrl+K")
const BROWSER_CONFLICTS = new Set(['Ctrl+L','Ctrl+T','Ctrl+W','Ctrl+R','Ctrl+Shift+I','Ctrl+P'])

function normalize(e: KeyboardEvent) {
  const parts: string[] = []
  if (e.ctrlKey) parts.push('Ctrl')
  if (e.metaKey) parts.push('Meta')
  if (e.altKey) parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')
  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key
  parts.push(key === ' ' ? 'Space' : key)
  return parts.join('+')
}

export function useShortcuts(map: ShortcutMap, dispatch: (actionId: string) => void) {
  const mapRef = useRef(map)
  useEffect(() => { mapRef.current = map }, [map])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const combo = normalize(e)
      const entry = Object.entries(mapRef.current).find(([, c]) => c === combo)
      if (!entry) return
      const [actionId] = entry
      // Prevenir comportamiento por defecto sólo si no es conflictivo crítico
      if (!BROWSER_CONFLICTS.has(combo)) e.preventDefault()
      dispatch(actionId)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [dispatch])
}

export function hasBrowserConflict(combo: string) {
  return BROWSER_CONFLICTS.has(combo)
}
```

## Carga y edición
- Cargar `shortcuts.yaml` al inicio (según perfil) y construir `ShortcutMap`.
- UI de edición con grabador: al pulsar teclas, formar combo normalizado y validar.

## Integración sugerida
```ts
// Ejemplo de dispatch
function dispatch(actionId: string) {
  switch (actionId) {
    case 'practice.pause': return store.pause()
    case 'practice.next': return store.next()
    case 'practice.submit': return submit()
    case 'ui.toggleKeyboard': return toggleKeyboard()
    case 'ui.toggleTheme': return toggleTheme()
  }
}
```

## Verificación
- Asignar `Space` a `practice.pause`, probar que pause/reanude.
- Intentar asignar `Ctrl+W` → UI debe avisar conflicto.

## Próximo
- Fase 16: Accesibilidad y rendimiento.
