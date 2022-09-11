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