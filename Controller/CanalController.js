const {response}=require('express');
const Canal = require("../Model/Canal");

const createCanal= async(req,res=response)=>{
    const uid = req.uid;
    const canal = new Canal({publicacion:uid,...req.body});

    try{
        CanalDB = await canal.save();
        res.status(200).json({ok:true,Canal:CanalDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const readCanals= async(req,res=response)=>{
    const uuid = req.params.uid
    try{
        const Canals_ = await Canal.find({uuid});
        if(Canals_){
            res.status(200).json({ok:true,Canals_});
        }else{
            res.status(404).json({ok:false,msg:"Not found"});
        }
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const readCanal= async(req,res=response)=>{
    const uid=req.params.uid;
    try{
        const Canal_ = await Canal.findById(uid);
        if(Canal_){
            return res.status(200).json({
                ok:true,
                Canal_ 
            });
            
        }else{
            return res.status(404).json({
                ok:false,
                msg:"Not found"
            });

        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const updateCanal = async (req, res = response) => {

    const id  = req.params.id;
    const uid = req.uid;

    try {
        
        const canal = await Canal.findById( id );

        if ( !canal ) {
            return res.status(404).json({
                ok: true,
                msg: 'Canal no encontrado por id',
            });
        }

        const cambioCanal = {
            ...req.body,
            publicacion: uid
        }

        const CanalActualizado = await Canal.findByIdAndUpdate( id, cambioCanal, { new: true } );


        res.json({
            ok: true,
            Canal:CanalActualizado
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const deleteCanal= async(req,res=response)=>{
    
    const id  = req.params.id;
    
    try {
        
        const canal = await Canal.findById( id );
    
        if ( !canal ) {
            return res.status(404).json({
                ok: true,
                msg: 'Canal no encontrado por id',
            });
        }
    
        await canal.findByIdAndDelete( id );
    
    
        res.json({
            ok: true,
            msg: 'Canal eliminado'
        });
    
    } catch (error) {
    
        console.log(error);
    
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports={
    createCanal,
    readCanal,
    readCanals,
    updateCanal,
    deleteCanal
}