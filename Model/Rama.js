const { Schema, model } = require('mongoose');

const Rama = Schema({
nombre: {
    type: String,
    required:true
},
linkImagen: {
    type: String,
    required:true
},
Scout: {
    type: Schema.Types.ObjectId,
    ref:"Scout",
    required:true
},
})
module.exports = model("Rama",Rama)
