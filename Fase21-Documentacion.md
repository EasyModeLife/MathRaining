
# Fase 21 — Documentación y mantenimiento

Objetivo: mantener documentación actualizada, clara y útil para nuevos contribuidores.

## Estructura recomendada
- `Estructura.md` — fuente de verdad de requisitos y arquitectura de alto nivel.
- `tareas.md` — plan por fases (este repo).
- `HowToWork.md` — guía de contribución.
- `docs/` — materiales adicionales (diagramas, decisiones ADR, guías específicas).

## ADRs (Architecture Decision Records)
- Crea `docs/adr/` y registra decisiones relevantes (ej: elección de storage, librerías clave, PWA estrategia).
- Formato simple: contexto, decisión, alternativas, consecuencias.

## Reglas de actualización
- Todo cambio que afecte público (rutas, contratos, variables de entorno) debe actualizar docs en el PR.
- PR sin docs actualizadas puede bloquearse.

## Índice de documentación (docs/README.md)
Incluye enlaces a todas las fases y guías clave.

## Issues desde `tareas.md`
- Crea issues por fase/feature con criterios de aceptación.
- Etiquetas sugeridas: `phase:X`, `area:frontend`, `area:domain`, `good first issue`, `help wanted`.

## Verificación
- Nuevos contribuidores deben poder:
  - Clonar, instalar, ejecutar `dev`, correr `test`.
  - Encontrar la fase/guía relevante y avanzar sin bloquearse.
