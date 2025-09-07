# Themes

Esta carpeta contiene todos los estilos relacionados con temas de manera modular y organizada.

## Estructura

- `index.css` - Punto de entrada que importa todos los temas
- `custom-themes.css` - Estilos para temas personalizados (deep-blue, solarized-light, dark, pink-purple)
- `high-contrast.css` - Estilos para modo de alto contraste
- `reduced-motion.css` - Estilos para movimiento reducido
- `dark-scheme.css` - Estilos para esquema de color oscuro automático

## Uso

Los temas se importan automáticamente en `src/style.css`. Los temas personalizados se aplican mediante el atributo `data-theme` en el elemento raíz del documento.

## Sistema de Temas

- **Temas Personalizados**: Controlados por el usuario mediante el selector de temas
- **Temas Automáticos**: Basados en las preferencias del sistema del usuario:
  - `prefers-color-scheme: dark` - Aplica estilos oscuros automáticamente
  - `prefers-contrast: high` - Mejora el contraste para accesibilidad
  - `prefers-reduced-motion: reduce` - Reduce animaciones para accesibilidad

## Agregar un Nuevo Tema

1. Agregar el tema al tipo `Theme` en `src/theme.ts`
2. Agregar el tema al array `THEMES` en `src/theme.ts`
3. Agregar la función `labelForTheme` para el nuevo tema
4. Crear los estilos CSS en `custom-themes.css` con el selector `[data-theme="nombre-tema"]`
