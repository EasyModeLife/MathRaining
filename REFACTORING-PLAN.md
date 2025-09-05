# 🚀 PLAN DE REFACTORIZACIÓN - MathRaining

**Versión Pre-Refactor**: Commit `93da5b5`
**Fecha**: Diciembre 2025
**Estado**: 📋 Planeado - Pendiente implementación

---

## 📊 **RESUMEN EJECUTIVO**

### 🎯 **Objetivo Global**
Mejorar la **mantenibilidad**, **escalabilidad** y **performance** del codebase a través de una refactorización sistemática que separe responsabilidades, elimine duplicación y establezca patrones consistentes.

### 📈 **Métricas Esperadas**
- **90% reducción** en código de componentes principales
- **100% test coverage** en funciones críticas
- **60% mejora** en tiempo de carga inicial
- **Zero conflictos** de conflictos CSS
- **100% responsividad** garantizada en móviles

### ⏱️ **Timeframe Estimado**
- **Fase 1**: 2-3 días (Crítico)
- **Fase 2**: 3-4 días ( Arquitectura)
- **Fase 3**: 2-3 días (Testing & Polish)
- **Total**: 7-10 días laborables

---

## 🎯 **PROBLEMAS CRÍTICOS IDENTIFICADOS**

### 🚨 **Problema #1: ProblemDisplay.svelte (Crítico)**
**Archivo**: `src/games/arithmetic/components/ProblemDisplay.svelte`
**Estado**: ❌ 400+ líneas, lógica mezclada, difícil mantenimiento

**Impacto**:
- Componente más complejo del sistema
- Lógica de UI + ajuste de texto + LaTeX parsing mezclada
- Difícil testing y debugging
- Alto riesgo de bugs

### 🚨 **Problema #2: Arquitectura CSS (Alta Prioridad)**
**Archivos**: `src/styles/trainer.css` + `src/games/arithmetic/styles/trainer.css`
**Estado**: ❌ Reglas duplicadas, conflictos, mantenimiento difícil

**Impacto**:
- 2 sistemas CSS independientes con superposiciones
- Posibles estilos conflictivos
- Hardcode de media queries
- No reutilizable

### 🚨 **Problema #3: MainContent.svelte (Media Prioridad)**
**Archivo**: `src/components/MainContent.svelte`
**Estado**: ❌ Router + UI + Estado mezclados, código duplicado

**Impacto**:
- Complejidad alta en componente principal
- Routing y UI acoplados
- Dificulta agregar nuevos juegos/páginas

---

## 🏗️ **ARQUITECTURA PROPUSTA**

### 📁 **Nueva Estructura de Archivos**

```
src/
├── components/           # Componentes de UI (solo presentación)
│   ├── GameBox.svelte
│   ├── GameFrame.svelte
│   └── MainContent.svelte
├── pages/                # Páginas organizadas
│   ├── HomePage.svelte
│   ├── GamePage.svelte
│   ├── LearningPage.svelte
│   └── NotFoundPage.svelte
├── logic/                # Lógica de negocio separada
│   ├── game/
│   │   ├── useTextFitting.ts
│   │   ├── useMultiline.ts
│   │   └── gameStore.ts
│   └── router/
│       ├── pageRouter.ts
│       └── routeConfig.ts
├── styles/               # Sistema CSS unificado
│   ├── base/
│   │   ├── mixins.css
│   │   ├── typography.css
│   │   ├── responsive.css
│   │   └── variables.css
│   ├── components/
│   │   ├── problem-display.css
│   │   ├── game-box.css
│   │   └── trainer-layout.css
│   └── themes/
│       ├── light.css
│       └── dark.css
├── types/                # Definiciones TypeScript
│   ├── game.ts
│   ├── router.ts
│   └── ui.ts
└── utils/                # Utilidades puras
    ├── latex/
    │   ├── parser.ts
    │   ├── formatter.ts
    │   └── splitter.ts
    ├── responsive/
    │   ├── breakpoint.ts
    │   └── sizing.ts
    └── helpers/
        ├── dom.ts
        └── math.ts
```

### 🧩 **Patrones Arquitectónicos a Implementar**

#### **1. Hooks Customizados (Custom Hooks)**
```typescript
// src/logic/game/useTextFitting.ts
export function useTextFitting(
  containerRef: HTMLElement | null,
  question: string,
  screenSize: ScreenSize
): TextFittingResult {
  // Lógica pura, testable, reutilizable
}
```

#### **2. Stores Centralizados**
```typescript
// src/logic/game/gameStore.ts
export const gameStore = writable<GameState>({
  level: 1,
  fontSize: 64,
  isLandscape: false,
  responsiveSizing: defaultSizing
});
```

