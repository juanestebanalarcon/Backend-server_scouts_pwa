require('dotenv').config();
const { dbConnection } = require('./database/config');
const Server = require('./Model/Server');
const server = new Server();
dbConnection();
server.listen();