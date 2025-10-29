const express = require('express');
require('dotenv').config();
const pool = require('./src/config/db');

const app= express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// RUTA RAIZ
app.get('/', (req,res)=>{
    res.send("Servidor Node.js + Express +  PostgreSQL");   
})

//Importar usar rutas de usuarios
const rutas=require('./src/routes/userRoutes');
//1.Importar El enrutador de usuarios
//2.Usar el enrutador de usuarios con el prefijo /api/users
app.use('/api/users', rutas);  
//3.APP listen en el puerto definido
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});