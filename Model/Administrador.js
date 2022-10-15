const { Schema, model } = require('mongoose');

const Administrador = Schema({
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
    password: {type: String,required: true,
    },
    ramasAsignadas:{
        type:Array,
        ref:"Rama",
        required:false
    }, 
    link_imagen:{type: String, required: false},
})
module.exports = model("Administrador",Administrador)
