const {response} = require("express");
const { RESPONSE_MESSAGES } = require("../Helpers/ResponseMessages");
const Publicaciones = require("../Model/Publicaciones");

const createPublicacion= async(req,res=response)=>{
    try{
    let publi_ = Publicaciones.findOne({titulo:req.body.titulo});
    if(publi_){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
    publi_ = new Publicaciones(req.body);
     await publi_.save();
     return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
    
}
const readPublicacion= async(req,res=response)=>{
    try
    {
    const publi_ = await Publicaciones.findById(req.params.id);
    if(publi_){return res.status(200).json({ok:true,publi_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e)
    {
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }

}
const readPublicaciones= async(req,res=response)=>{
    try{
        const publicaciones_ = await Publicaciones.find();
        if(publicaciones_){return res.status(200).json({ok:true,publicaciones_,msg:RESPONSE_MESSAGES.SUCCESS_2XX});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const updatePublicacion= async(req,res=response)=>{
    let id  = req.params.id;
    try {
        let publi__ = await Publicaciones.findById( id );
        if ( !publi__ ) {
            return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        }
        await Publicaciones.updateOne({_id:id}, {...req.body}, { upsert: true });
       return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const deletePublicacion = async(req,res=response)=>{
    const id  = req.params.id;
    try {
        const publi_ = await Publicaciones.findById( id );
        if ( !publi_ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await publi_.findByIdAndDelete( id );
        res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}

module.exports={
   createPublicacion,
   readPublicacion,
   readPublicaciones,
   updatePublicacion,
   deletePublicacion

}