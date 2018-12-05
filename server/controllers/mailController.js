const nodemailer = require('nodemailer');
require('dotenv').config();

const { MAIL_USER: username, MAIL_PW: password } = process.env;

const nmconfig = {
    host: 'smtp.gmail.com',
    auth: {
        user: username,
        pass: password
    }
}

const transporter = nodemailer.createTransport(nmconfig);

transporter.verify((error, success) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Mail server connected');
    }
});

module.exports = {
    registration(req, res) {
        // const db = req.app.get('db');
        const verificationString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const message = {
            from: 'play.t.online@gmail.com',
            to: 'parsimonious.one@gmail.com',
            subject: 'Welcome to T Online!',
            html: `
                    <h2 style="font-size: 24px; color: darkblue">Welcome to T Online!</h2>
                    <p>Thank you for registering for T Online! Please verify your email address by clicking the link below. Verification allows you to recover your account in the event that your password is lost or forgotten</p><br />
                    <a style="background-color: darkblue; color: white; text-decoration: none; font-size: 16px; padding: 15px 15px; border-radius: 3px" href="http://localhost:3000/#/verify?vc=${verificationString}">Click Here To Verify</a>
                    <br /><br />
                    <p>Thanks!</p>
                    <p>The T Online Team</p>
                `
        }
        transporter.sendMail(message);
        res.sendStatus(200);
    }
}