const cors = require('cors');
const express = require('express');

class Server {
    constructor(){
        this.app  = express();
        this.port = process.env.PORT;
        this.ScoutsPath='scouts';
        this.AcudientesPath='acudientes';
        this.AdminPath='admin';
        this.SuperAdmPath='superAdmin';
        this.RamaPath='rama';
        this.CanalPath='canal';
        this.EventoPath='evento';
        this.PublicacionesPath='publicaciones';
        this.middlewares();
        this.routes();
    }
    routes(){
        this.app.use(`${process.env.BASE_URL}/${this.ScoutsPath}`, require('../Routes/Scouts'));
        this.app.use(`${process.env.BASE_URL}/${this.AcudientesPath}`, require('../Routes/Acudiente'));
        this.app.use(`${process.env.BASE_URL}/${this.AdminPath}`, require('../Routes/Administrador'));
        this.app.use(`${process.env.BASE_URL}/${this.SuperAdmPath}`, require('../Routes/SuperAdmin'));
        this.app.use(`${process.env.BASE_URL}/${this.RamaPath}`, require('../Routes/Rama'));
        this.app.use(`${process.env.BASE_URL}/${this.CanalPath}`, require('../Routes/Canal'));
        this.app.use(`${process.env.BASE_URL}/${this.EventoPath}`, require('../Routes/Evento'));
        this.app.use(`${process.env.BASE_URL}/${this.PublicacionesPath}`, require('../Routes/Publicaciones'));
    }
    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
    middlewares(){
    this.app.use( cors() );
    this.app.use( express.json() );
    this.app.use( express.static('public') );
    }
}
module.exports = Server;
