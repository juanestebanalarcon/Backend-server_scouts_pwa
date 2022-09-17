const nodemailer = require('nodemailer');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

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

const recipients=(recipient,password)=>{
    return {
    from: process.env.MAIL_USERNAME,
    to: `${recipient}`,
    subject: "Noreply",
    html:`<p styñe="color:blue;font-size:20px;font-family:Arial;">
    Hola ${recipient} ésta es tu contraseña genérica: ${password}
    </p>`
    }
}


// transporter.sendMail(mailOptions,(err)=>console.log(err));
module.exports = {
    transporter,
    recipients
}