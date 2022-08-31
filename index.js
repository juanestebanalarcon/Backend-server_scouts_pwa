const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

const app = express();

dbConnection();

app.use(cors());

app.use( express.static('public'))

app.use( express.json() );

app.use(`${process.env.BASE_URL}/scouts`, require('./routes/Scouts'));
app.use(`${process.env.BASE_URL}/admin`, require('./routes/Administrador'));
app.use(`${process.env.BASE_URL}/superAdmin`, require('./routes/SuperAdmin'));
app.use(`${process.env.BASE_URL}/rama`, require('./routes/Rama'));
app.use(`${process.env.BASE_URL}/canal`, require('./routes/Canal'));
app.use(`${process.env.BASE_URL}/evento`, require('./routes/Evento'));
app.use(`${process.env.BASE_URL}/publicaciones`, require('./routes/Publicaciones'));

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`)
} )
