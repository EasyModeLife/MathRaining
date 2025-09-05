# MathRaining Game

**Versión actual: Commit 4afa93c** (Fase 2 refactor completada)

## ✅ Refactorización Completada - Fase 2 de 3

### 🚀 **Estado del Refactor (Fase 2 de 3)**
- ✅ **Fase 1**: Arquitectura modular completada
- ✅ **Fase 2**: Arquitectura limpia completada
- 📋 **Fase 3**: Testing & optimización (planeada)

### 🏆 **Logros de Fase 2 - Arquitectura Limpia**
- 🔀 **Router Separado**: PageRouter class y configuración declarativa
- 🏠 **Pages Individuales**: HomePage, GamePage, AboutPage, NotFoundPage, LearningPage
- 🗂️ **Stores Centralizados**: gameStore, responsiveStore, themeStore
- ⚙️ **Sistema de Config**: GAME_CONFIG con feature flags y breakpoints
- 🎯 **Lazy Loading**: Componentes cargados dinámicamente
- � **Responsive Navigation**: SubNav consistente en todas las páginas de juego

### 📈 **Mejoras Implementadas**
- 🎯 **Arquitectura Modular**: 43 archivos organizados
- 🛡️ **Type Safety**: 100% TypeScript strict
- 📱 **Mobile Responsive**: Texto centrado perfecto
- ⚡ **Performance**: Auto-fit inteligente
- �🔧 **Mantenimiento**: Separación de responsabilidades

### 📁 **Nueva Estructura**
```
/src
├── components/     # UI Components (<50 líneas)
├── logic/          # Business Logic (hooks)
├── types/          # TypeScript definitions
├── utils/          # Pure utility functions
└── config/         # Centralized configuration
```

### 📋 **Próximos Pasos**
1. **Refactor UI components** para usar hooks modulares
2. **Unificar sistema CSS** eliminando duplicaciones
3. **Testing completo** del sistema refactorizado

### 📝 **Instructions for Calculus Inputs**

Para el modo Calculus, usar notación matemática estándar sin comandos LaTeX. Ejemplos:

- **Derivadas**: `d/dx [x^2] = 2x` → Input: `2x` ( o `2x^1` )
- **Exponentes**: `d/dx [x^3] = 3x^2` → Input: `3x^2` (acepta ambos `x^2` y `x^{2}`)
- **Integrales**: `∫ x dx = x^2/2 + C` → Input: `x^2/2 + C` o `(1/2)x^2 + C`
- **Trigonométricas**: `d/dx [sin x] = cos x` → Input: `cos x` (no usar `\cos x`)
- **Fracciones**: `∫ x^2 dx = x^3/3 + C` → Input: `x^3/3 + C`
- **Diferenciales**: `y = x^2, dy at x=3 = 2x dx, y'(3)=6` → Input: `dy=2x dx, y'(3)=6`
+ 
**Nota**: Evitar espacios innecesarios para mejor coincidencia. Usar `/` para fracciones.

### 🔗 **Commits Relevantes**
- `93da5b5`: Base funcional (pre-refactor)
- `f0e8117`: Fase 1 Día 1 - Arquitectura modular
- Próximo: Fase 1 Día 2 - CSS unification

---

## 🎮 **Acerca del Juego**
MathRaining es un juego educativo interactivo para practicar matemáticas con elementos de gamificación y diseño responsive.
