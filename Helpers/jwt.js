const jwt=require('jsonwebtoken');

const generateJWT=(uid,name,email,rol)=>{
    const payload={uid,name,email,rol};
    
    return new Promise((resolve,reject)=>{
        
        jwt.sign(payload,process.env.SECRET_JWT_SEED,{
            expiresIn:'96h'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve(token)
            }
        })
    });
    
}
module.exports={
    generateJWT
}