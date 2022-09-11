const { response } = require("express");
const {validationResult} = require("express-validator");
const validarCampos = (req,next,res=response)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){res.status(400).json({ok:false,errors:errors.mapped()        })}
    next();
}
module.exports={validarCampos}