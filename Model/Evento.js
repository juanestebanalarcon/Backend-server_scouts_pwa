const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const Evento = Schema({
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
fechaYHoraInicio: {
    type: DateOnly,
    required:true
},
fechaYHoraFinal: {
    type: DateOnly,
    required:true
},
ramaAsignada: {
    type:Array,
    ref:"Rama",
    required:false
},
inscritos:{
    type: Array,
    ref:"Scout",
    required:false
}
})
module.exports = model("Evento",Evento)
