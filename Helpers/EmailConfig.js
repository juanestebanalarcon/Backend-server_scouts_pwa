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
        html:`<p style="color:blue;font-size:20px;font-family:Arial;">
        Hola ${name} esta es tu contraseña genérica: ${password}
        </p>`
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