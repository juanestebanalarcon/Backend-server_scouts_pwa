const {response} = require("express");
const { RESPONSE_MESSAGES } = require("../Helpers/ResponseMessages");
const logger = require('../Helpers/LoggerConfig');
const Publicaciones = require("../Model/Publicaciones");
const Rama = require("../Model/Rama");


const createPublicacion= async(req,res=response)=>{
    try{
        let publi_ = await Publicaciones.findOne({titulo:req.body.titulo});
        if(publi_){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        if(req.body.isGeneral){
            let publi = new Publicaciones(req.body);
            await publi.save();
            return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
        }
        let rama_asociada = await Rama.findById(req.body.ramaAsignada);
        if(!rama_asociada ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        publi_ = new Publicaciones(req.body);
        publi_.ramaAsignada.push(rama_asociada.id)
        await publi_.save();
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e) {
        logger.error(`createPublicacion: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
    
}
const readPublicacion= async(req,res=response)=>{
    try
    {
    const publicacion_ = await Publicaciones.findById(req.params.id).populate({path:"ramaAsignada",populate:{path:"Scout"}});
    if(publicacion_){return res.status(200).json({ok:true,publicacion_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e)
    {
        logger.error(`readPublicacion: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }

}
const readPublicacionesByBranch= async(req,res=response)=>{
    try
    {
    const publicaciones_ = await Publicaciones.find({ramaAsignada:req.params.idRama}).populate({path:"ramaAsignada",populate:{path:"Scout"}}).sort({fecha:"ascending"});
    if(publicaciones_){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e)
    {
        logger.error(`readPublicacionesByBranch: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }

}

const readPublicaciones= async(req,res=response)=>{
    try{
        let publicaciones_ = await Publicaciones.find().populate({path:"ramaAsignada",populate:{path:"Scout"}});
        if(publicaciones_.length>0){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readPublicaciones: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readlastTwoPublicaciones= async(req,res=response)=>{
    try{
        let publicaciones_ = await Publicaciones.find().sort({_id:-1}).populate({path:"ramaAsignada",populate:{path:"Scout"}}).sort({fecha:"ascending"});
        if(publicaciones_.length>0){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readlastTwoPublicaciones: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readlastTwoPublicacionesByBranch= async(req,res=response)=>{
    try{
        const publicaciones_ = await Publicaciones.find({ramaAsignada:req.params.idRama}).limit(2).populate({path:"ramaAsignada",populate:{path:"Scout"}});
        if(publicaciones_.length>0){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readlastTwoPublicacionesByBranch: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readGeneralPublicaciones= async(req,res=response)=>{
    try{
        const publicaciones_ = await Publicaciones.find({isGeneral:true}).populate({path:"ramaAsignada",populate:{path:"Scout"}}).sort({fecha:"ascending"});
        if(publicaciones_.length>0){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readGeneralPublicaciones: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readGeneralTwoPublicaciones= async(req,res=response)=>{
    try{
        const publicaciones_ = await Publicaciones.find({isGeneral:true}).populate({path:"ramaAsignada",populate:{path:"Scout"}}).sort({fecha:"descending"}).limit(2);
        if(publicaciones_.length>0){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readGeneralPublicaciones: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}

const updatePublicacion= async(req,res=response)=>{
    try {
        let publicacion_ = await Publicaciones.findById( req.params.id );
        if ( !publicacion_ ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Publicaciones.updateOne({_id:req.params.id},{$set:{...req.body}}, { upsert: true });
       return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    } catch (e) {
        logger.error(`updatePublicacion: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const deletePublicacion = async(req,res=response)=>{
    try {
        const publi_ = await Publicaciones.findById( req.params.id );
        if ( !publi_ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Publicaciones.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`deletePublicacion: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}

module.exports={
   createPublicacion,
   readPublicacion,
   readPublicaciones,
   readlastTwoPublicaciones,
   readlastTwoPublicacionesByBranch,
   readPublicacionesByBranch,
   readGeneralPublicaciones,
   readGeneralTwoPublicaciones,
   updatePublicacion,
   deletePublicacion,
   

}