const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const {generateRandomPass} = require("../Helpers/randomPassowrd");
const Administrador = require("../Model/Administrador");
const bcrypt = require('bcryptjs');
const { mailOptions_, transporter } = require("../Helpers/EmailConfig");
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const logger = require("../Helpers/LoggerConfig");

const createAdmin= async(req,res=response)=>{
    try {  
        let password = generateRandomPass(10);
        let administrador = await Administrador.findOne({ email:req.body.email })
        if( administrador ){logger.error(`CreateAdmin: Already exists an admin account with the specified email`);
        return res.status(400).json({ok: false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS})}
        administrador = new Administrador( req.body );
        administrador.ramasAsignadas = req.body.ramasAsignadas;
        administrador.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        await administrador.save();
        transporter.sendMail(mailOptions_(req.body.email,password,1,administrador.nombre),(err)=>{if(err){logger.error(`CreateAdmin: Internal mail server error: ${err}`);}});
        logger.info(`CreateAdmin: Sending email to ${req.body.email}`);
        const token= await generateJWT(administrador.id,administrador.nombre,administrador.apellido,administrador.email,1);
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,token});
    } catch (error) {logger.error(`CreateAdmin: Internal server error: ${error}`);
    return res.status(500).json({ok:false,msg: RESPONSE_MESSAGES.ERR_500});}
    
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,apellido,email,rol}=req;
    const token= await generateJWT(id,nombre,apellido,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,apellido,email,rol});
}
const readAdmin= async(req,res=response)=>{
    try{
        let admin_ = await Administrador.findById(req.params.id);
        if(admin_){return res.status(200).json({ok:true,admin_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
        }
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`ReadAdmin: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readAdmins= async(req,res=response)=>{
    try{
        let admins_ = await Administrador.find();
        if(admins_){return res.status(200).json({ok:true,admins_});}
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
            let admon = await Administrador.findById(req.params.id).populate('ramasAsignadas');
            if(!admon){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND})}
            return res.status(200).json({ok:true,admon,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
            }catch(e){
                logger.error(`readAdminBranch: Internal server error: ${e}`);
                return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
            }
const readAdminBranchScouts = async(req, res=response)=>{
        try{
            let admonByBranchScout = await Administrador.findOne({_id:req.params.id}).populate({path:"ramasAsignadas",populate:{path:"Scout"}});
            let ScoutsBranchAdmin =[];
            if(!admonByBranchScout){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
            admonByBranchScout.ramasAsignadas.forEach((rama)=>{rama.Scout.forEach((scout)=>{ScoutsBranchAdmin.push(scout);});});
            return res.status(200).json({ok:true,ScoutsBranchAdmin,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
            }catch(e){
                logger.error(`readAdminBranch: Internal server error: ${e}`);
                return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
            }
const updateAdmin=async(req,res=response)=>{
    try {
        let admin__ = await Administrador.findById( req.params.id );
        if ( !admin__ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        if(req.body.email){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        await Administrador.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
        } catch (e) {
            logger.error(`updateAdmin: Internal server error: ${e}`);
            return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
        }
}
const deleteAdmin =async(req,res=response)=>{
    try {   
        const admin_ = await Administrador.findById(req.params.id);
        if ( !admin_ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Administrador.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`deleteAdmin: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
            }
            
        }
const loginAdmin= async(req,res=response) => {
    try {
        const adminDB=await Administrador.findOne({email:req.body.email});
        if(!adminDB){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})}
        if(!bcrypt.compareSync(req.body.password,adminDB.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD});}
        const token= await generateJWT(adminDB.id,adminDB.nombre,adminDB.apellido,adminDB.email,1);
        return res.status(200).json({ok:true,_id:adminDB.id,nombre:adminDB.nombre,apellido:adminDB.apellido,email:req.body.email,rol:1,token})
        } catch (e) {
            logger.error(`loginAdmin: Internal server error: ${e}`);
            return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
        }
    }
const changePassword = async (req, res)=>{
    try{
        let {newPassword,currentPassword,email} = req.body;
        const adminDB = await Administrador.findOne({email:email});
        if(!adminDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        if(!bcrypt.compareSync(currentPassword,adminDB.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
        adminDB.password =bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        await adminDB.save();
        transporter.sendMail(mailOptions_(adminDB.email,newPassword,2,adminDB.nombre),(err)=>{
        if(err){logger.error(`changePasswordAdmin: Error occurred while sending password recovery email: ${err}`);}});
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
    logger.error(`changePasswordAdmin: Internal server error: ${e}`);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
const changeAdminBranch = async (req, res=response) => {
    try{
        let admin = await Administrador.findById(req.params.id);
        if(!admin) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        admin.ramasAsignadas=req.body.RamasNuevas;
        await admin.save();
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(err){logger.error(`changeAdminBranch: Internal server error: ${err}`);
    return res.status(500).json({ok: false,msg: RESPONSE_MESSAGES.ERR_500})}
}
module.exports={
    loginAdmin,
    createAdmin,
    readAdmin,
    readAdmins,
    readAdminBranch,
    readAdminBranchScouts,
    updateAdmin,
    deleteAdmin,
    changePassword,
    changeAdminBranch,
    revalidateToken

}