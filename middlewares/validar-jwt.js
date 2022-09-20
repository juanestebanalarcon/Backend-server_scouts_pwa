const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT=(req,res=response,next)=>{
    const token=req.header('x-token');
    if(!token){return res.status(401).json({ok:false,msg:'Error: token no enviado.'});}
    try {
       const {id,nombre,email,rol}=jwt.verify(token,process.env.SECRET_JWT_SEED);
       req.id=id;
       req.nombre=nombre;
       req.email=email;
       req.rol=rol;
       next();
    } catch (error) {
        res.status(401).json({ok:false,msg:'Token no válido.'})
    }
}
module.exports={
    validarJWT
}