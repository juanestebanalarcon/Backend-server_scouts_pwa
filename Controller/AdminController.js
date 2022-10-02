const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const {generateRandomPass} = require("../Helpers/randomPassowrd");
const Administrador = require("../Model/Administrador");
const bcrypt = require('bcryptjs');
const { mailOptions_, transporter } = require("../Helpers/EmailConfig");
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const logger = require("../Helpers/LoggerConfig");

const createAdmin= async(req,res=response)=>{
    let { email,ramasAsignadas } = req.body;
    try {  
        logger.info("CreateAdmin: started");
        let password = generateRandomPass(10);
        let administrador = await Administrador.findOne({ email })
        if( administrador ){logger.error(`CreateAdmin: Already exists an admin account with the specified email`);
        return res.status(400).json({ok: false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS})}
        administrador = new Administrador( req.body );
        administrador.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        ramasAsignadas.forEach(idRama => {administrador.ramasAsignadas.push(idRama);});
        await administrador.save();
        logger.info("CreateAdmin: finished creating admin");
        transporter.sendMail(mailOptions_(email,password,1,administrador.nombre),(err)=>{
            if(err){logger.error(`CreateAdmin: Internal mail server error: ${err}`);}
        });
        logger.info(`CreateAdmin: Sending email to ${email}`);
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {logger.error(`CreateAdmin: Internal server error: ${error}`);
    return res.status(500).json({ok:false,msg: RESPONSE_MESSAGES.ERR_500});}
    
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,email,rol}=req;
    const token= await generateJWT(id,nombre,email,rol);
    return res.status(200).json({ok:true,token,uid:id,nombre,email,rol});
}
const readAdmin= async(req,res=response)=>{
    try{
        logger.info("ReadAdmin: started");
        let admin_ = await Administrador.findById(req.params.id);
        logger.info("ReadAdmin: finding admin...");
        if(admin_){
            logger.info("ReadAdmin: sending admin found...");
            return res.status(200).json({ok:true,admin_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
        }
        
        logger.error(`ReadAdmin: admin not found`);
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`ReadAdmin: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readAdmins= async(req,res=response)=>{
    try{
        logger.info("ReadAdmins: started");
        let admins_ = await Administrador.find();
        logger.info("ReadAdmins: finding admins...");
        if(admins_){
            logger.info("ReadAdmins: sending admins found...");
            return res.status(200).json({ok:true,admins_});}
            logger.error(`ReadAdmins: admins not found`);
            return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        }catch(e)
        {
            logger.error(`ReadAdmins: Internal server error: ${e}`);
            return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
        }
    }
    const readAdminBranch = async(req, res=response)=>{
        try{
            logger.info("readAdminBranch: started");
            let admon = await Administrador.findById(req.params.id).populate('ramasAsignadas');
            logger.info("readAdminBranch: finding admin populated by associated branch...");
            if(!admon){
                logger.error(`readAdminBranch: admin not found`);
                return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND})}
                logger.info("ReadAdmins: sending admin populated by associated branch...");        
                return res.status(200).json({ok:true,admon,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
            }catch(err){
                logger.error(`readAdminBranch: Internal server error: ${e}`);
                return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
const updateAdmin=async(req,res=response)=>{
    try {
        let admin__ = await Administrador.findById( req.params.id );
        if ( !admin__ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Administrador.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    } catch (error) {
        console.log(error);
       return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const deleteAdmin =async(req,res=response)=>{
   try {   
        const admin_ = await Administrador.findById(req.params.id);
        if ( !admin_ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await admin_.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
       return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }

}
const loginAdmin= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const adminDB=await Administrador.findOne({email});
     if(!adminDB){
        return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})
     }
     const validPassword=bcrypt.compare(password,adminDB.password);
     if(!validPassword){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
     const token= await generateJWT(adminDB.id,adminDB.nombre,adminDB.email,1);
     return res.status(200).json({ok:true,uid:adminDB.id,nombre:adminDB.nombre,email,rol:1,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const changePassword = async (req, res)=>{
    try{
        let {newPassword,email} = req.body;
        const adminDB = await Administrador.findOne({email:email});
        if(!adminDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        let password =bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        adminDB.password = password;
        await adminDB.save();
        transporter.sendMail(mailOptions_(adminDB.email,newPassword,2,adminDB.nombre),(err)=>{
            if(err){console.log(err);}
            console.log("Envío exitoso");
        });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    console.log(e);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
module.exports={
    loginAdmin,
    createAdmin,
    readAdmin,
    readAdmins,
    readAdminBranch,
    updateAdmin,
    deleteAdmin,
    changePassword,
    revalidateToken

}