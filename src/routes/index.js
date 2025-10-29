const express = require('express');
const router=express.Router();
const {listarTareas,crearTarea,actualizarTarea,eliminarTarea}=require('../controllers/taskController');

//Definir las rutas para las tareas

//Ruta GET para listar todas las tareas
router.get('/tasks', listarTareas);

//Ruta POST para crear una nueva tarea
router.post('/tasks', crearTarea);

//Ruta PUT para actualizar una tarea existente
router.put('/tasks/:id', actualizarTarea);

//Ruta DELETE para eliminar una tarea existente
router.delete('/tasks/:id', eliminarTarea);

module.exports=router;