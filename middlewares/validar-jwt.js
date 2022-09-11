const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT=(req,next,res=response)=>{
    const token=req.header('TokenAuth');

    if(!token){
        return res.status(401).json({ok:false,msg:'Error: token no enviado.'});
    }
    try {
       const {uid,name,email}=jwt.verify(token,process.env.SECRET_JWT_SEED);
       req.uid=uid;
       req.name=name;
       req.email=email;
    } catch (error) {
        res.status(401).json({ok:false,msg:'Token no válido.'})
    }
    next();
}

module.exports={
    validarJWT
}