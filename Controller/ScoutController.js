const {response}=require('express');
const Scout = require('../Model/Scout');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');
const { generateRandomPass } = require('../Helpers/randomPassowrd');

const createScout = async(req,res=response) => {
    let {email}=req.body;
    let password = generateRandomPass(10);
    try {
        let dbScout=await Scout.findOne({email});
        if(dbScout){return res.status(400).json({ok:false,msg:"El Scout ya existe con ese email."});}
        req.body.esActivo = true;
        dbScout=new Scout(req.body);
        dbScout.password=bcrypt.hashSync(password,bcrypt.genSaltSync());
        await dbScout.save();
        const token= await generateJWT(dbScout.id,dbScout.nombre);
        return res.status(201).json({ok:true,uid:dbScout.id,nombre:dbScout.nombre,email,token});
    } catch (error) {       
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error interno del servidor.'
        });
    }
}
const readActiveScouts = async(req,res=response) =>{
    try{    
        let _activeScouts = await Scout.find({esActivo:true});
        if(_activeScouts){return res.status(200).json({ok:true,_activeScouts});}
        return res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const readScouts= async(req,res=response)=>{
    try{
        let scouts_ = await Scout.find({});
        if(scouts_){return res.status(200).json({ok:true,scouts_ });}
        return res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const readScout= async(req,res=response)=>{
    let uid=req.params.id;
    try{
        let scouts_ = await Scout.findById(uid);
        if(scouts_){return res.status(200).json({ok:true,scouts_ });}    
        return res.status(404).json({ok:false,msg:"Not found"});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}
const loginScout= async(req,res=response) => {
    let {email,password}=req.body;
    try {
     let scoutDB=await Scout.findOne({email});
     if(!scoutDB){
          res.status(404).json({ok:false,msg:'El correo no existe.'})
     }
     let validPassword=bcrypt.compareSync(password,scoutDB.password);
     if(!validPassword){res.status(400).json({ok:false,msg:'La password no es válida.'})}
     const token= await generateJWT(scoutDB.id,scoutDB.nombre,scoutDB.email);
     return res.status(200).json({ok:true,_id:scoutDB.id,name:scoutDB.nombre,email,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

const revalidateToken= async(req,res=response) => {
    let {id,nombre,email}=req;
    const token= await generateJWT(id,nombre,email);
    res.json({ok:true,token});
}
const updateScout= async(req,res=response) =>{
    try{
        let uid = req.params.id;
        let scoutDb = Scout.findById(uid);
        if(!scoutDb){return res.status(404).json({ok:false,msg:"No existe scout por ese uid."});}
        let {password,email,...campos} = req.body;
        if(email!=""){
            if(scoutDb.email===email){delete campos.email;}
            let existeEmail = await Scout.findOne({email});
            if(existeEmail){return res.status(400).json({ok:false,msg:"Ya existe scout con ese email"});}
            campos.email=email;
            const scoutUpdate = await Scout.findByIdAndUpdate(uid,campos,{new:true});
            res.status(200).json({ok:true,scoutUpdate});
        }
        const scoutUpdate = await Scout.findByIdAndUpdate(uid,campos,{new:true});
        res.status(200).json({ok:true,scoutUpdate});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

const deleteScout = async (req,res=response) =>{
    try{
        let uid = req.params.id;
        const scoutDB = Scout.findById(uid);
        
        if(!scoutDB){return res.status(404).json({ok:false,msg:"No existe scout por ese uid."});}
        await Scout.findByIdAndDelete(uid);
        res.status(200).json({ok:true,msg:"Scout eliminado."});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:'Error interno del servidor'})
    }
}

module.exports={
    createScout,
    readScouts,
    readScout,
    readActiveScouts,
    updateScout,
    deleteScout,
    loginScout,
    revalidateToken
}