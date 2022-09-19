const {response}=require('express');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');
const Canal = require("../Model/Canal");

const createCanal= async(req,res=response)=>{
    let canal = new Canal({publicacion:req.body.publicacion,...req.body});
    try{
        await canal.save();
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e) {
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readCanals= async(req,res=response)=>{
    try{
        const Canals_ = await Canal.find();
        if(Canals_){return res.status(200).json({ok:true,Canals_});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readCanal= async(req,res=response)=>{
    let id=req.params.id;
    try{
        const Canal_ = await Canal.findById(id);
        if(Canal_){return res.status(200).json({ok:true,Canal_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const updateCanal = async (req, res = response) => {
    let id  = req.params.id;
    try {
        const canal = await Canal.findById( id );
        if ( !canal ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Canal.updateOne({_id:id}, {...req.body,publicacion: req.id}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const deleteCanal= async(req,res=response)=>{
    
    let id  = req.params.id;
    
    try {
        const canal = await Canal.findById( id );
        if ( !canal ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await canal.findByIdAndDelete( id );
        res.json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
module.exports={
    createCanal,
    readCanal,
    readCanals,
    updateCanal,
    deleteCanal
}