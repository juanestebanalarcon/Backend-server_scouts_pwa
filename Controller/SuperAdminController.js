const {response}=require('express');
const SuperAdministrador = require('../Model/SuperAdministrador');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');

const createSuperAdministrador = async(req,res=response) => {
    const {nombre,email,password}=req.body;
    try {
        const superAdmn=await SuperAdministrador.findOne({email});
        if(superAdmn){
            return res.status(400).json({ok:false,msg:"El SuperAdministrador ya existe con ese email."});
        }
        let dbSuperAdministrador=new SuperAdministrador(req.body);

        const salt=bcrypt.genSaltSync();
        dbSuperAdministrador.password=bcrypt.hashSync(password,salt);
        const token= await generateJWT(dbSuperAdministrador.id,nombre);
        await dbSuperAdministrador.save();
        return res.status(201).json({ok:true,uid:dbSuperAdministrador.id,nombre,email,token});

    } catch (error) {       
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error interno del servidor.'
        });
    }
    

}
const readSuperAdministradors= async(req,res=response)=>{
    const {email}=req.body;
    try{
        const SuperAdministradors_ = await SuperAdministrador.find({email});
        if(SuperAdministradors){
            return res.status(200).json({
                ok:true,
                SuperAdministradors_ 
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
const readSuperAdministrador= async(req,res=response)=>{
    const uid=req.params.uid;
    try{
        const SuperAdministradors_ = await SuperAdministrador.findById(uid);
        if(SuperAdministradors){
            return res.status(200).json({
                ok:true,
                SuperAdministradors_ 
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

const loginSuperAdministrador= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const SuperAdministradorDB=await SuperAdministrador.findOne({email});
     if(!SuperAdministradorDB){
         res.status(400).json({ok:false,msg:'El correo no existe.'})
     }
     const validPassword=bcrypt.compareSync(password,SuperAdministradorDB.password);
     if(!validPassword){
        res.status(400).json({ok:false,msg:'La password no es válida.'})
     }
     const token= await generateJWT(SuperAdministradorDB.id,SuperAdministradorDB.nombre,SuperAdministradorDB.email);
     return res.json({ok:true,uid:SuperAdministradorDB.id,name:SuperAdministradorDB.nombre,email,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

const revalidateToken= async(req,res) => {
    const {uid}=req;
    const dbSuperAdministrador=await SuperAdministrador.findById(uid);
    const token= await generaTEJWT(uid,dbSuperAdministrador.nombre);
    return res.json({
        ok:true,
        uid,
        name:dbSuperAdministrador.nombre,
        email:dbSuperAdministrador.email,
        token
    });
}
const updateSuperAdministrador= async(req,res=response) =>{
    
    try{
        const uid = req.params.id;
        const SuperAdministradorDb = SuperAdministrador.findById(uid);
        if(!SuperAdministradorDb){
            return res.status(404).json({ok:false,msg:"No existe usuario por ese uid."});
        }
        const {password,email,...campos} = req.body;
        if(SuperAdministradorDb.email===email){
            delete campos.email;
        }else{
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({ok:false,msg:"Ya existe SuperAdministrador con ese email"});
            }
        }
        campos.email=email;
        const SuperAdministradorUpdate = await SuperAdministrador.findByIdAndUpdate(uid,campos,{new:true});

        res.status(200).json({ok:true,SuperAdministradorUpdate})
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
        
    }
}

const deleteSuperAdministrador = async (req,res=response) =>{
    try{
        const uid = req.params.id;
        const SuperAdministradorDB = SuperAdministrador.findById(uid);
        if(!SuperAdministradorDB){
            return res.status(404).json({ok:false,msg:"No existe SuperAdministrador por ese uid."});
        }else{
            await SuperAdministrador.findByIdAndDelete(uid);
            res.status(200).json({ok:true,msg:"SuperAdministrador eliminado."});
        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})

    }
}

module.exports={
    createSuperAdministrador,
    readSuperAdministradors,
    readSuperAdministrador,
    updateSuperAdministrador,
    deleteSuperAdministrador,
    loginSuperAdministrador,
    revalidateToken
}