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
        logger.info("CreateAdmin: create admin finished");
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
            }catch(e){
                logger.error(`readAdminBranch: Internal server error: ${e}`);
                return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
            }
const updateAdmin=async(req,res=response)=>{
    try {
        logger.info("updateAdmin: started");
        let admin__ = await Administrador.findById( req.params.id );
        logger.info("updateAdmin: finding admin to update...");
        if ( !admin__ ) {
            logger.error(`updateAdmin: admin not found`);
            return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
            logger.info("updateAdmin: updating admin found...");
            await Administrador.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
            return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
        } catch (e) {
            logger.error(`updateAdmin: Internal server error: ${e}`);
            return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
        }
                }
const deleteAdmin =async(req,res=response)=>{
    try {   
        logger.info("deleteAdmin: started");
        const admin_ = await Administrador.findById(req.params.id);
        if ( !admin_ ) {
            logger.error(`deleteAdmin: admin not found`);
            return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
            logger.info("deleteAdmin: deleting admin found...");
            await admin_.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`deleteAdmin: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
            }
            
        }
const loginAdmin= async(req,res=response) => {
    logger.info("loginAdmin: started");
    const {email,password}=req.body;
    try {
        const adminDB=await Administrador.findOne({email});
        logger.info("loginAdmin: finding admin by email");
        if(!adminDB){
            logger.error("loginAdmin: admin email not found");
            return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})
        }
        const validPassword=bcrypt.compare(password,adminDB.password);
        if(!validPassword){
            logger.error("loginAdmin: admin password is incorrect");
            return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
            logger.info("loginAdmin: building admin token");
            const token= await generateJWT(adminDB.id,adminDB.nombre,adminDB.email,1);
            logger.info("loginAdmin: sending admin login info");
            return res.status(200).json({ok:true,uid:adminDB.id,nombre:adminDB.nombre,email,rol:1,token})
        } catch (e) {
            logger.error(`loginAdmin: Internal server error: ${e}`);
            return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
        }
    }
const changePassword = async (req, res)=>{
    try{
        logger.info("changePasswordAdmin: started");
        let {newPassword,email} = req.body;
        const adminDB = await Administrador.findOne({email:email});
        logger.info("changePasswordAdmin: finding admin...");
        if(!adminDB){
            logger.error("changePasswordAdmin: error admin email not found");
            return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
            let password =bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
            adminDB.password = password;
            await adminDB.save();
            logger.info("changePasswordAdmin: saving admin password...");
            transporter.sendMail(mailOptions_(adminDB.email,newPassword,2,adminDB.nombre),(err)=>{
            if(err){logger.error(`changePasswordAdmin: Error occurred while sending password recovery email: ${err}`);}
            logger.info(`changePasswordAdmin: sending password recovery email...`);
        });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
    logger.error(`changePasswordAdmin: Internal server error: ${e}`);
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