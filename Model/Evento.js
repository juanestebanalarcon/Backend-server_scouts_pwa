const { Schema, model } = require('mongoose');

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
    type: Date,
    required:true
},
fechaYHoraFinal: {
    type: Date,
    required:true
},
ramaAsignada: {
    type:Array,
    ref:'Rama',
    required:false
},
inscritos:{
    type: Array,
    ref:"Scout",
    required:true
}
})
module.exports = model("Evento",Evento)
