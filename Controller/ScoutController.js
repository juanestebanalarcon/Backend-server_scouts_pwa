const {response}=require('express');
const Scout = require('../Model/Scout');
const bcrypt=require('bcryptjs');
const {generateJWT} = require('../Helpers/jwt');
const { generateRandomPass } = require('../Helpers/randomPassowrd');
const {transporter,mailOptions_} = require('../Helpers/EmailConfig');
const{RESPONSE_MESSAGES}=require('../Helpers/ResponseMessages');
const Rama = require('../Model/Rama');

const createScout = async(req,res=response) => {
    let {email}=req.body;
    const password = generateRandomPass(10);
    try {
        let dbScout=await Scout.findOne({email});
        if(dbScout){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_ALREADY_EXISTS});}
        req.body.esActivo = true;
        dbScout=new Scout(req.body);
        dbScout.password=bcrypt.hashSync(password,bcrypt.genSaltSync());
        await dbScout.save();
        let rama = await Rama.findById(req.body.idRama);
        if(!rama){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        rama.Scout.push(dbScout.id);
        rama.save();
        transporter.sendMail(mailOptions_(email,password,1,dbScout.nombre),(err)=>{if(err){console.log(err);}});
        const token= await generateJWT(dbScout.id,dbScout.nombre);
        return res.status(201).json({ok:true,uid:dbScout.id,nombre:dbScout.nombre,email,token});
    } catch (error) {       
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});
    }
}
const changeScoutState = async(req,res=response) => {
    try{
        let scout_ = await Scout.findById(req.params.id);
        if(!scout_){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND}); }
        scout_.esActivo=req.body.esActivo;
        scout_.save();
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX,scout_});
    }catch(err){console.log(err);
    return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
const readScoutBranch = async(req, res=response)=>{
    try{
        let branch = await Rama.findOne({Scout:req.params.id});
        if(!branch){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND})}
        return res.status(200).json({ok:true,branch,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(err){
        console.log(err);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}
const readActiveScouts = async(req,res=response) =>{
    try{    
        let _activeScouts = await Scout.find({esActivo:true});
        if(_activeScouts){return res.status(200).json({ok:true,_activeScouts});}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const readScouts= async(req,res=response)=>{
    try{
        let scouts_ = await Scout.find({});
        if(scouts_){return res.status(200).json({ok:true,scouts_ });}
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const readScout= async(req,res=response)=>{
    let uid=req.params.id;
    try{
        let scouts_ = await Scout.findById(uid);
        if(scouts_){return res.status(200).json({ok:true,scouts_ });}    
        return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}


const loginScout= async(req,res=response) => {
    let {email,password}=req.body;
    try {
     let scoutDB=await Scout.findOne({email});
     if(!scoutDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND})}
     let validPassword=bcrypt.compareSync(password,scoutDB.password);
     if(!validPassword){return res.status(400).json({ok:false,msg:RESPONSE_MESSAGES.ERR_INVALID_PASSWORD})}
     const token= await generateJWT(scoutDB.id,scoutDB.nombre,scoutDB.email,2);
     return res.status(200).json({ok:true,_id:scoutDB.id,nombre:scoutDB.nombre,email,rol: 2,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

const revalidateToken= async(req,res=response) => {
    let {id,nombre,email,rol}=req;
    const token= await generateJWT(id,nombre,email,rol);
   return res.status(200).json({ok:true,token,uid:id,nombre,email,rol});
}
const updateScout= async(req,res=response) =>{
    try{
        let id = req.params.id;
        let scoutDb = Scout.findById(id);
        if(!scoutDb){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Scout.updateOne({_id:id}, {...req.body}, { upsert: true });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}

const deleteScout = async (req,res=response) =>{
    try{
        const scoutDB = await Scout.findById(req.params.id);
        if(!scoutDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        await Scout.findByIdAndDelete(req.params.id);
        let rama = await Rama.findById(req.body.idRama);
        if( !rama ) {return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_NOT_FOUND});}
        let oldScout = rama.Scout;
        try{
        for(let i = 0; i < oldScout.length; i++) {if(oldScout[i]===req.params.id){oldScout.splice(i, 1);}}
        rama.Scout = oldScout;
        await rama.save();
        }catch(e){console.log(e);}
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
    }catch(e){
        console.log(e);
        return res.status(500).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500})
    }
}
const changePassword = async (req, res)=>{
    try{
        let {newPassword,email} = req.body;
        const scoutDB = await Scout.findOne({email:email});
        if(!scoutDB){return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_EMAIL_NOT_FOUND});}
        let password =bcrypt.hashSync(newPassword,bcrypt.genSaltSync());
        scoutDB.password = password;
        await scoutDB.save();
        transporter.sendMail(mailOptions_(scoutDB.email,newPassword,2,scoutDB.nombre),(err)=>{
            if(err){console.log(err);}
        });
        return res.status(200).json({ok:true,msg:RESPONSE_MESSAGES.SUCCESS_2XX});
}catch(e){
    console.log(e);
    return res.status(404).json({ok:false,msg:RESPONSE_MESSAGES.ERR_500});}
}

module.exports={
    createScout,
    readScouts,
    readScout,
    readActiveScouts,
    readScoutBranch,
    updateScout,
    changeScoutState,
    deleteScout,
    loginScout,
    changePassword,
    revalidateToken
}