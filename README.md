# MathRaining (Svelte)

## 📦 Build & Deployment

### Comandos de Compilación
- **`npm run build`** - Compila la aplicación optimizada para producción
- **`npm run dev`** - Inicia servidor de desarrollo con hot reload
- **`npm run deploy`** - Alias para `npm run build`

### Configuración de Build
El proyecto está configurado para compilar automáticamente en la carpeta `mathraining_app`:

```typescript
// vite.config.ts
build: {
  outDir: 'mathraining_app',  // Carpeta de salida del build
  base: './',                 // Rutas relativas para archivos estáticos
  // ...
}
```

### Deploy a Cloudflare Pages
#### Opción 1: Automático con Git
1. Conecta tu repositorio en Cloudflare Pages
2. **Build command**: `npm run build`
3. **Build output directory**: `mathraining_app`
4. Deploy automáticamente cuando hagas push a main

#### Opción 2: Manual
1. Ejecuta: `npm run build` (crea `mathraining_app`)
2. Sube la carpeta completa `mathraining_app` a Cloudflare Pages
3. Deploy listo!

#### Archivos Generados en `mathraining_app`
```bash
mathraining_app/
├── index.html          # Página principal
├── 404.html           # Página de error
├── _redirects         # Configuración de redirecciones
├── robots.txt         # Configuración SEO
└── assets/           # CSS, JS, imágenes y fonts optimizadas
    ├── index-*.js     # Código JavaScript principal
    ├── index-*.css    # Estilos principales
    ├── katex-*.js     # Librería KaTeX
    └── fonts/         # Todas las fuentes de KaTeX
```

### Login a Production Build
- ✅ Rutas relativas (`./assets/`) para funcionamiento óptimo
- ✅ Optimizado con gzip compression
- ✅ Code splitting automatizado
- ✅ CSS y JS minificados
- ✅ Soporte completo para MathRaining funcionalidad

## 📖 Sobre MathRaining

<div class="about-page">
