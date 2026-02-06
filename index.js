const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();


app.use(express.json()); // Para que el backend entienda JSON
app.use(express.static('public')); // Esto sirve archivos desde una carpeta llamada 'public'


// Conexión a la base de datos (se creará el archivo datos.db automáticamente)
const db = new sqlite3.Database('./datos.db', (err) => {
    if (err) return console.error("Error:", err.message);
    console.log("¡Éxito! Conectado a la base de datos SQLite.");
});


// Crear la tabla de tareas
db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    completada INTEGER DEFAULT 0
)`);


// Ruta para VER las tareas
app.get('/tareas', (req, res) => {
    db.all("SELECT * FROM tareas", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});


// Ruta para CREAR una tarea
app.post('/tareas', (req, res) => {
    const { titulo } = req.body;
    db.run(`INSERT INTO tareas (titulo) VALUES (?)`, [titulo], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ id: this.lastID, titulo, completada: 0 });
    });
});


// Ruta para BORRAR una tarea (Delete)
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM tareas WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).send(err.message);
        res.json({ mensaje: "¡Tarea borrada!", filas_afectadas: this.changes });
    });
});


// Ruta para BUSCAR tareas por nombre
app.get('/tareas/buscar/:texto', (req, res) => {
    const busqueda = req.params.texto;
    // El % permite buscar coincidencias parciales
    const sql = `SELECT * FROM tareas WHERE titulo LIKE ?`;
    const termino = `%${busqueda}%`;

    db.all(sql, [termino], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});


// Ruta para CONTAR cuántas tareas hay en total
app.get('/tareas/total', (req, res) => {
    const sql = "SELECT COUNT(*) AS total FROM tareas";
    
    db.get(sql, [], (err, row) => {
        if (err) return res.status(500).send(err.message);
        // row.total contiene el resultado de la cuenta
        res.json({ mensaje: `Tienes un total de ${row.total} tareas` });
    });
});


//app.listen(3000, () => {
//    console.log("Servidor backend corriendo en http://localhost:3000");
///});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});