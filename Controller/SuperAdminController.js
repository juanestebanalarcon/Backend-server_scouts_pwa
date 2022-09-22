const {response}=require('express');
const SuperAdministrador = require('../Model/SuperAdministrador');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');

const createSuperAdministrador = async(req,res=response) => {
    let {nombre,email,password}=req.body;
    try {
        let superAdmn=await SuperAdministrador.findOne({email});
        if(superAdmn){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        let dbSuperAdministrador=new SuperAdministrador(req.body);
        dbSuperAdministrador.password=bcrypt.hashSync(password,bcrypt.genSaltSync());
        const token= await generateJWT(dbSuperAdministrador.id,nombre);
        await dbSuperAdministrador.save();
        return res.status(201).json({ok:true,_id:dbSuperAdministrador.id,nombre,email,token});

    } catch (error) {       
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readSuperAdministradors= async(req,res=response)=>{
    let {email}=req.body;
    try{
        let SuperAdministradors_ = await SuperAdministrador.find({email});
        if(SuperAdministradors){return res.status(200).json({ok:true,SuperAdministradors_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readSuperAdministrador= async(req,res=response)=>{
    const _id=req.params.id;
    try{
        const SuperAdministrador_ = await SuperAdministrador.findById(_id);
        if(SuperAdministradors){return res.status(200).json({ok:true,SuperAdministrador_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}

const loginSuperAdministrador= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const SuperAdministradorDB = await SuperAdministrador.findOne({email});
     if(!SuperAdministradorDB){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
     const validPassword=bcrypt.compareSync(password,SuperAdministradorDB.password);
     if(!validPassword){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD});}
     const token= await generateJWT(SuperAdministradorDB.id,SuperAdministradorDB.nombre,SuperAdministradorDB.email,1);
     return res.status(200).json({ok:true,uid:SuperAdministradorDB.id,name:SuperAdministradorDB.nombre,email,rol:1,token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,email,rol}=req;
    const token= await generateJWT(id,nombre,email,rol);
   return res.status(200).json({ok:true,token});
}
const updateSuperAdministrador= async(req,res=response) =>{
    try{
        let id = req.params.id;
        const SuperAdministradorDb = SuperAdministrador.findById(id);
        if(!SuperAdministradorDb){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await SuperAdministrador.updateOne({_id:id}, {...req.body}, { upsert: true });
        res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
        
    }
}

const deleteSuperAdministrador = async (req,res=response) =>{
    try{
        const uid = req.params.id;
        const SuperAdministradorDB = SuperAdministrador.findById(uid);
        if(!SuperAdministradorDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await SuperAdministrador.findByIdAndDelete(uid);
        res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})

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