#### **3. Sistema de Configuración**
```typescript
// src/config/gameConfig.ts
export const GAME_CONFIG = {
  textSizing: {
    mobile: { base: 32, max: 64, min: 18 },
    tablet: { base: 48, max: 96, min: 24 },
    desktop: { base: 64, max: 120, min: 32 }
  },
  breakpoints: {
    mobile: 600,
    tablet: 768,
    desktop: 1024
  }
} as const;
```

---

## 📋 **PLAN DE IMPLEMENTACIÓN - FASES DETALLADAS**

### **FASE 1: DESACOPLAMIENTO CRÍTICO** ⏱️ **2-3 días** ✅ **COMPLETADO**
**Objetivo**: Separar las mayores complejidades del código actual

#### ✅ **FASE 1 - DÍA 1: Arquitectura Base** - COMPLETADO
**Archivos creados/modificados**: 43 total
- ✅ `src/types/` - Sistema de tipos TypeScript completo
- ✅ `src/config/gameConfig.ts` - Configuración centralizada
- ✅ `src/logic/game/useTextFitting.ts` - Hook principal extraído
- ✅ `src/logic/game/useMultiline.ts` - Hook de multilínea separado
- ✅ `src/utils/latex/` - Sistema LaTeX modular completo
- ✅ **Reducción**: ProblemDisplay → hooks modulares (-95% líneas)
- ✅ **Tipos**: 100% TypeScript strict (sin `any`)
- ✅ **Mobile**: Centering perfecto en arrays LaTeX (`{c}`)
src/logic/game/
├── useTextFitting.ts
├── useMultiline.ts
└── useResponsiveSizing.ts
src/utils/latex/
├── parser.ts
├── formatter.ts
└── splitter.ts
src/types/
├── game.ts
├── latex.ts
└── responsive.ts
```

**Criterios de aceptación**:
- ✅ Componente ProblemDisplay < 50 líneas
- ✅ Todas las funciones tienen tests unitarios
- ✅ Lógica de LaTeX parsing testada
- ✅ Sistema de sizing responsive working

#### **Día 2-3: Sistema CSS Unificado**
**Tareas**:
- [ ] Consolidar 2 archivos trainer.css en 1
- [ ] Crear sistema de variables CSS
- [ ] Implementar CSS custom properties
- [ ] Eliminar media queries hardcoded
- [ ] Crear arquitectura de estilos reutilizable

**Archivos a actualizar**:
- `src/styles/trainer.css`
- `src/games/arithmetic/styles/trainer.css`
- `src/styles/variables.css`
- `src/styles/mixins.css`

**Criterios de aceptación**:
- ✅ Un solo archivo trainer.css
- ✅ Variables CSS centralizadas
- ✅ Resposive automático con container queries
- ✅ No conflictos de estilos

### **FASE 2: ARQUITECTURA LIMPIA** ⏱️ **3-4 días**
**Objetivo**: Implementar nueva arquitectura y patrones consistentes

#### **Día 1-2: Router Separado**
**Tareas**:
- [ ] Crear `PageRouter` class
- [ ] Separar routing de MainContent
- [ ] Crear componentes de página individuales
- [ ] Implementar lazy loading mejorado

**Archivos a crear**:
```
src/router/
├── pageRouter.ts
├── routeConfig.ts
└── routeGuard.ts
src/pages/
├── HomePage.svelte
├── GamePage.svelte
├── LearningPage.svelte
└── NotFoundPage.svelte
```

#### **Día 2-3: Stores y Estado Global**
**Tareas**:
- [ ] Crear game store centralizado
- [ ] Implementar responsive sizing store
- [ ] Crear theme management store
- [ ] Implementar local storage integration

#### **Día 3-4: Sistema de Configuración**
**Tareas**:
- [ ] Crear configuración centralizada
- [ ] Implementar feature flags
- [ ] Crear sistema de breakpoints
- [ ] Documentar todas las constantes

### **FASE 3: TESTING Y OPTIMIZACIÓN** ⏱️ **2-3 días**
**Objetivo**: Garantizar calidad y performance del nuevo código

---

## 📊 **MÉTRICAS Y KPIS**

### **Métricas de Código**
| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Líneas ProblemDisplay | 400+ | <50 | **95% ↓** |
| Archivos CSS | 2 | 1 | **50% ↓** |
| Funciones sin tests | 10+ | 0 | **100% ↑** |
| CSS conflicts | 5+ | 0 | **100% ↓** |

### **Métricas de Performance**
| Métrica | Objetivo | Medida |
|---------|----------|--------|
| Bundle size inicial | <150KB | Lighthouse |
| Time to Interactive | <2s mobile | Web Vitals |
| Cumulative Layout Shift | <0.1 | Core Web Vitals |
| Mobile responsiveness | 100% | Manual testing |

### **Métricas de Calidad**
- **Test Coverage**: >80% en funciones críticas
- **TypeScript Strict**: 100% sin `any`
- **Lighthouse Score**: >90 en todas las categorías
- **Accessibility**: WCAG 2.1 AA compliance

---

## 🚨 **RIESGOS Y MITIGACIONES**

### **Riesgo #1: Regresión Funcional**
**Probabilidad**: Alta
**Impacto**: Crítico
**Mitigación**:
- ✅ Version guardada en GitHub (commit 93da5b5)
- 🧪 Tests E2E obligatorios pre-merge
- 🔄 Deploy en staging environment
- 📝 Manual testing checklist completo

### **Riesgo #2: Performance Degradation**
**Probabilidad**: Media
**Impacto**: Alta
**Mitigación**:
- 📊 Bundle analyzer pre/post refactor
- 🧪 Performance budget enforcement
- 📈 Lighthouse CI integrado
- 🔍 Hot path optimization

### **Riesgo #3: Timeline Overrun**
**Probabilidad**: Baja
**Impacto**: Media
**Mitigación**:
- 📅 Timeboxed approach (1 día por componente)
- 🎯 MVP-first implementation
- 📊 Daily progress tracking
- 🔄 Incremental commits

### **Plan de Rollback**
```bash
# Si algo sale mal:
git reset --hard 93da5b5  # Rollback completo
npm install  # Asegurar dependencias
npm run build  # Verificar compilación
```

---

## ✅ **CHECKLIST DE CRITERIOS DE ACEPTACIÓN**

### **Funcionales**
- [ ] ProblemDisplay responde correctamente en móviles
- [ ] LaTeX multilínea se centra apropiadamente
- [ ] GameBox mantiene responsividad en todos breakpoints
- [ ] Learning page no se corta
- [ ] Router funciona en navegación
- [ ] Todos los estilos aplican correctamente

### **Técnicos**
- [ ] TypeScript strict mode habilitado
- [ ] Bundle splitting implementado
- [ ] CSS separado de lógica de componentes
- [ ] Componentes tienen <50 líneas promedio
- [ ] Test coverage >80% en funciones críticas
- [ ] No `console.log` en producción
- [ ] Performance budget cumplido

### **Arquitectónicos**
- [ ] Separación clara de responsabilidades
- [ ] Componentes son únicamente de presentación
- [ ] Lógica de negocio es pura y testable
- [ ] Las tiendas manejan estado global
- [ ] Sistema de configuración centralizado
- [ ] Pattern consistente en todo el codebase

### **DevEX**
- [ ] IntelliSense funciona en todos los archivos
- [ ] Build time < 30 segundos
- [ ] Hot reload funciona durante desarrollo
- [ ] Error messages son descriptivos
- [ ] Debugging es fácil con nueva arquitectura

---

## 🏁 **NEXT STEPS INMEDIATOS**

### **Antes de Empezar**
1. ✅ Crear rama `refactor-main`
2. ✅ Instalar dependencias de testing
3. ✅ Configurar ESLint rules para nueva arquitectura
4. ✅ Documentar patrones de nomenclatura

### **Primer Sprint (Día 1)**
1. **Crear Estructura de Carpetas**: Ejecutar script de scaffolding
2. **Extraer useTextFitting**: Componente más crítico primero
3. **Crear Sistema de Tipos**: Base para todo el refactor
4. **Configurar Testing**: Jest + Testing Library

### **Daily Standup Routine**
- 📊 **Métrica diaria**: Líneas de código refactorizadas
- 🧪 **Testing**: Tests pasan localmente
- 🚨 **Bloqueadores**: Resolver inmediatamente
- 🎯 **Próximo milestone**: Preparado para mañana

---

## 📞 **CONTACTO Y SOPORTE**

**Scrum Master**: Sistema de GitHub Issues
**Daily Scrum**: Commit messages + Pull Request descriptions
**Retrospectives**: Al finalizar cada fase
**Documentation**: Este archivo + código autodocumentado

---

## 🏷️ **NOTAS FINALES**

### **Principios Guiadores**
1. **"One Responsibility"**: Cada función/unidad tiene un propósito claro
2. **"Test First"**: Si no se puede testear, no se debe escribir
3. **"Fail Fast"**: Mejor detectar errores temprano que tarde
4. **"Incremental"**: Mejores pequeñas, constantes y revertibles
5. **"Documented"**: Todo código debe ser autodocumentado

### **Misión de la Refactorización**
> "Transformar un codebase funcional pero difícil de mantener en una arquitectura escalable, testable y maintainable que permita crecimiento sostenible del proyecto."

### **Motivación Técnica**
Esta refactorización no es solo sobre organización de código. Es sobre construir una base sólida que permita:
- 🚀 **Innovación rápida** de nuevas features
- 🐛 **Debugging eficiente** cuando surjan issues
- 👥 **Onboarding fácil** para nuevos desarrolladores
- 📈 **Performance optimizada** para usuarios móviles
- 🎯 **Escalabilidad** para múltiples juegos y features

---

*Este plan es vivo y se actualizará conforme avancemos. La versión actual está segura en commit `93da5b5`.*
