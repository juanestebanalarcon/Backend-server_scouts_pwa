const {response} = require("express");
const { generateJWT } = require("../Helpers/jwt")
const {generateRandomPass} = require("../Helpers/randomPassowrd");
const Administrador = require("../Model/Administrador");
const bcrypt = require('bcryptjs');
const { mailOptions_, transporter } = require("../Helpers/EmailConfig");
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');

const createAdmin= async(req,res=response)=>{
    let { email } = req.body;
    try {  
        let password = generateRandomPass(10);
        let administrador = await Administrador.findOne({ email })
        if( administrador ){return res.status(400).json({ok: false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS})}
        administrador = new Administrador( req.body );
        administrador.password = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        await administrador.save();
        transporter.sendMail(mailOptions_(email,password,1,administrador.nombre),(err)=>{
            if(err){console.log(err);}
        });
       return res.status(201).json({ok:true,uid: administrador.id,name: administrador.name});
    } catch (error) {return res.status(500).json({ok:false,msg: RESPONSE_MESSAGES.ERR_500});}
    
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
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const readAdmins= async(req,res=response)=>{
    try{
    let {email} = req.body;
    let admin_ = await Administrador.find({email}).limit(10);
    if(admin_){return res.status(200).json({ok:true,admin_});}
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e)
    {
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }

}
const updateAdmin=async(req,res=response)=>{
    const id  = req.params.id;

    try {
        let admin__ = await Administrador.findById( id );
        if ( !admin__ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        let cambioAdmin = {...req.body}
        let adminUpdate = await Administrador.findByIdAndUpdate( id, cambioAdmin, { new: true } );
        return res.status(200).json({ok: true,adminUpdate})
    } catch (error) {
        console.log(error);
       return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const deleteAdmin =async(req,res=response)=>{
    const id  = req.params.id;
    
    try {
        
        const admin_ = await Administrador.findById( id );
    
        if ( !admin_ ) {return res.status(404).json({ok: false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await admin_.findByIdAndDelete( id );
        return res.status(200).json({ok: true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    } catch (error) {
        console.log(error);
       return res.status(500).json({ok: false,msg:RESPONSE_MESSAGES.ERR_500})
    }

}
const loginAdmin= async(req,res=response) => {
    const {email,password}=req.body;
    try {
     const adminDB=await Administrador.findOne({email});
     if(!adminDB){
        return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})
     }
     const validPassword=bcrypt.compare(password,adminDB.password);
     if(!validPassword){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
     const token= await generateJWT(adminDB.id,adminDB.nombre,adminDB.email);
     return res.json({ok:true,uid:adminDB.id,name:adminDB.nombre,email,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const changePassword = async (req, res)=>{
    try{
        let {newPassword,email} = req.body;
        const adminDB = await Administrador.findOne({email:email});
        if(!adminDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        let password =bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        adminDB.password = password;
        await adminDB.save();
        transporter.sendMail(mailOptions_(adminDB.email,newPassword,2,adminDB.nombre),(err)=>{
            if(err){console.log(err);}
            console.log("Envío exitoso");
        });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    console.log(e);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
module.exports={
    loginAdmin,
    createAdmin,
    readAdmin,
    readAdmins,
    updateAdmin,
    deleteAdmin,
    changePassword,
    revalidateToken

}