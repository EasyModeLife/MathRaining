# Fase 1 — Scaffold base Next.js

## Comandos para crear el proyecto

```bash
# 1. Crear el proyecto base (elige las opciones: TypeScript, ESLint, Tailwind, App Router)
pnpm create next-app@latest mathraining
# 2. Entrar al directorio y instalar dependencias
cd mathraining
pnpm install
# 3. Primer build para verificar
pnpm build
# 4. Ejecutar en modo desarrollo
pnpm dev
```

## Parámetros de configuración
- Nombre: mathraining
- TypeScript: sí
- ESLint: sí
- Tailwind CSS: sí
- App Router: sí

## Verificación
- La app debe compilar sin errores.
- Al abrir http://localhost:3000 debe verse el layout base de Next.js.
- El directorio debe contener:
  - `app/` (App Router)
  - `tsconfig.json`
  - `tailwind.config.ts`
  - `package.json`

## Notas
- Si usas npm, reemplaza `pnpm` por `npm` en los comandos.
- Si pnpm no está instalado, ejecuta:
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
- Si ya existe el directorio, puedes migrar los archivos manualmente y ejecutar `pnpm install`.

## Siguiente fase
- Fase 2: Instalar dependencias clave del dominio. Consulta `Fase2-Dependencias.md`.
