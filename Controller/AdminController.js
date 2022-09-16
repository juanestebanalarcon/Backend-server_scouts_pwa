const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const Administrador = require("../Model/Administrador");
const bcrypt = require('bcryptjs');

const createAdmin= async(req,res=response)=>{
    
    const { email, password } = req.body;

    try {  

        let administrador = await Administrador.findOne({ email })
        
        if( administrador ){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario existente con este email'
            })
        }

        administrador = new Administrador( req.body );

        const salt = bcrypt.genSaltSync();

        administrador.password = bcrypt.hashSync( password, salt );
    
        await administrador.save();

        const token = await generateJWT( usuario.id, usuario.name )
    
        res.status(201).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {

        res.status(500).json({
            ok:false,
            msg: 'Por favor hable con el administrador'
        });
    }
    
}
const readAdmin= async(req,res=response)=>{
    const uid=req.params.id;
    try{
        const admin_ = await Administrador.findById(uid);
        if(admin_){
            return res.status(200).json({
                ok:true,
                admin_ 
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
const readAdmins= async(req,res=response)=>{
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
const updateAdmin=async(req,res=response)=>{
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
const deleteAdmin =async(req,res=response)=>{
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
const loginAdmin= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const adminDB=await Administrador.findOne({email});
     if(!adminDB){
        return res.status(400).json({ok:false,msg:'El correo no existe.'})
     }
     const validPassword=bcrypt.compareSync(password,adminDB.password);
     if(!validPassword){
        return res.status(400).json({ok:false,msg:'La password no es válida.'})
     }
     const token= await generateJWT(adminDB.id,adminDB.nombre,adminDB.email);
     return res.json({ok:true,uid:adminDB.id,name:adminDB.nombre,email,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

module.exports={
    loginAdmin,
    createAdmin,
    readAdmin,
    readAdmins,
    updateAdmin,
    deleteAdmin

}