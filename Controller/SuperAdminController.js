const {response}=require('express');
const SuperAdministrador = require('../Model/SuperAdministrador');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../Helpers/jwt');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');
const { generateRandomPass } = require('../Helpers/randomPassowrd');
const logger = require('../Helpers/LoggerConfig');
const { transporter, mailOptions_ } = require('../Helpers/EmailConfig');

const createSuperAdministrador = async(req,res=response) => {
    let password = generateRandomPass(10);
    try {
        let superAdmn=await SuperAdministrador.findOne({email:req.body.email});
        if(superAdmn){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
            let dbSuperAdministrador=new SuperAdministrador(req.body);
            dbSuperAdministrador.password=bcrypt.hashSync(password,bcrypt.genSaltSync());
            const token= await generateJWT(dbSuperAdministrador.id,dbSuperAdministrador.nombre,dbSuperAdministrador.apellido,dbSuperAdministrador.email,0);
            await dbSuperAdministrador.save();
            transporter.sendMail(mailOptions_(req.body.email,password,1,dbSuperAdministrador.nombre),(err)=>{if(err){logger.error(`CreateSuperAdmin: Internal mail server error: ${err}`);}});
            return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,token});
    } catch (error) {logger.error(`CreateSuperAdmin: Internal server error: ${error}`);
    return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
}
}
const readSuperAdministradors= async(req,res=response)=>{
    try{
        let SuperAdministradors_ = await SuperAdministrador.find( );
        if(SuperAdministradors_){return res.status(200).json({ok:true,SuperAdministradors_,msg:RESPONSE_MESSAGES.SUCCESS_2XX });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        }catch(e){
            logger.error(`ReadSuperAdmins: Internal server error: ${e}`);
            return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
        }
    }
    const readSuperAdministrador= async(req,res=response)=>{
        try{
            const SuperAdministrador_ = await SuperAdministrador.findById(req.params.id);
            if(SuperAdministrador_){return res.status(200).json({ok:true,SuperAdministrador_, msg:RESPONSE_MESSAGES.SUCCESS_2XX });}
            return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        }catch(e){
            logger.error(`ReadSuperAdmin: Internal server error: ${e}`);
            return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
        }
    }
    
    const loginSuperAdministrador= async(req,res=response) => {
        try {
            const SuperAdministradorDB = await SuperAdministrador.findOne({email:req.body.email});
            if(!SuperAdministradorDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
            if(!bcrypt.compareSync(req.body.password,SuperAdministradorDB.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD});}
            const token= await generateJWT(SuperAdministradorDB.id,SuperAdministradorDB.nombre,SuperAdministradorDB.apellido,SuperAdministradorDB.email,0);
            return res.status(200).json({ok:true,_id:SuperAdministradorDB.id,nombre:SuperAdministradorDB.nombre,apellido:SuperAdministradorDB.apellido,email:SuperAdministradorDB.email,rol:0,token});
        } catch(e) {
        logger.error(`loginSuperAdmin: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,apellido,email,rol}=req;
    const token= await generateJWT(id,nombre,apellido,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,apellido,email,rol});
}
const updateSuperAdministrador= async(req,res=response) =>{
    try{
        const SuperAdministradorDb = await SuperAdministrador.findById(req.params.id);
        if(!SuperAdministradorDb){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        if(req.body.email){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        await SuperAdministrador.updateOne({_id:req.params.id},{$set:{...req.body}}, { upsert: true });
       return  res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e){
        logger.error(`updateSuperAdmin: Internal server error: ${e}`);
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
        logger.error(`deleteSuperAdmin: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})

    }
}
const changePassword = async (req, res)=>{
    try{
        let {newPassword,currentPassword,email} = req.body;
        const superAdmin = await SuperAdministrador.findOne({email:email});
        if(!superAdmin){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        if(!bcrypt.compareSync(currentPassword,superAdmin.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
        superAdmin.password = bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        await superAdmin.save();
        transporter.sendMail(mailOptions_(superAdmin.email,newPassword,2,superAdmin.nombre),(err)=>{
            if(err){logger.error(`changePasswordSuperAdmin: Internal mail server error: ${err}`);}
        });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    logger.error(`changePasswordSuperAdmin: Internal server error: ${e}`);
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