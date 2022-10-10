const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const Publicaciones = Schema({
titulo: {
    type: String,
    required:true
},
descripcion: {
    type: String,
    required:true
},
linkImagen: {
    type: String,
    required:true
},
autor: {
    type: String,
    required:true
},
ramaAsignada: {
    type:Array,
    ref:'Rama',
    required:false
},
fecha: {
    type: DateOnly,
    required:true
},
})
module.exports = model("Publicaciones",Publicaciones)
