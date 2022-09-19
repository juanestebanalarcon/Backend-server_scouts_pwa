const {response}=require('express');
const { RESPONSE_MESSAGES } = require('../Helpers/ResponseMessages');
const Evento = require("../Model/Evento");

const createEvento= async(req,res=response)=>{
    let evento = new Evento({Scout:req.id,...req.body});
    try{
        await evento.save();
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readEventos= async(req,res=response)=>{
    try{
        const Eventos_ = await Evento.find({});
        if(Eventos_){return res.status(200).json({ok:true,Eventos_});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readEvento= async(req,res=response)=>{
    let id=req.params.id;
    try{
        const Evento_ = await Evento.findById(id);
        if(Evento_){return res.status(200).json({ok:true,Evento_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND})
    }
}
const updateEvento = async (req, res = response) => {
    let id  = req.params.id;
    try {
        let evento = await Evento.findById( id );
        if ( !evento ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Evento.updateOne({_id:id}, {...req.body,Scout:req._id}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const deleteEvento= async(req,res=response)=>{
    let id  = req.params.id;
    try {
        let evento = await Evento.findById( id );
        if ( !evento ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Evento.findByIdAndDelete( id );
        res.json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

module.exports={
    createEvento,
    readEvento,
    readEventos,
    updateEvento,
    deleteEvento
}