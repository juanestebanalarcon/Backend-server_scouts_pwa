const { Schema, model } = require('mongoose');

const Rama = Schema({
nombre: {
    type: String,
    required:true
},
linkImagen: {
    type: String,
    required:false
},
edadMax:{
    type: Number,
    required: true
},
edadMin:{
    type: Number,
    required: true
},
Scout: {
    type: Array,
    ref:"Scout",
    required:false
},
})
module.exports = model("Rama",Rama)
