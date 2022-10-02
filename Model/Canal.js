const { Schema, model } = require('mongoose');

const Canal = Schema({
nombre: {
    type: String,
    required:true
},
ramaAsignada: {
    type: Array,
    ref:'Rama',
    required:false
},
linkImagen: {
    type: String,
    required:true
},
publicacion:{
    type: Array,
    ref:"Publicaciones",
    required:true
}
})
module.exports = model("Canal",Canal)
