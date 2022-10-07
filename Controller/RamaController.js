const {response}=require('express');
const Rama = require("../Model/Rama");
const {RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const logger = require('../Helpers/LoggerConfig');


const createRama= async(req,res=response)=>{
    try{
        if(!req.body.nombre){return res.status(409).json({ok:false})}
        let ramaExiste = await Rama.findOne({nombre:req.body.nombre});
        if(ramaExiste) {return res.status(400).json({ok:false, msg: RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        let uid = req.id;
        const rama = new Rama({Scout:uid,...req.body});
        const  ramaDB = await rama.save();
        res.status(201).json({ok:true,rama:ramaDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readRamas= async(req,res=response)=>{
    
    try{
        const ramas_ = await Rama.find();
        if(ramas_){
            res.status(200).json({ok:true,ramas_});
        }else{
            res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        }
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readRama= async(req,res=response)=>{
    const uid=req.params.id;
    try{
        const rama_ = await Rama.findById(uid);
        if(rama_){return res.status(200).json({ok:true,rama_ });   }
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
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
        if ( !rama ) {return res.status(404).json({ok: true,msg: RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Rama.updateOne( id, {...req.body,Scout: _id}, { upsert: true } );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false,msg: RESPONSE_MESSAGES.ERR_500})
    }
}
const changeScoutBranch = async (req, res=response) => {
    try{
        let currentBranch = await Rama.findById(req.params.id);
        if( !currentBranch ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        let oldScout = currentBranch.Scout;
        try{
        for(let i = 0; i < oldScout.length; i++) {if(oldScout[i]===req.body.idScout){oldScout.splice(i, 1);}}
        currentBranch.Scout = oldScout;
        await currentBranch.save();
        }catch(e){console.log(e);}
        let newBranch = await Rama.findById(req.body.idRamaNueva);
        if( !newBranch ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        newBranch.Scout.push(req.body.idScout);
        newBranch.save();
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e){logger.error(`changePasswordAdmin: Internal server error: ${e}`);
    return res.status(500).json({ok: false,msg: RESPONSE_MESSAGES.ERR_500})}
}
const deleteRama= async(req,res=response)=>{
    let id  = req.params.id;
    try {
        const rama = await Rama.findById( id );
        if ( !rama ) {return res.status(404).json({ok: true,msg: RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await rama.findByIdAndDelete( id );
        res.json({ok: true,msg: 'Rama eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: RESPONSE_MESSAGES.ERR_500})
    }
}

const getScoutsAsignados = async(req, res=response) => {
    try{
        let rama = await Rama.findById(req.params.id).populate('Scout');
        if(!rama){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        return res.status(200).json({ok:true,rama,msg:RESPONSE_MESSAGES.SUCCESS_2XX,RamaAsociada:rama.nombre});
}
catch(err){console.log(err);
return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
}

}

module.exports={
    createRama,
    readRama,
    readRamas,
    updateRama,
    changeScoutBranch,
    deleteRama,
    getScoutsAsignados
}