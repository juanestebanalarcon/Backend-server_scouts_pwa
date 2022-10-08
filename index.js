require('dotenv').config();
const { dbConnection } = require('./Database/config');
const Server = require('./Model/Server');
const server = new Server();
dbConnection();
server.listen();