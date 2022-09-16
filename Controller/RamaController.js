const {response}=require('express');
const Rama = require("../Model/Rama");

const createRama= async(req,res=response)=>{

    let uid = req.id;

    const rama = new Rama({Scout:uid,...req.body});
    
    const { nombre } = new Rama(req.body);

    let ramaExiste = await Rama.findOne({nombre});

    if(ramaExiste) {
        return res.status(400).json({ok:false, msg: "La rama ya existe"});
    }

    try{
      const  ramaDB = await rama.save();
        res.status(200).json({ok:true,rama:ramaDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const readRamas= async(req,res=response)=>{
    
    try{
        const ramas_ = await Rama.find();
        if(ramas_){
            res.status(200).json({ok:true,ramas_});
        }else{
            res.status(404).json({ok:false,msg:"Not found"});
        }
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const readRama= async(req,res=response)=>{
    const uid=req.params.id;
    try{
        const rama_ = await Rama.findById(uid);
        if(rama_){return res.status(200).json({ok:true,rama_ });   }
            return res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const updateRama = async (req, res = response) => {
    const id  = req.params.id;
    const _id = req._id;
    try {
        
        const rama = await Rama.findById( id );

        if ( !rama ) {
            return res.status(404).json({ok: true,msg: 'Rama no encontrada por id',});
        }
        const cambioRama = {
            ...req.body,
            Scout: _id
        }
        const ramaActualizada = await Rama.findByIdAndUpdate( id, cambioRama, { new: true } );
        res.json({ok: true,rama:ramaActualizada})
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}
const deleteRama= async(req,res=response)=>{
    let id  = req.params.id;
    try {
        const rama = await Rama.findById( id );
        if ( !rama ) {return res.status(404).json({ok: true,msg: 'Rama no encontrada por id',});}
        await rama.findByIdAndDelete( id );
        res.json({ok: true,msg: 'Rama eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}

module.exports={
    createRama,
    readRama,
    readRamas,
    updateRama,
    deleteRama
}