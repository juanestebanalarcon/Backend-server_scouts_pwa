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
    id:{type:String},
    nombre:{type:String},
    apellido:{type:String},
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
    ref:"Rama",
    required:false
},
inscritos:{
    type: Array,
    ref:"Scout",
    required:false
},
isGeneral: {type: Boolean,required:false}
})
module.exports = model("Evento",Evento)
