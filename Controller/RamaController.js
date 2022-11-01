const {response}=require('express');
const Rama = require("../Model/Rama");
const {RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const logger = require('../Helpers/LoggerConfig');
const Acudiente = require('../Model/Acudiente');


const createRama= async(req,res=response)=>{
    try{
        let ramaExiste = await Rama.findOne({nombre:req.body.nombre});
        if(ramaExiste) {return res.status(400).json({ok:false, msg: RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        let rama = new Rama(req.body);
        rama.Scout.unshift(req.body.id);
        await rama.save();
        return res.status(201).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e) {
        logger.error(`createRama: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readRamas= async(req,res=response)=>{
    
    try{
        let ramas_ = await Rama.find();
        if(ramas_){return res.status(200).json({ok:true,ramas_});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
        
    }catch(e){
        logger.error(`readRamas: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readRama= async(req,res=response)=>{
    try{
        const rama_ = await Rama.findById(req.params.id);
        if(rama_){return res.status(200).json({ok:true,rama_ });   }
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        logger.error(`readRama: Internal server error: ${e}`);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

const updateRama = async (req, res = response) => {
    try {
        const rama = await Rama.findById( req.params.id );
        if ( !rama ) {return res.status(404).json({ok: true,msg: RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Rama.updateOne({_id:req.params.id}, {$set:{...req.body}}, { upsert: true });
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    } catch (e) {
        logger.error(`updateRama: Internal server error: ${e}`);
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
        }catch(e){logger.error(`changeScoutBranch: Internal server error: ${e}`);}
        let newBranch = await Rama.findById(req.body.idRamaNueva);
        if( !newBranch ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        newBranch.Scout.push(req.body.idScout);
        newBranch.save();
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX})
    }catch(e){logger.error(`changeScoutBranch: Internal server error: ${e}`);
    return res.status(500).json({ok: false,msg: RESPONSE_MESSAGES.ERR_500})}
}
const deleteRama= async(req,res=response)=>{
    try {
        const rama = await Rama.findById( req.params.id );
        if ( !rama ) {return res.status(404).json({ok: true,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Rama.findByIdAndDelete( req.params.id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (e) {
        logger.error(`deleteRama: Internal server error: ${e}`);
        res.status(500).json({ok: false,msg: RESPONSE_MESSAGES.ERR_500})
    }
}

const getScoutsAsignados = async(req, res=response) => {
    try{
        let rama = await Rama.findById(req.params.id).populate('Scout');
        if(!rama){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        return res.status(200).json({ok:true,rama,msg:RESPONSE_MESSAGES.SUCCESS_2XX,RamaAsociada:rama.nombre});
}
catch(e){logger.error(`getScoutsAsignados: Internal server error: ${e}`);
return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
}
}
const getScoutAcudienteBranch = async(req,res=response)=>{
    try{
        let branchs = await Rama.findOne({_id:req.params.id}),scoutsBranchId=[],branchObj=[];
        let scoutsAcudiente = await Acudiente.find();
        if(!branchs){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        branchs.Scout.forEach((scoutAc)=>{
                scoutsAcudiente.forEach((acudiente__)=>{acudiente__.Scout.forEach((scoutBranch)=>{if(scoutAc===scoutBranch){
                branchObj.push({_id:rama.id,nombre:rama.nombre,edadMin:rama.edadMin,edadMax:rama.edadMax,Scouts:rama.Scout});
                scoutsBranchId.push({Rama:rama.id,Scout:scoutAc});}});});});
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,scoutsBranchId,branchObj});
    }catch(e){logger.error(`getScoutBranch: Internal server error: ${e}`);}
}

module.exports={
    createRama,
    readRama,
    readRamas,
    updateRama,
    changeScoutBranch,
    deleteRama,
    getScoutsAsignados,
    getScoutAcudienteBranch
}