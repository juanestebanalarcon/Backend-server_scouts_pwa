const jwt=require('jsonwebtoken');

const generateJWT=(id,nombre,email)=>{
    return new Promise((resolve,reject)=>{
        const payload={id,nombre,email};
        jwt.sign(payload,process.env.SECRET_JWT_SEED,{
            expiresIn:'8h'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject(err);
            } 
            resolve(token);
        })
    });
}
module.exports={
    generateJWT
}    