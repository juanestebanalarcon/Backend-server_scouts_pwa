const {response}=require('express');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');
const Canal = require("../Model/Canal");
const Publicaciones = require("../Model/Publicaciones");
const logger = require('../Helpers/LoggerConfig');

const createCanal= async(req,res=response)=>{
    
    try{
        let canal_ = await Canal.findOne({nombre:req.body.nombre});
        if(canal_) {return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        canal_ = new Canal(req.body);
        let publicacion_ = await Publicaciones.findById(req.body.publicacion);
        if(!publicacion_ ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        canal_.publicacion.push(publicacion_);
        await canal_.save();
    return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
}catch(e) {
    logger.error(`CreateCanal: Internal server error: ${e}`);
    return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readCanals= async(req,res=response)=>{
    try{
        const Canals_ = await Canal.find().populate("publicacion");
        if(Canals_){return res.status(200).json({ok:true,Canals_});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readCanals: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readCanal= async(req,res=response)=>{
    try{
        let Canal_ = await Canal.findById(req.params.id).populate("publicacion");
        if(Canal_){return res.status(200).json({ok:true,Canal_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readCanal: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const updateCanal = async (req, res = response) => {
    try {
        let canal = await Canal.findById( req.params.id );
        if ( !canal ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Canal.updateOne({_id:req.params.id},{$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        logger.error(`updateCanal: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const deleteCanal= async(req,res=response)=>{ 
    try {
        let canal = await Canal.findById( req.params.id );
        if ( !canal ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await canal.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`deleteCanal: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const deletePostFromCanal= async(req,res=response)=>{ 
    try {
        let canal = await Canal.findById( req.params.id );
        if ( !canal ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        canal.publicacion.forEach(publi => {if(publi ===req.params.publicacion){canal.publicacion.splice(publi,1)}});
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`deletePostFromCanal: Internal server error: ${e}`);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
module.exports={
    createCanal,
    readCanal,
    readCanals,
    updateCanal,
    deleteCanal,
    deletePostFromCanal
}