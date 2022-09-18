const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTH_ACCESS_TOKEN
    }
});

const mailOptions_=(recipient,password,type,name)=>{
    if(type==1){
        return {
        from: process.env.MAIL_USERNAME,
        to: `${recipient}`,
        subject: `Noreply - contraseña de ${name}`,
        html:`
        <div id="seg">
        <div id='img-principal' scr=""></div>
  
        <img src="https://i.ibb.co/HPNN42R/logo192.png" alt="logo512" >
<div id="seg">
    <h1>¡Hola, ${name}!</h1>
    <hr/>
    <h3>Se habilito su correctamente su ususario en <b>CENTINELAPP</b></h3>
    
    <h2><b>Correo:</b> diamagalo@gmail.com</h2>
    <h2><b>Contraseña:</b> ${password}</h2>

    <a href="">¡Inicia ahora!</a>
    
    <h4>Disfruta de todos los servicios que te ofrece <b>CENTINELAPP</b></h4>

</div>

</div>


<style>
hr {
    margin: auto;
    width: 95%;
    margin-top: 0.5em;
    margin-bottom: 1em;
    margin-left: 0px;
    border: 0;
    border-top: 1px solid #eee;
    
}

h1{
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 550;
    font-size: 1.5em;
    text-align: center;
    
    color: #00395A;
    margin-top: 0px;
    margin-bottom: 0px;
}
h2{
   
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 0.8em;
    text-align: center;
    color: #00395A;
    margin-top: 0px;
    margin-bottom: 0px;

}
h3{
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 800;
    font-size: 1em;
    text-align: center;
    
    color: #00395A;
    margin-top: 2%;
    margin-bottom: 2%;
}

a{
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 1em;
    text-align: center;
    color: #00395A;
    margin-top: 5%;
    display: block;
    margin-bottom: 5%;

}

h4{
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 300;
    font-size: 0.5em;
    text-align: center;
    
    color: #00395A;
    margin-top: 2%;
    margin-bottom: 2%;
}
#text {
    display: flex;
    flex-direction: row;
}
#seg {
    height: fit-content;
    /* width: 100vh; */
    color: #ffff;
    padding: 0.5em;
    
}
#extra {
    height: 20%;
    width: 100%;
    background-color: #00395A;
    margin: 0%;

}
img {
    width: 10%;
    margin: auto;
    display: block;
}
#conte {
    display: block;
    margin: 6%;

}
</style>

        
        
        
        
   `
        }
    }else if(type ==2){
        return {
        from: process.env.MAIL_USERNAME,
        to: `${recipient}`,
        subject: `Noreply - contraseña de ${name}`,
        html:`<p style="color:blue;font-size:20px;font-family:Arial;">
        Hola ${name} esta es tu contraseña nueva: ${password}
        </p>`
        }
    }
    }

module.exports = {
    transporter,
    mailOptions_
}