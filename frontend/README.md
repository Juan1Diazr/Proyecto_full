page.jsx -> listas de las tareas  
add/page.jsx -> Formulario para agregar tareas  
layout -> Navbar + estilos globales, footer, etc...

- interface Task {...}  
- useState<Tarea[]> -> indica que el estado es un arreglo de tareas Task[],no un arreglo vacio generico
- axios.get<Tarea[]>()-> le dice a axios: esta peticion devuelve un array de tarea
- t.descripcion - > ahora  Vs code sabes que t es una tarea reconoce titulo,descripcion etc.......
-