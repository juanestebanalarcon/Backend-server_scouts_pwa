const { Schema, model } = require('mongoose');

const AcudienteSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fecha_nacimiento: {
        type: String,
        required: true,
    },
    celular: {
        type: String,
        required: true,
    },
    link_imagen:{type: String, required: false},
    Scout:{
        type: Array,
        ref:"Scout",    
        required: false,
    }
})

module.exports = model('Acudiente', AcudienteSchema)