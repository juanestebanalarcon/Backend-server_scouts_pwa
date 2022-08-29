const {response} = require("express");
const Administrador = require("../Model/Administrador");

const createAdmin=(req,res=response)=>{
    
    const uid = req.uid;
    const admin_ = new Administrador({ramasAsignadas:uid,...req.body});
    try{
       adminDB = await admin_.save();
        res.status(200).json({ok:true,adminDB})
    }catch(e) {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }
    
}
const readAdmin=(req,res=response)=>{
    try
    {
    const {email} = req.body;
    const admin_ = await Administrador.find({email}).limit(10);
    if(admin_){
        res.status(200).json({ok:true,admin_});

    }
    res.status(404).json({ok:false,msg:"Not found"});
    }catch(e)
    {
        console.log(e);
        res.status(500).json({ok:false,msg:"Error interno en el servidor."});
    }

}
const updateAdmin=(req,res=response)=>{
    const id  = req.params.id;

    try {
        
        const admin__ = await Administrador.findById( id );

        if ( !admin__ ) {
            return res.status(404).json({
                ok: true,
                msg: 'Administrador no encontrado por id',
            });
        }

        const cambioAdmin = {...req.body}

        const adminUpdate = await Administrador.findByIdAndUpdate( id, cambioAdmin, { new: true } );


        res.json({
            ok: true,
           adminUpdate
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const deleteAdmin =(req,res=response)=>{
    const id  = req.params.id;
    
    try {
        
        const admin_ = await Administrador.findById( id );
    
        if ( !admin_ ) {
            return res.status(404).json({
                ok: true,
                msg: 'Amdinistrador no encontrado por id',
            });
        }
    
        await admin_.findByIdAndDelete( id );
    
    
        res.json({
            ok: true,
            msg: 'Administrador eliminado'
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
    createAdmin,
    readAdmin,
    updateAdmin,
    deleteAdmin

}