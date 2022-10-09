const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const {generateRandomPass} = require("../Helpers/randomPassowrd");
const bcrypt = require('bcryptjs');
const { mailOptions_, transporter } = require("../Helpers/EmailConfig");
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const Acudiente = require('../Model/Acudiente');
const Scout = require("../Model/Scout");

const createAcudiente= async(req,res=response)=>{
    let { email,Scouts } = req.body;
    try {  
        let scouts_ = [];
        let password = generateRandomPass(10);
        let acudiente_ = await Acudiente.findOne({ email })
        if( acudiente_ ){return res.status(400).json({ok: false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS})}
        acudiente_ = new Acudiente( req.body );
        acudiente_.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        Scouts.forEach(scout =>{scouts_.unshift(scout);});
        acudiente_.Scout=scouts_; 
        await acudiente_.save();
        transporter.sendMail(mailOptions_(email,password,1,acudiente_.nombre),(err)=>{
            if(err){console.log(err);}
        });
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        logger.error(`CreateAcudiente: Internal server error: ${error}`);
        return res.status(500).json({ok:false,msg: RESPONSE_MESSAGES.ERR_500});}
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,email,rol}=req;
    const token= await generateJWT(id,nombre,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,email,rol});
}
const readAcudiente= async(req,res=response)=>{
    try{
        let acudiente_ = await Acudiente.findById(req.params.id);
        if(acudiente_){return res.status(200).json({ok:true,acudiente_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});
    }catch(e){
        logger.error(`readAcudiente: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const getScoutsAcudiente = async(req, res=response) => {
    try{
        let scouts_ = await Acudiente.findById(req.params.id).populate('Scout');
        if(!scouts_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        return res.status(200).json({ok:true,scouts_,msg:RESPONSE_MESSAGES.SUCCESS_2XX,scouts_Asociada:scouts_.nombre});
}
catch(err){logger.error(`getScoutsAcudiente: Internal server error: ${err}`);
return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
}
}
const readAcudientes= async(req,res=response)=>{
    try{
    let acudientes_ = await Acudiente.find();
    if(acudientes_){return res.status(200).json({ok:true,acudientes_});}
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e)
    {
        logger.error(`readAcudientes: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const updateAcudiente= async(req,res=response) =>{
    try{
        let acudiente_ = await Acudiente.findById(req.params.id);
        if(!acudiente_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Acudiente.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        logger.error(`updateAcudiente: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const loginAcudiente= async(req,res=response) => {
    let {email,password}=req.body;
    try {
     let acudiente_=await Acudiente.findOne({email});
     if(!acudiente_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})}
     let validPassword=bcrypt.compareSync(password,acudiente_.password);
     if(!validPassword){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
     const token= await generateJWT(acudiente_.id,acudiente_.nombre,acudiente_.email,3);
     return res.status(200).json({ok:true,_id:acudiente_.id,nombre:acudiente_.nombre,email,rol: 3,token})
    } catch (error) {
        logger.error(`loginAcudiente: Internal server error: ${error}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const deleteAcudiente = async (req,res=response) =>{
    try{
        let acudiente_ = await Acudiente.findById(req.params.id);
        if(!acudiente_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Acudiente.findByIdAndDelete(req.params.id);
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        logger.error(`deleteAcudiente: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const changePassword = async (req, res)=>{
    try{
        let {newPassword,currentPassword,email} = req.body;
        const acudiente_ = await Acudiente.findOne({email:email});
        if(!acudiente_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        if(!bcrypt.compareSync(currentPassword,acudiente_.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
        acudiente_.password =bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        await acudiente_.save();
        transporter.sendMail(mailOptions_(acudiente_.email,newPassword,2,acudiente_.nombre),(err)=>{
            if(err){{logger.error(`changePasswordAcudiente: Internal mail server error: ${err}`);}
        }});
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    logger.error(`changePasswordAcudiente: Internal server error: ${e}`);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}


module.exports={
    createAcudiente,
    readAcudientes,
    readAcudiente,
    getScoutsAcudiente,
    updateAcudiente,
    deleteAcudiente,
    loginAcudiente,
    changePassword,
    revalidateToken
}