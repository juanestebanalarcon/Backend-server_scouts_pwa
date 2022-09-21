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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    link_ficha_medica: {
        type: String,
        required: false,
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
    esActivo: {
        type: Boolean,
        required: true,
    },
    remaAsociada: {
        type: String,
        required: false,
    },
})

module.exports = model('Scout', ScoutSchema)