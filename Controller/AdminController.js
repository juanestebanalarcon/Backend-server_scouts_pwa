const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const {generateRandomPass} = require("../Helpers/randomPassowrd");
const Administrador = require("../Model/Administrador");
const bcrypt = require('bcryptjs');
const { recipients, transporter } = require("../Helpers/EmailConfig");

const createAdmin= async(req,res=response)=>{
    let { email } = req.body;
    try {  
        let password = generateRandomPass(10);
        console.log("Password: " + password);
        let administrador = await Administrador.findOne({ email })
        if( administrador ){return res.status(400).json({ok: false,msg: 'Usuario existente con este email'})}
        administrador = new Administrador( req.body );
        administrador.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        await administrador.save();
        let mailOptions = recipients(email,password);
        transporter.sendMail(mailOptions,(err)=>{
            if(err){console.log(err);}
            console.log("Envío exitoso");
        });
        res.status(201).json({ok:true,uid: administrador.id,name: administrador.name});
    } catch (error) {res.status(500).json({ok:false,msg: 'Por favor hable con el administrador'});}
    
}
const revalidateToken= async(req,res) => {
    let {id,nombre,email}=req;
    const token= await generateJWT(id,nombre,email);
    res.status(200).json({ok:true,token});
}
const readAdmin= async(req,res=response)=>{
    let uid=req.params.id;
    try{
        let admin_ = await Administrador.findById(uid);
        if(admin_){return res.status(200).json({ok:true,admin_ });}
        return res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const readAdmins= async(req,res=response)=>{
    try{
    let {email} = req.body;
    let admin_ = await Administrador.find({email}).limit(10);
    if(admin_){res.status(200).json({ok:true,admin_});}
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
        let admin__ = await Administrador.findById( id );
        if ( !admin__ ) {return res.status(404).json({ok: false,msg: 'Administrador no encontrado por id',});}
        let cambioAdmin = {...req.body}
        let adminUpdate = await Administrador.findByIdAndUpdate( id, cambioAdmin, { new: true } );
        return res.status(200).json({ok: true,adminUpdate})

    } catch (error) {
        console.log(error);
       return res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }
}
const deleteAdmin =async(req,res=response)=>{
    const id  = req.params.id;
    
    try {
        
        const admin_ = await Administrador.findById( id );
    
        if ( !admin_ ) {return res.status(404).json({ok: false,msg: 'Amdinistrador no encontrado por id',});}
        await admin_.findByIdAndDelete( id );
        return res.status(200).json({ok: true,msg: 'Administrador eliminado'
        });
    } catch (error) {
        console.log(error);
       return res.status(500).json({ok: false,msg: 'Hable con el administrador'})
    }

}
const loginAdmin= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const adminDB=await Administrador.findOne({email});
     if(!adminDB){
        return res.status(400).json({ok:false,msg:'El correo no existe.'})
     }
     const validPassword=bcrypt.compare(password,adminDB.password);
     if(!validPassword){return res.status(400).json({ok:false,msg:'La password no es válida.'})}
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
    deleteAdmin,
    revalidateToken

}