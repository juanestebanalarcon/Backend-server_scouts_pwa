const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        mongoose.connect(process.env.DB_CNNECTION,{useNewUrlParser: true,useUnifiedTopology: true});
        console.log('DB Online')
    } catch (error) {
       console.log(error); 
       throw new Error('Error a la hora de inicializar la BD', error);
    }
}
module.exports = {dbConnection}