

---

# **MathRaining – Especificación Funcional y Arquitectura**

## **1. Objetivos del Sistema**

* Plataforma de práctica por repetición en matemáticas.
* Enfoque estético, adictivo, simple y elegante.
* Totalmente libre y gratuita, con opción de donaciones a Ko-fi.
* Persistencia local del progreso mediante carpeta seleccionada por el usuario.
* Compatible offline y PWA instalable.
* Soporta múltiples perfiles y configuraciones de práctica por categoría.
* Estadísticas avanzadas, logros, rachas y sistema de recompensas.

---

## **2. Estructura de la Aplicación**

### **2.1 Rutas y Páginas**

| Ruta                                | Descripción                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `/`                                 | Dashboard inicial. Botones: “Seguir sin sesión”, “Seleccionar carpeta”, “Crear carpeta”, menú de selección de categorías. |
| `/categories`                       | Página de selección de categorías.                                                                                        |
| `/$nombre_categoria$/`              | Página principal de la categoría, con opciones: Juegos, Práctica, Configuración, Profile.                                 |
| `/$nombre_categoria$/games`         | Zona de juego de la categoría.                                                                                            |
| `/$nombre_categoria$/practice`      | Zona de práctica de la categoría.                                                                                         |
| `/$nombre_categoria$/configuration` | Configuración general y presets de práctica.                                                                              |
| `/$nombre_categoria$/profile`       | Perfil de usuario, logros, estadísticas gráficas.                                                                         |
| `/about`                            | Información del sitio.                                                                                                    |
| `/donations`                        | Página de donaciones (Ko-fi).                                                                                             |

---

### **2.2 Flujo General**

1. Al iniciar, se verifica si hay carpeta de perfil:

   * Si existe → se carga el perfil global y categoría seleccionada.
   * Si no existe → se ofrece crear nueva carpeta o seleccionar existente, mostrando mini-texto explicativo con pros y contras.

2. Selección de perfil:

   * Menú desplegable de perfiles ASCII.
   * Cada perfil tiene carpeta propia:

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
   * Cada archivo incluye `schemaVersion` para futuras migraciones.

3. Modo de uso:

   * **Demo rápida** → funcional pero no guarda nada en la carpeta local.
   * **Con progreso** → requiere carpeta seleccionada; guarda todo en YAML.

---

## **3. Backend**

### **3.1 Subcategorías y Problem Generators**

* Cada subcategoría tiene su **Problem Generator**:

  * Recibe parámetros de preset o nivel.
  * Genera `{ question, answer, meta }` donde `meta` incluye tiempo sugerido, subcategoría, etc.
  * Permite expresiones complejas según la lógica de cada subcategoría.
* **Solution Verificator**:

  * Función específica por subcategoría.
  * Recibe `respuesta_usuario` y `answer` del generador.
  * Devuelve `True`/`False`.
  * Maneja caracteres válidos, aproximaciones, símbolos matemáticos.

### **3.2 Parámetros del problem generator**

* Cuota vs peso (mutuamente excluyentes).
* Tiempo por problema → usado para porcentaje de tiempo consumido.
* Subcategorías incluidas, número de problemas, dificultad implícita.
* Configuraciones adicionales desde presets de práctica.

### **3.3 Persistencia**

* Archivos YAML legibles por humanos.
* Estadísticas incluyen: promedio, desviación estándar, varianza, conteo n.
* Histórico por tiempo (por sesión y día).
* Racha calculada considerando máximo 24 horas entre primer y último problema del streak.

---

## **4. Frontend**

### **4.1 Componentes Base**

1. **base\_box** → contenedor principal (100% altura, ancho variable).
2. **base\_header** → iconos:

   * Casita → menú principal
   * GitHub
   * Donaciones
   * About
   * Tema (sol/luna)
   * Teclado → activable/desactivable
   * Perfil (personita)
3. **options\_tab** → pestañas de Juegos, Práctica, Configuración.
4. **base\_content\_box** → despliega contenido según tab.

### **4.2 Componentes de Juego/Práctica**

* **in\_content\_question\_box** → muestra pregunta (KaTeX).
* **in\_content\_answer\_box** → zona de respuesta, caracteres inválidos ignorados.
* **in\_content\_keyboard\_box** → teclado matemático configurable.
* **progress\_information\_box** → muestra nivel, barra de tiempo restante, progreso, racha.
* **pausa** → icono en `progress_information_box`; congela temporizador sin afectar logs.

### **4.3 Profile / Estadísticas**

* Estadísticas gráficas por categoría, subcategoría y nivel.
* Historial configurable.
* Logros y badges.
* Rachas basadas en tiempo de resolución y continuidad diaria.

---

## **5. Funcionalidades Adicionales**

* Atajos de teclado configurables y conflictivos con navegador → aviso.
* Modo offline → PWA, cache de assets, funcionalidad completa excepto acceso a carpeta si no soporta File System Access API.
* Configuraciones de práctica exportables/importables.
* KaTeX para renderizado de preguntas.
* Tema claro/oscuro, opción de reducir animaciones.
* Multilenguaje: inglés, español, chino.

---

## **6. Lógica de Timeout y Respuesta**

* Timeout dispara función de comportamiento múltiple → por defecto: mostrar respuesta y pasar a siguiente.
* Respuesta ingresada vía teclado físico o virtual.
* `solution_verificator` se encarga de validar.
* Rachas y porcentaje de tiempo usado se calculan automáticamente.

---

## **7. Configuración y Presets**

* Presets de práctica permiten:

  * Subcategorías, número de problemas, tiempo, cuotas/pesos, mostrar progress box, teclado on/off.
  * Acciones: duplicar, renombrar, eliminar, fijar, exportar/importar.

---

## **8. Niveles Personalizados**

* Solo existen como **presets nombrados**.
* Aparecen en lista de configuración y práctica, no como niveles separados.

---

## **9. Logros y Recompensas**

* Completar nivel X
* Mantener racha Y
* Resolver Z problemas bajo T% de tiempo
* Pantalla con badges gráficos.

---

## **10. Seguridad y Privacidad**

* No se recopila telemetry ni analytics.
* Eliminación de perfil → manual, instrucciones al usuario.
* Datos sensibles almacenados localmente, sin transmisión.

---

## **11. Donaciones**

* Página de donaciones → Ko-fi, link externo.

---
