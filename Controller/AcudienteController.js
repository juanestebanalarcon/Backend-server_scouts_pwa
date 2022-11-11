const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const {generateRandomPass} = require("../Helpers/randomPassowrd");
const bcrypt = require('bcryptjs');
const { mailOptions_, transporter } = require("../Helpers/EmailConfig");
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const logger = require('../Helpers/LoggerConfig');
const Acudiente = require('../Model/Acudiente');
const Rama = require("../Model/Rama");

const createAcudiente= async(req,res=response)=>{
    try {  
        let scouts_ = [];
        let password = generateRandomPass(10);
        let acudiente_ = await Acudiente.findOne({ email:req.body.email })
        if( acudiente_ ){return res.status(400).json({ok: false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS})}
        acudiente_ = new Acudiente( req.body );
        acudiente_.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        req.body.Scouts.forEach(scout =>{scouts_.unshift(scout);});
        acudiente_.Scout=scouts_; 
        if(acudiente_.link_imagen==undefined){acudiente_.link_imagen="";}
        let linkImagen=acudiente_.link_imagen.split('upload/');
        linkImagen.splice(1,0,'upload/w_1000,c_fill,ar_1:1,g_auto,r_max/');
        acudiente_.link_imagen = linkImagen.join("");
        await acudiente_.save();
        transporter.sendMail(mailOptions_(req.body.email,password,1,acudiente_.nombre),(err)=>{if(err){logger.error(`createAcudiente: Internal mail server error: ${err}`);}});
        const token= await generateJWT(acudiente_.id,acudiente_.nombre,acudiente_.apellido,acudiente_.email,3);
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,token});
    } catch (error) {
        logger.error(`CreateAcudiente: Internal server error: ${error}`);
        return res.status(500).json({ok:false,msg: RESPONSE_MESSAGES.ERR_500});}
}
const revalidateToken= async(req,res=response) => {
    let {id,nombre,apellido,email,rol}=req;
    const token= await generateJWT(id,nombre,apellido,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,apellido,email,rol});
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
        if(req.body.Scout!=undefined){
            let acudienteUpdate = new Acudiente(req.body);
            acudiente_.nombre = acudienteUpdate.nombre;
            acudienteUpdate.password = " ";
            acudienteUpdate.email = " ";
            acudienteUpdate.Scout = req.body.Scout;
            acudiente_.Scout.forEach((scout)=>{acudienteUpdate.Scout.push(scout);});
            acudiente_.apellido = acudienteUpdate.apellido;
            acudiente_.fecha_nacimiento = acudienteUpdate.fecha_nacimiento;
            acudiente_.celular = acudienteUpdate.celular;
            acudiente_.Scout = Array.from(new Set(acudienteUpdate.Scout));
            await acudiente_.save();
            return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});

        }
        await Acudiente.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        logger.error(`updateAcudiente: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const loginAcudiente= async(req,res=response) => {
    try {
     let acudiente_=await Acudiente.findOne({email:req.body.email});
     if(!acudiente_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})}
     if(!bcrypt.compareSync(req.body.password,acudiente_.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
     const token= await generateJWT(acudiente_.id,acudiente_.nombre,acudiente_.apellido,acudiente_.email,3);
     return res.status(200).json({ok:true,_id:acudiente_.id,nombre:acudiente_.nombre,email:req.body.emailemail,apellido: acudiente_.apellido,rol: 3,token})
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
const getScoutBranch = async(req,res=response)=>{
    try{
        let branchs = await Rama.find().populate("Scout"),scoutsBranchId=[],branchObj=[];
        let scoutsAcudiente = await Acudiente.findOne({_id:req.params.id}).populate("Scout");
        if(!scoutsAcudiente){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        scoutsAcudiente.Scout.forEach((scoutAc)=>{
            branchs.forEach((rama)=>{rama.Scout.forEach((scoutBranch)=>{if(scoutAc.id===scoutBranch.id){
                branchObj.push({_id:rama.id,nombre:rama.nombre,edadMin:rama.edadMin,edadMax:rama.edadMax,Scouts:{_id:scoutBranch._id,nombre:scoutBranch.nombre,apellido:scoutBranch.apellido,email:scoutBranch.email,celular:scoutBranch.celular,fecha_nacimiento:scoutBranch.fecha_nacimiento}});
                scoutsBranchId.push({Rama:rama.id,Scout:{_id:scoutAc._id,nombre:scoutAc.nombre,apellido:scoutAc.apellido,email:scoutAc.email,celular:scoutAc.celular,fecha_nacimiento:scoutAc.fecha_nacimiento}});}});});});
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,scoutsBranchId,branchObj});
    }catch(e){logger.error(`getScoutBranch: Internal server error: ${e}`);}
}
const changePassword = async (req, res)=>{
    try{
        const acudiente_ = await Acudiente.findOne({email:req.body.email});
        if(!acudiente_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        if(!bcrypt.compareSync(req.body.currentPassword,acudiente_.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
        acudiente_.password =bcrypt.hashSync(req.body.newPassword,bcrypt.genSaltSync());
        await acudiente_.save();
        transporter.sendMail(mailOptions_(acudiente_.email,req.body.newPassword,2,acudiente_.nombre),(err)=>{
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
    getScoutBranch,
    updateAcudiente,
    deleteAcudiente,
    loginAcudiente,
    changePassword,
    revalidateToken
}