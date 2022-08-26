const { Schema, model } = require('mongoose');

const ScoutSchema = Schema({

    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    fecha_nacimiento: {
        type: String,
        required: true,
    },
    ciudad_residencia: {
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

})

module.exports = model('Scout', ScoutSchema)