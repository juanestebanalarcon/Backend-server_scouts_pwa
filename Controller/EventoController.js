const {response}=require('express');
const Evento = require("../Model/Evento");

const createEvento= async(req,res=response)=>{
    const uid = req.id;
    const evento = new Evento({Scout:uid,...req.body});
    try{
      const EventoDB = await evento.save();
        res.status(200).json({ok:true,Evento:EventoDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const readEventos= async(req,res=response)=>{
    const uuid = req.params.id
    try{
        const Eventos_ = await Evento.find({uuid});
        if(Eventos_){
            res.status(200).json({ok:true,Eventos_});
        }
        res.status(404).json({ok:false,msg:"Not found"});
        
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const readEvento= async(req,res=response)=>{
    const uid=req.params.id;
    try{
        const Evento_ = await Evento.findById(uid);
        if(Evento_){return res.status(200).json({ok:true,Evento_ });}
        return res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const updateEvento = async (req, res = response) => {
    const id  = req.params.id;
    const uid = req.uid;
    try {
        let evento = await Evento.findById( id );
        if ( !evento ) {return res.status(404).json({ok: true,msg: 'Evento no encontrada por id',});}
        const cambioEvento = {
            ...req.body,
            Scout: uid
        }
        const EventoActualizad = await Evento.findByIdAndUpdate( id, cambioEvento, { new: true } );
        res.json({
            ok: true,
            Evento:EventoActualizad
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}
const deleteEvento= async(req,res=response)=>{
    let id  = req.params.id;
    try {
        let evento = await Evento.findById( id );
        if ( !evento ) {return res.status(404).json({ok: true,msg: 'Evento no encontrada por id',});}
        await Evento.findByIdAndDelete( id );
        res.json({ok: true,msg: 'Evento eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}

module.exports={
    createEvento,
    readEvento,
    readEventos,
    updateEvento,
    deleteEvento
}