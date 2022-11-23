/*
@author Ascent
Backend developer: Juan Esteban Alarcón
*/

const cors = require('cors');
const express = require('express');
const logger = require('../Helpers/LoggerConfig');
const https = require('https');
const fs = require('fs');

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
        this.ssl_certificate = './centinelapp_scoutscentinelas113cali_org.crt';
        this.ssl_certificate_key = './centinelapp.scoutscentinelas113.key'; 
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
    listen() {this.app.listen( this.port,'0.0.0.0', () => {logger.info(`Server running on port ${this.port} `);});}
    
    startService(){
        try {
            https.createServer({
                cert: fs.readFileSync(this.ssl_certificate),
                key: fs.readFileSync(this.ssl_certificate_key)
            },this.app).listen(this.port, () => {logger.info(`Server running on port ${this.port} with certificate`);})
        } catch (error) {
            logger.error(`Error ocurred while trying to run backend server: ${error}`);
        }
    }
    middlewares(){
    this.app.use( cors() );
    this.app.use( express.json() );
    this.app.use( express.static('public') );
    this.app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods: GET, POST, DELETE, PUT');
        next();
    });
    }
}
module.exports = Server;
