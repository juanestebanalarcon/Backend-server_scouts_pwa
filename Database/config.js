const mongoose = require('mongoose');
const logger = require('../Helpers/LoggerConfig');

const dbConnection = async() => {
    try {
        mongoose.connect(process.env.DB_CONNECTION_TEST,{useNewUrlParser: true,useUnifiedTopology: true});
        logger.info('Connected to Mongo database');
    } catch (error) {
        logger.error(`Error connecting to Mongo database: ${error}`);
       throw new Error('Error occurred while trying to initialize DB', error);
    }
}
module.exports = {dbConnection} 