const { Schema, model } = require('mongoose');

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
    id:{type:String},
    nombre:{type:String},
    apellido:{type:String},
},
ramaAsignada: {
    type:Array,
    ref:'Rama',
    required:false
},
fecha: {
    type: Date,
    required:true
},
isGeneral: {type: Boolean,required:false}
})
module.exports = model("Publicaciones",Publicaciones)
