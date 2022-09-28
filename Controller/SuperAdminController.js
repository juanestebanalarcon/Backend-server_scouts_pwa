const {response}=require('express');
const SuperAdministrador = require('../Model/SuperAdministrador');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');
const { generateRandomPass } = require('../Helpers/randomPassowrd');

const createSuperAdministrador = async(req,res=response) => {
    let {nombre,email}=req.body;
    let password = generateRandomPass(10);
    try {
        let superAdmn=await SuperAdministrador.findOne({email});
        if(superAdmn){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        let dbSuperAdministrador=new SuperAdministrador(req.body);
        dbSuperAdministrador.password=bcrypt.hashSync(password,bcrypt.genSaltSync());
        const token= await generateJWT(dbSuperAdministrador.id,nombre);
        await dbSuperAdministrador.save();
        transporter.sendMail(mailOptions_(email,password,1,dbSuperAdministrador.nombre),(err)=>{if(err){console.log(err);}});
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,token});
    } catch (error) {       
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readSuperAdministradors= async(req,res=response)=>{
    try{
        let SuperAdministradors_ = await SuperAdministrador.find({});
        if(SuperAdministradors_){return res.status(200).json({ok:true,SuperAdministradors_,msg:RESPONSE_MESSAGES.SUCCESS_2XX });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readSuperAdministrador= async(req,res=response)=>{
    try{
        const SuperAdministrador_ = await SuperAdministrador.findById(req.params.id);
        if(SuperAdministradors){return res.status(200).json({ok:true,SuperAdministrador_, msg:RESPONSE_MESSAGES.SUCCESS_2XX });}
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
     const token= await generateJWT(SuperAdministradorDB.id,SuperAdministradorDB.nombre,SuperAdministradorDB.email,0);
     return res.status(200).json({ok:true,uid:SuperAdministradorDB.id,name:SuperAdministradorDB.nombre,email,rol:0,token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,email,rol}=req;
    const token= await generateJWT(id,nombre,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,email,rol});
}
const updateSuperAdministrador= async(req,res=response) =>{
    try{
        const SuperAdministradorDb = SuperAdministrador.findById(req.params.id);
        if(!SuperAdministradorDb){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await SuperAdministrador.updateOne({_id:req.params.id}, {...req.body}, { upsert: true });
       return  res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

const deleteSuperAdministrador = async (req,res=response) =>{
    try{
        const SuperAdministradorDB = SuperAdministrador.findById(req.params.id);
        if(!SuperAdministradorDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await SuperAdministrador.findByIdAndDelete(req.params.id);
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})

    }
}
const changePassword = async (req, res)=>{
    try{
        let {newPassword,email} = req.body;
        const superAdmin = await SuperAdministrador.findOne({email:email});
        if(!superAdmin){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        superAdmin.password = bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        await superAdmin.save();
        transporter.sendMail(mailOptions_(superAdmin.email,newPassword,2,superAdmin.nombre),(err)=>{
            if(err){console.log(err);}
        });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    console.log(e);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
module.exports={
    createSuperAdministrador,
    readSuperAdministradors,
    readSuperAdministrador,
    updateSuperAdministrador,
    deleteSuperAdministrador,
    loginSuperAdministrador,
    changePassword,
    revalidateToken
}