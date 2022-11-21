/*
@author Ascent
Backend developer: Juan Esteban Alarcón
*/

require('dotenv').config();
const { dbConnection } = require('./Database/config');
const Server = require('./Model/Server');
const server = new Server();
dbConnection();
server.startService();
