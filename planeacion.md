# MathRaining

Objetivos 
    Plataforma de práctica por repeticioń en matemáticas. 
    Un enfoque estetico y adictivo, simple pero elegante.
    Plataforma gratis y libre. Pedir donaciones.

Estructura de la aplicación


## Paginas
    - Página de selección de categorías (aritmetica, algebra, calculo, etc) /categories
    - Página de la categoría seleccionada  /$nombre_de_la_categoría$
      - menú de examenes dentro de una categoría  /$nombre_de_la_categoría$/test
      - menú de juegos dentro de una categoría  /$nombre_de_la_categoría$/games
      - menú de práctica dentro de una categoría /$nombre_de_la_categoría$/practice
      - menu de configuración y atajos sobre los juegos u práctica de una categoría /$nombre_de_la_categoría$/configuration
    - Página de about de la página /rainingmath/about
    - Página de donaciones /rainingmath/donations
    
## Flujo del programa
  

## Backend
  Cada categoría tendrá una carpeta $nombre_de_la_categoría$ dónde estará lo siguiente
    
    handleler función que manejará la entrada y salida de información del backend de esta categoría, se comunicará con el frontent.
    Cada handler tendrá parametros especificos de entrada.
    
    Carpetas de cada tema (subcategoría) de $nombre_de_la_categoría$ (ejemplo, si $nombre_de_la_categoría$ es álgebra, una carpeta puede ser polinomios binarios), dentro de cada carpeta habrá lo siguiente
      problem_generator, generará problema y respuesta.
      level_configuration, tendrá la configuración para los niveles en el juego de esa categoría.
      configuration tendrá las opciones de configuración para la construcción del menú de configuración en el frontend.



## Frontent 
Componente base_box  
  Box del 100% que  tenga el 100% de la altura de la página y variable el ancho según el dispositivo.

Componente base_header
  Box que irá dentro de base_box.
  Usará un header_height% de la altura de la página.
  Tendrá botónes de funcionalidad de la página, todos serán iconos. volver al menú principal (casita), github(icono github), donaciones(icono donaciones), about(icono signo de interrogación), cambiar tema (icono de sol o luna), activar-desactivar teclado (icono de teclado, solo funciona cuándo se está dentro de una /$nombre_de_la_categoría$  )

Componente "options tab" (no sé que nombrep ponerle)
  aquí será un menú de tabs que se abrirá una vez se selecciones una categoría. tendrá cómo elementos solamente iconos. juegos( icono de espaditas ), practica (icono de pesa), configuración (tuerquitas), 

Componente base_content_box 
  Mostrará diferente contenido, según la tab seleccionada en la "options tab" 

  En caso de seleccionar juegos será (base_content_box game mode)
    Repartirá el espacio entre in_content_question_box, in_content_answer_box, in_content_keyboard_box. dependiendo de si keyboard es activado o no.

    Componente in_content_question_box (Tendrá cómo varaible keyboard cómo boolean.)
      Componente en base_content_box, un box que utilice "base_question_height" 

        Componente regular_question 
          Hijo de in_content_question_box pero modificado.
          Componente que contendrá el texto de una pregunta que recibirá de la función handleler de $nombre_de_la_categoría$
          Su disposición varía si tiene el keyboard está activado o no.
          Su disposición varía según el dispositvo (móvil o escritorio).

    Componente in_content_answer_box (Tendrá cómo varaible keyboard cómo boolean.)
      Componente base_content_box, un box que utilice "base_answer_height" 

        Componente regular_answer
          Hijo de in_content_answer_box pero modificado.
          Componente que mostrara el texto que mande la función handleler de $nombre_de_la_categoría$
          Su disposición varía si tiene el keyboard está activado o no.
          Su disposición varía según el dispositvo (móvil o escritorio).

    Componente in_content_keyboard_box (Tendrá cómo varaible keyboard cómo boolean.)
      Componente base_content_box, un box que utilice "base_keyboard_height" 
        Su disposición varía si tiene el keyboard está activado o no.
        Su disposición varía según el dispositvo (móvil o escritorio).
  
  En caso de seleccionar la tab práctica. 
    Lo anterior

  En caso de configuración
    (Box grande con valores configurables tanto de los tipos de problemas y demás que saldrán en la tab de practica)


## Funcionalidades 

Componente box_base  
  Capturara todas las entradas de teclado del usuario con una función que podrá ser llamada por otros componentes o funciones y obtener las entradas en tiempo real. 

Los componentes, question, answer y keyboard utilizarán todo el espacio en content_box. se repartirán mediantes porcentajes. ejemplo (30,30,40) signfica que question es 30% va a question, 30% a answer y 40% a keyboard. Lo anterior depende de si keyboard está activado o no, de no ser así, entonces se repartirá simplemente entre question y answer.


## Adicionales que tengo que refinar y colocar correctamente en lo anterior.

  En el menú de configuración, la primera sección será configuración general de esa categoría, después habrá una tabla con las subcategorías de esa categoría (ejemplo, suma,resta,división en la categoría aritmetica.) cada fila abrirá un menú dónde estarán sus opciones de configuración. los elementos de la tabla se activan o desactivan en caso de querer o no ese tema en la tab de práctica. 

  La zona de juego de una categoría se manejará por niveles. Hay que agregar una seccion en base_content_box game mode hay que agregar un nuevo componente que sea progress_information_box. Este componente tendrá lo siguiente en caso de estar en la tab de juegos; nivel, barra de tiempo restante para el problema | que determinará cuánto tiempo le queda al problema, progreso del nivel (5/10 en caso de llevar 5 puntos de 10 necesarios para pasar al siguiente nivel).
  En caso de sea prática, entonces podrá o no mostrarse lo anterior, pues también quiero que en la sección de práctica haya una opción para que sean "problemas infinitos" de un tema seleccionado, estos pueden ir aumentando de dificultad o no.

  Quiero que mejorar la estructura del problem generator y demás. para que tengan una opción de "dificultad" para poder configurarlo en la opción de práctica. 

  Un ejemplo de la lógica que quiero es: Suponiendo la categoría Aritmetica, quiero jugar, entonces el front hace la llamada al nivel 1 de esa categoría, el nivel 1 generará los problemas con parametros fijos, ejemplo (Dificultad 1, operaciones [suma,resta], 10 segundos por pregunta, multiplos de 5 y multiplos de 2 +1, 2 terminos) en este caso la dificultad define un intervalo de valores que toman los números, ejemplo dificultad 1 puedes ser numeros de 1 al 10. las operaciones son las operaciones que utilizará el problema. 

  De todo lo anterior haz que la dificultad sea simplemente una variable más y que su nombre sea intervalo de números o algo así. no la trates especialmente.

  En el menú de configuración podrás seleccionar la configuración de un nivel ya existente para trabajar solamente sobre esos problemas.

  Quiero que por ejemplo en aritmetica se puedan trabajar problemas cómo 5+10 pero tambien 10+9+19+2 ó inclusive 12(3+(100/5)) haz las opciones necesarias para eso.

  