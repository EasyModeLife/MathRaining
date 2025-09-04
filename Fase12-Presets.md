# Fase 12 — Presets (CRUD + export/import YAML)

Objetivo: gestionar presets de práctica como niveles personalizados, almacenados por categoría en YAML.

## Parámetros
- Archivo: `<perfil>/<categoria>/practice_presets/*.yaml`
- Campos requeridos (ver Fase 7: `PracticePresetSchema`).
- Acciones: crear, duplicar, renombrar, eliminar, fijar, exportar, importar.
- Flags UI: `showProgress`, `keyboard`.

## Requisitos de construcción
- Validación Zod al cargar/guardar.
- Integración con `StorageDriver` activo.

## Contratos
```ts
// src/modules/presets/types.ts
export type PracticePreset = {
  schemaVersion: 1
  name: string
  subcategories: string[]
  count: number
  timePerProblem?: number
  quotas?: Record<string, number>
  weights?: Record<string, number>
  showProgress: boolean
  keyboard: boolean
}
```

## API de presets
```ts
// src/modules/presets/api.ts
import YAML from 'yaml'
import { z } from 'zod'
import type { StorageDriver } from '@modules/core/storage/types'

const Schema = z.object({
  schemaVersion: z.literal(1),
  name: z.string(),
  subcategories: z.array(z.string()).min(1),
  count: z.number().int().positive(),
  timePerProblem: z.number().positive().optional(),
  quotas: z.record(z.string(), z.number()).optional(),
  weights: z.record(z.string(), z.number()).optional(),
  showProgress: z.boolean().default(true),
  keyboard: z.boolean().default(true),
})

const dir = (category: string) => `${category}/practice_presets`
const pathOf = (category: string, name: string) => `${dir(category)}/${name}.yaml`

export async function listPresets(storage: StorageDriver, category: string) {
  const files = await storage.list(dir(category))
  return files.filter(f => f.endsWith('.yaml')).map(f => f.replace(/\.yaml$/, ''))
}

export async function loadPreset(storage: StorageDriver, category: string, name: string) {
  const txt = await storage.read(pathOf(category, name))
  if (!txt) throw new Error('Preset no encontrado')
  const data = YAML.parse(txt)
  const r = Schema.safeParse(data)
  if (!r.success) throw new Error('Preset inválido')
  return r.data
}

export async function savePreset(storage: StorageDriver, category: string, preset: unknown) {
  const r = Schema.safeParse(preset)
  if (!r.success) throw new Error('Datos inválidos')
  const txt = YAML.stringify(r.data)
  await storage.write(pathOf(category, r.data.name), txt)
}

export async function removePreset(storage: StorageDriver, category: string, name: string) {
  // Si el driver no soporta borrar, puedes escribir un marcador o mantener lista filtrada.
  // Extender StorageDriver con remove(path) es opcional.
}

export async function exportPreset(storage: StorageDriver, category: string, name: string) {
  const txt = await storage.read(pathOf(category, name))
  if (!txt) throw new Error('Preset no encontrado')
  return new Blob([txt], { type: 'text/yaml' })
}

export async function importPreset(storage: StorageDriver, category: string, file: File) {
  const txt = await file.text()
  const data = YAML.parse(txt)
  const r = Schema.safeParse(data)
  if (!r.success) throw new Error('Archivo inválido')
  await storage.write(pathOf(category, r.data.name), YAML.stringify(r.data))
}
```

## UI mínima
- Lista de presets y acciones (duplicar, renombrar, eliminar, exportar, importar).
- Botón "Fijar" para destacar preset en UI de categoría.

## Integración con práctica
- Desde un preset: crear `ProblemGeneratorParams` y arrancar sesión (`start`).

## Verificación
- Crear preset, guardarlo, recargar y verlo listado.
- Exportar preset y volverlo a importar con otro nombre.

## Próximo
- Fase 13: Logros y recompensas.
