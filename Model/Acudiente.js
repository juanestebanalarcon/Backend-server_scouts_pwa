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
    
})

module.exports = model('Acudiente', AcudienteSchema)