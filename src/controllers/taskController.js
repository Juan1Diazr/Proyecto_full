//Requerir modelo de tarea
const pool=require('../config/db'); 

//Listar Tareas 
const listarTareas=async(req,res)=>{
    try{
        const result=await pool.require('SELECT * FROM tareas');
        res.status(200).json(result.rows);
    }catch(error){
        console.error('Error al listar tareas:', error);
        res.status(500).json({ error: 'Error al listar tareas' });
    }
}


//Crear tareas
const crearTarea=async(req,res)=>{
    const {titulo, descripcion}=req.body;
    try{
        const result=await pool.query('INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *',[titulo, descripcion]);
        res.json(result.rows[0]);
    }catch(error){
       
        res.status(500).json({ error: error.message });
    }
};
//TODO-> ACTUALIZAR TAREA+
const actualizarTarea = async (req, res) => {
  try{
    const {id} = req.params;
    const {titulo, descripcion, estado} = req.body;
    const result = await pool.query
        ('UPDATE tareas SET titulo=$1, descripcion=$2, estado=$3 WHERE id=$4 RETURNING *',
        [titulo, descripcion, estado, id]);
      res.json(result.rows[0]);
  } catch(error){
      console.error('Error al actualizar tarea:', error);
      res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};
//DELETE TAREA
const eliminarTarea = async (req, res) => {
  try{  
    const {id} = req.params;
    await pool.query('DELETE FROM tareas WHERE id=$1', [id]);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch(error){
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ error: 'Error al eliminar tarea' });
  }

};



//Exportar Controlador de tareas
module.exports={listarTareas, crearTarea, actualizarTarea, eliminarTarea};



// docker compose up --build
