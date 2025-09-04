# Fase 7 — Persistencia local y perfiles (YAML)

Objetivo: crear una abstracción de almacenamiento con drivers conmutables y estructuras YAML por perfil, conforme al árbol de `Estructura.md`.

## Parámetros
- Backends soportados: `fs-access` (File System Access API), `idb` (IndexedDB), `memory` (dev).
- Selección de backend: `STORAGE_BACKEND=auto|fs-access|idb|memory` (por defecto `auto`).
- Estructura de perfil:
```
<perfil>/
  global/
    theme.yaml
    shortcuts.yaml
  <categoria>/
    practice_presets/*.yaml
    progress.yaml
    stats.yaml
  exports/
    *.yaml
```
- `schemaVersion` obligatorio en cada archivo.

## Requisitos de construcción
- Paquetes ya instalados: `yaml`, `zod`, `idb-keyval` (si se usa `idb`).
- Navegadores: `fs-access` soportado en Chromium/Edge; en Safari/Firefox usar `idb`.

## Contratos
```ts
// StorageDriver
interface StorageDriver {
  read(path: string): Promise<string | undefined>
  write(path: string, data: string): Promise<void>
  list(dir: string): Promise<string[]>
  exists(path: string): Promise<boolean>
}
```

Schemas (Zod) sugeridos:
```ts
// theme.yaml
const ThemeSchema = z.object({
  schemaVersion: z.literal(1),
  theme: z.enum(['system','light','dark']).default('system')
})

// shortcuts.yaml
const ShortcutsSchema = z.object({
  schemaVersion: z.literal(1),
  actions: z.record(z.string(), z.string()) // 'actionId': 'Ctrl+K'
})

// practice preset
const PracticePresetSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string(),
  subcategories: z.array(z.string()).min(1),
  count: z.number().int().positive(),
  timePerProblem: z.number().positive().optional(),
  quotas: z.record(z.string(), z.number()).optional(),
  weights: z.record(z.string(), z.number()).optional(),
  showProgress: z.boolean().default(true),
  keyboard: z.boolean().default(true)
})

// stats.yaml
const StatsSchema = z.object({
  schemaVersion: z.literal(1),
  sessions: z.array(z.object({
    startedAt: z.string(), // ISO
    endedAt: z.string(),
    problems: z.number().int().nonnegative(),
    correct: z.number().int().nonnegative(),
    avgTimeMs: z.number().nonnegative()
  })),
  aggregates: z.object({
    mean: z.number(), sd: z.number(), variance: z.number(), n: z.number().int().nonnegative()
  })
})
```

## Drivers

### 1) fs-access
- Pedir carpeta con `window.showDirectoryPicker()` tras interacción del usuario.
- Guardar `FileSystemDirectoryHandle` en memoria; no se puede persistir portablemente, por lo que se pide de nuevo si es necesario.
- I/O:
  - `read(path)`: `await (await fileHandle.getFile()).text()`
  - `write(path, data)`: `const w = await fileHandle.createWritable(); await w.write(data); await w.close()`
- Consideraciones: permisos pueden revocarse; manejar `DOMException`.

### 2) idb
- Usar `idb-keyval` con claves tipo `path` (`global/theme.yaml`, etc.).
- Implementación simple: `get(path)`, `set(path, data)`, `keys()` para `list`.

### 3) memory
- Objeto `Map<string,string>` para desarrollo/pruebas sin efectos en disco.

## Fábrica de storage
```ts
function createStorage(kind: 'auto'|'fs-access'|'idb'|'memory'): StorageDriver {
  // auto: fs-access si disponible y hay carpeta seleccionada; sino idb; sino memory
}
```

## Flujo de selección de perfil
1) Usuario elige: Demo (sin guardar) o Seleccionar/Crear carpeta de perfil.
2) Si `fs-access` disponible y permitido: guardar handle en runtime y usar driver `fs-access`.
3) Si no: usar `idb`.

## Lectura y escritura YAML
```ts
import YAML from 'yaml'

async function loadYaml<T>(storage: StorageDriver, path: string, schema: z.ZodSchema<T>): Promise<T> {
  const txt = await storage.read(path)
  const parsed = txt ? YAML.parse(txt) : undefined
  const result = schema.safeParse(parsed)
  if (!result.success) throw new Error(`Schema error in ${path}`)
  return result.data
}

async function saveYaml<T>(storage: StorageDriver, path: string, data: T) {
  const txt = YAML.stringify(data)
  await storage.write(path, txt)
}
```

## Errores y bordes
- Permiso denegado o revocado (fs-access): mostrar UI para reintentar.
- Colisiones de claves en `idb`: prefijar con `<perfil>/`.
- Migraciones: si `schemaVersion` cambia, aplicar transformadores o volver a generar con defaults.

## Verificación
- `memory`: simula crear perfil, guardar `theme.yaml`, leer de vuelta, validar con Zod.
- `idb`: recargar la página y confirmar persistencia.
- `fs-access`: cerrar/abrir pestaña y volver a pedir permisos cuando sea necesario.

## Próximo
- Fase 8: Generadores de problemas y verificación de soluciones.
