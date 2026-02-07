const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// CONFIGURACIÓN DE SUPABASE
// Reemplaza estos valores con los que copiaste de Supabase Settings > API
const SUPABASE_URL = 'https://manavfxaoxsyzhqbodnn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vwKh38eGDCcqNLasW4FWuQ_pKZLCl-A';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Ver todas las tareas (GET)
app.get('/tareas', async (req, res) => {
    const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('id', { ascending: true });

    if (error) return res.status(500).json(error);
    res.json(data);
});

// 2. Crear una tarea (POST)
app.post('/tareas', async (req, res) => {
    const { titulo } = req.body;
    const { data, error } = await supabase
        .from('tareas')
        .insert([{ titulo, completada: false }])
        .select();

    if (error) return res.status(500).json(error);
    res.json(data[0]);
});

// 3. Borrar una tarea (DELETE)
app.delete('/tareas/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json(error);
    res.json({ mensaje: "Tarea eliminada correctamente" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en línea en el puerto ${PORT}`);
});

