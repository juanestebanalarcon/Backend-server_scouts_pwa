const {response} = require("express");
const Publicaciones = require("../Model/Publicaciones");

const createPublicacion= async(req,res=response)=>{
    let publi_ = new Publicaciones({...req.body});
    try{
     const  publicacionDB = await publi_.save();
     res.status(200).json({ok:true,publicacionDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
    
}
const readPublicacion= async(req,res=response)=>{
    try
    {
    let {titulo} = req.body;
    const publi_ = await Publicaciones.find({titulo:titulo}).limit(5);
    if(admin_){
        res.status(200).json({ok:true,publi_});

    }
    res.status(404).json({ok:false,msg:"Not found"});
    }catch(e)
    {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }

}
const readPublicaciones= async(req,res=response)=>{
    let {fecha} = req.body
    try{
        const publis__ = await Rama.find({fecha});
        if(publis__){res.status(200).json({ok:true,publicaciones:publis__});}
        res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
}
const updatePublicacion= async(req,res=response)=>{
    let id  = req.params.id;
    try {
        let publi__ = await Publicaciones.findById( id );

        if ( !publi__ ) {
            return res.status(404).json({ok: true,msg: 'Publicación no encontrada por id',});
        }
        let cambioPubli = {...req.body}
        let publiUpdate = await Publicaciones.findByIdAndUpdate( id, cambioPubli, { new: true } );
        res.status(200).json({ok: true,publiUpdate})
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}
const deletePublicacion = async(req,res=response)=>{
    const id  = req.params.id;
    try {
        const publi_ = await Publicaciones.findById( id );
        if ( !publi_ ) {return res.status(404).json({ok: true,msg: 'Publicación no encontrada por id',});}
        await publi_.findByIdAndDelete( id );
        res.status(200).json({ok: true,msg: 'Publicación eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}

module.exports={
   createPublicacion,
   readPublicacion,
   readPublicaciones,
   updatePublicacion,
   deletePublicacion

}