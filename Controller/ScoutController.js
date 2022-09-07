const {response}=require('express');
const Scout = require('../Model/Scout');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');

const createScout = async(req,res=response) => {
    const {nombre,email,password}=req.body;
    try {
        const scout=await Scout.findOne({email});
        if(scout){
            return res.status(400).json({ok:false,msg:"El Scout ya existe con ese email."});
        }
        let dbScout=new Scout(req.body);

        const salt=bcrypt.genSaltSync();
        dbScout.password=bcrypt.hashSync(password,salt);
        const token= await generateJWT(dbScout.id,nombre);
        await dbScout.save();
        return res.status(201).json({ok:true,uid:dbScout.id,nombre,email,token});

    } catch (error) {       
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error interno del servidor.'
        });
    }
    

}
const readScouts= async(req,res=response)=>{
    try{
        const scouts_ = await Scout.find({});
        if(scouts){
            return res.status(200).json({
                ok:true,
                scouts_ 
            });
            
        }else{
            return res.status(404).json({
                ok:false,
                msg:"Not found"
            });

        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const readScout= async(req,res=response)=>{
    const uid=req.params.uid;
    try{
        const scouts_ = await Scout.findById(uid);
        if(scouts){
            return res.status(200).json({
                ok:true,
                scouts_ 
            });
            
        }else{
            return res.status(404).json({
                ok:false,
                msg:"Not found"
            });

        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

const loginScout= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const scoutDB=await Scout.findOne({email});
     if(!scoutDB){
         res.status(400).json({ok:false,msg:'El correo no existe.'})
     }
     const validPassword=bcrypt.compareSync(password,scoutDB.password);
     if(!validPassword){
        res.status(400).json({ok:false,msg:'La password no es válida.'})
     }
     //Generar JWT
     const token= await generateJWT(scoutDB.id,scoutDB.nombre,scoutDB.email);
     //Respuesta del servicio
     return res.json({ok:true,uid:scoutDB.id,name:scoutDB.nombre,email,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

const revalidateToken= async(req,res) => {
    const {uid}=req;
    const dbScout=await Scout.findById(uid);
    const token= await generaTEJWT(uid,dbScout.nombre);
    return res.json({
        ok:true,
        uid,
        name:dbScout.nombre,
        email:dbScout.email,
        token
    });
}
const updateScout= async(req,res=response) =>{
    
    try{
        const uid = req.params.id;
        const scoutDb = Scout.findById(uid);
        if(!scoutDb){
            return res.status(404).json({ok:false,msg:"No existe usuario por ese uid."});
        }
        const {password,email,...campos} = req.body;
        if(scoutDb.email===email){
            delete campos.email;
        }else{
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({ok:false,msg:"Ya existe scout con ese email"});
            }
        }
        campos.email=email;
        const scoutUpdate = await Scout.findByIdAndUpdate(uid,campos,{new:true});

        res.status(200).json({ok:true,scoutUpdate})
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
        
    }
}

const deleteScout = async (req,res=response) =>{
    try{
        const uid = req.params.id;
        const scoutDB = Scout.findById(uid);
        if(!scoutDB){
            return res.status(404).json({ok:false,msg:"No existe scout por ese uid."});
        }else{
            await Scout.findByIdAndDelete(uid);
            res.status(200).json({ok:true,msg:"Scout eliminado."});
        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})

    }
}

module.exports={
    createScout,
    readScouts,
    readScout,
    updateScout,
    deleteScout,
    loginScout,
    revalidateToken
}