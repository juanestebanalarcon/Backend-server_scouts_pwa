const {response}=require('express');
const Scout = require('../Model/Scout');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../Helpers/jwt');
const { generateRandomPass } = require('../Helpers/randomPassowrd');
const {transporter,mailOptions_} = require('../Helpers/EmailConfig');
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const logger = require("../Helpers/LoggerConfig");
const Rama = require('../Model/Rama');
const Acudiente = require('../Model/Acudiente');

const createScout = async(req,res=response) => {
    try {
        let password = generateRandomPass(10);
        let dbScout=await Scout.findOne({email:req.body.email});
        if(dbScout){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        dbScout=new Scout(req.body);
        dbScout.esActivo = true;
        dbScout.password=bcrypt.hashSync(password,bcrypt.genSaltSync());
        if(dbScout.link_imagen==undefined){dbScout.link_imagen="";}
        let linkImagen=dbScout.link_imagen.split('upload/');
        linkImagen.splice(1,0,'upload/w_1000,c_fill,ar_1:1,g_auto,r_max/');
        dbScout.link_imagen = linkImagen.join("");
        await dbScout.save();
        if(req.body.idRama===undefined){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_FIELD_REQUIRED});}
        let rama = await Rama.findById(req.body.idRama);
        if(!rama){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        rama.Scout.push(dbScout.id);
        await rama.save();
        transporter.sendMail(mailOptions_(req.body.email,password,1,dbScout.nombre),(err)=>{if(err){logger.error(`createScout: Internal mail server error: ${err}`);}});
        const token= await generateJWT(dbScout.id,dbScout.nombre,dbScout.apellido,dbScout.email,2);
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,token});
    } catch (e) {       
        logger.error(`createScout: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const changeScoutState = async(req,res=response) => {
    try{
        let scout_ = await Scout.findById(req.params.id);
        if(!scout_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND}); }
        scout_.esActivo=req.body.esActivo;
        await scout_.save();
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,scout_});
    }catch(e){logger.error(`changeScoutState: Internal server error: ${error}`);
    return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
const readScoutBranch = async(req, res=response)=>{
    try{
        let branch = await Rama.findOne({Scout:req.params.id});
        if(!branch){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND})}
        return res.status(200).json({ok:true,branch,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(err){
        logger.error(`CreateScout: Internal server error: ${err}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
const readActiveScouts = async(req,res=response) =>{
    try{    
        let _activeScouts = await Scout.find({esActivo:true});
        if(_activeScouts){return res.status(200).json({ok:true,_activeScouts});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readActiveScouts: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const readScouts= async(req,res=response)=>{
    try{
        let scouts_ = await Scout.find();
        if(scouts_){return res.status(200).json({ok:true,scouts_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readScouts: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const readScout= async(req,res=response)=>{
    try{
        let scouts_ = await Scout.findById(req.params.id);
        if(scouts_){return res.status(200).json({ok:true,scouts_ });}    
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readScout: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

const readScoutsWithoutAcudiente= async(req,res=response)=>{
    try{
        let scouts_ = await Scout.find(),scoutsWithoutAcudiente=[];
        let acudiente = await Acudiente.find();
        if(scouts_){
            scouts_.forEach((scout)=>{
            acudiente.forEach((acudiente)=>{acudiente.Scout.forEach((scout_)=>{ if(scout_!==scout._id){scoutsWithoutAcudiente.push(scout);} }); }); });
            return res.status(200).json({ok:true,scoutsWithoutAcudiente });
        }    
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readScout: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}


const loginScout= async(req,res=response) => {
    try {
     let scoutDB=await Scout.findOne({email:req.body.email});
     if(!scoutDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})}
     if(!bcrypt.compareSync(req.body.password,scoutDB.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
     const token= await generateJWT(scoutDB.id,scoutDB.nombre,scoutDB.apellido,scoutDB.email,2);
     return res.status(200).json({ok:true,_id:scoutDB.id,nombre:scoutDB.nombre,apellido:scoutDB.apellido,email:req.body.email,rol: 2,token})
    } catch (error) {
        logger.error(`loginScout: Internal server error: ${error}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

const revalidateToken= async(req,res=response) => {
    let {id,nombre,apellido,email,rol}=req;
    const token= await generateJWT(id,nombre,apellido,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,apellido,email,rol});
}
const updateScout= async(req,res=response) =>{
    try{
        let scoutDb = await Scout.findById(req.params.id);
        if(!scoutDb){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        if(req.body.email){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        await Scout.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        logger.error(`updateScout: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

const deleteScout = async (req,res=response) =>{
    try{
        const scoutDB = await Scout.findById(req.params.id);
        if(!scoutDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        let rama = await Rama.findOne({Scout:scoutDB.id});
        if( !rama ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        let acudiente__ = await Acudiente.findOne({Scout:scoutDB.id});
        if(!acudiente__){
                try{
                    rama.Scout.forEach((scout)=>{if(scout===req.params.id){rama.Scout.splice(scout, 1);}});
                    await rama.save();
                    await Scout.findByIdAndDelete(req.params.id);
                    return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
                }catch(e){logger.error(`deleteScout: Internal server error: ${e}`);}
            }
        try{
            let oldAcudiente_=acudiente__.Scout;
            let ramaOldScout = rama.Scout;
            ramaOldScout.forEach((scout)=>{if(scout===req.params.id){ramaOldScout.splice(scout, 1);}});
            rama.Scout = ramaOldScout;
            await rama.save();
            oldAcudiente_.forEach((scout)=>{if(scout===req.params.id){oldAcudiente_.splice(scout, 1);}});
            acudiente__.Scout = oldAcudiente_;
            await acudiente__.save();
            await Scout.findByIdAndDelete(req.params.id);
            }catch(e){logger.error(`deleteScout: Internal server error: ${e}`);}
            return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
        }catch(e){logger.error(`deleteScout: Internal server error: ${e}`);}
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }

const changePassword = async (req, res)=>{
    try{
        let scoutDB = await Scout.findOne({email:req.body.email});
        if(!scoutDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        if(!bcrypt.compareSync(req.body.currentPassword,scoutDB.password)){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
        scoutDB.password = bcrypt.hashSync(req.body.newPassword,bcrypt.genSaltSync());
        await scoutDB.save();
        transporter.sendMail(mailOptions_(scoutDB.email,req.body.newPassword,2,scoutDB.nombre),(err)=>{if(err){{logger.error(`changePasswordScout: Internal mail server error: ${err}`);}}});
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    logger.error(`changePasswordScout: Internal server error: ${e}`);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}

module.exports={
    createScout,
    readScouts,
    readScout,
    readActiveScouts,
    readScoutBranch,
    readScoutsWithoutAcudiente,
    updateScout,
    changeScoutState,
    deleteScout,
    loginScout,
    changePassword,
    revalidateToken
}