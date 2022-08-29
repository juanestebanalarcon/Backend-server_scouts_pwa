const {response} = require("express");
const Publicaciones = require("../Model/Publicaciones");

const createPublicacion=(req,res=response)=>{
    
    const publi_ = new Publicaciones({...req.body});
    try{
       publicacionDB = await publi_.save();
        res.status(200).json({ok:true,publicacionDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
    
}
const readPublicacion=(req,res=response)=>{
    try
    {
    const {fecha} = req.body;
    const publi_ = await Publicaciones.find({fecha}).limit(5);
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
const updatePublicacion=(req,res=response)=>{
    const id  = req.params.id;

    try {
        
        const publi__ = await Publicaciones.findById( id );

        if ( !publi__ ) {
            return res.status(404).json({
                ok: true,
                msg: 'Publicación no encontrada por id',
            });
        }

        const cambioPubli = {...req.body}

        const publiUpdate = await Publicaciones.findByIdAndUpdate( id, cambioPubli, { new: true } );


        res.json({
            ok: true,
           publiUpdate
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const deletePublicacion =(req,res=response)=>{
    const id  = req.params.id;
    
    try {
        
        const publi_ = await Publicaciones.findById( id );
    
        if ( !publi_ ) {
            return res.status(404).json({
                ok: true,
                msg: 'Publicación no encontrada por id',
            });
        }
    
        await publi_.findByIdAndDelete( id );
    
    
        res.json({
            ok: true,
            msg: 'Publicación eliminada'
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
   createPublicacion,
   readPublicacion,
   updatePublicacion,
   deletePublicacion

}