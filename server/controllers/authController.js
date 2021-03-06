const bcrypt = require('bcryptjs');
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
    async register(req, res) {
        try {
            const db = req.app.get('db');
            const { username, email, password } = req.body;
            if (username.trim() === '' || email.trim() === '' || password.trim() === '')
                return res.status(409).send('You must include a username, email, and password');

            let checkReply = await db.auth_get_user_by_email(email);
            if (checkReply[0])
                return res.status(409).send('Email address already in use');
            checkReply = await db.auth_get_user_by_username(username);
            if (checkReply[0])
                return res.status(409).send('Username already exists');
            const pw_hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const verificationString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const message = {
                from: 'play.t.online@gmail.com',
                to: email,
                subject: 'Welcome to T Online!',
                html: `<h2 style="font-size: 24px; color: darkblue">Welcome to T Online!</h2>
                    <p>Thank you for registering for T Online! Please verify your email address by clicking the link below. Verification allows you to recover your account in the event that your password is lost or forgotten</p><br />
                    <a style="background-color: darkblue; color: white; text-decoration: none; font-size: 16px; padding: 15px 15px; border-radius: 3px" href="${process.env.ACTIVE_PATH}#/verify?vc=${verificationString}">Click Here To Verify</a>
                    <br /><br />
                    <p>Thanks!</p>
                    <p>The T Online Team</p>`
            }
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.error(err);
                }
            });

            const user = await db.auth_register({username, email, pw_hash, verificationString});
            delete user[0].pw_hash;
            delete user[0].verification_code;
            req.session.user = user[0];
            return res.status(200).send(req.session.user);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error: ' + err)
        }
    },
    async verify(req, res) {
        const db = req.app.get('db');
        const { verificationCode } = req.body;
        let verificationResult = await db.auth_check_verification(verificationCode);
        if (verificationResult[0])
            if (verificationResult[0].verified)
                return res.status(200).send('Email address already verified');
        verificationResult = await db.auth_verify_email(verificationCode);
        if (!verificationResult[0])
            return res.status(409).send('Invalid verification code.');
        delete verificationResult[0].pw_hash;
        req.session.user = verificationResult[0];
        return res.sendStatus(200);
    },
    async login(req, res) {
        try {
            const db = req.app.get('db');
            const { username, password } = req.body;
            const user = await db.auth_get_user_by_username(username);
            if (!user[0])
                return res.status(409).send('Username not found');
            if (!bcrypt.compareSync(password, user[0].pw_hash))
                return res.status(409).send('Incorrect password')
            delete user[0].pw_hash;
            delete user[0].verification_code;
            req.session.user = user[0];
            let reply = {};
            reply.user = req.session.user;
            const settings = await db.settings_get_user_settings(req.session.user.user_id);
            if (settings[0])
                reply.settings = settings[0];
            return res.send(reply);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error: ' + err)
        }
    },
    logout(req, res) {
        try {
            if (req.session.user) {
                req.session.destroy();
                return res.send('Successfully logged out.');
            } else {
                return res.status(409).send('No user currently logged in')
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error: ' + err)
        }
    },
    async currentUser(req, res) {
        try {
            const db = req.app.get('db');
            let reply = {};
            if (req.session.user) {
                const settings = await db.settings_get_user_settings(req.session.user.user_id);
                reply.user = req.session.user;
                if (settings[0])
                    reply.settings = settings[0];
            }
            return res.send(reply);
        } catch(err) {
            console.log(err);
            return res.status(500).send(err);
        }
    },
    async deleteAccount(req, res) {
        try {
            const db = req.app.get('db');
            await db.auth_delete_account(req.session.user.user_id);
            req.session.destroy();
            return res.send('account deleted');
        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    },
    async resendVerification(req, res) {
        try {
            const { email, verification_code: verificationString } = req.session.user;
            const message = {
                from: 'play.t.online@gmail.com',
                to: email,
                subject: 'Welcome to T Online!',
                html: `<h2 style="font-size: 24px; color: darkblue">Welcome to T Online!</h2>
                    <p>Thank you for registering for T Online! Please verify your email address by clicking the link below. Verification allows you to recover your account in the event that your password is lost or forgotten</p><br />
                    <a style="background-color: darkblue; color: white; text-decoration: none; font-size: 16px; padding: 15px 15px; border-radius: 3px" href="${process.env.ACTIVE_PATH}#/verify?vc=${verificationString}">Click Here To Verify</a>
                    <br /><br />
                    <p>Thanks!</p>
                    <p>The T Online Team</p>`
            }
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.error(err);
                }
            });
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    },
    async updateEmail(req, res) {
        try {
            const db = req.app.get('db');
            const { newEmail } = req.body;

            let checkReply = await db.auth_get_user_by_email(newEmail);
            if (checkReply[0])
                return res.status(409).send('Email address already in use');
            const verificationString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            let updatedRecord = await db.auth_update_email([newEmail, req.session.user.user_id, verificationString]);
            const message = {
                from: 'play.t.online@gmail.com',
                to: newEmail,
                subject: 'T Online Email Address Updated',
                html: `<h2 style="font-size: 24px; color: darkblue">T Online Email Address Updated</h2>
                    <p>Please verify your updated email address by clicking the link below</p><br />
                    <a style="background-color: darkblue; color: white; text-decoration: none; font-size: 16px; padding: 15px 15px; border-radius: 3px" href="${process.env.ACTIVE_PATH}#/verify?vc=${verificationString}">Click Here To Verify</a>
                    <br /><br />
                    <p>Thanks!</p>
                    <p>The T Online Team</p>`
            }
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.error(err);
                }
            });
            delete updatedRecord[0].pw_hash;
            req.session.user = updatedRecord[0];
            res.send(req.session.user);
        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    },
    async updatePassword(req, res) {
        try {
            const db = req.app.get('db');
            const { newPassword } = req.body;
            if (newPassword.trim() === '')
                return res.status(409).send('Not sure how we ended up with a zero length string here, but that ain\'t gonna work');
            const pw_hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
            let updatedRecord = await db.auth_update_password([pw_hash, req.session.user.user_id]);
            if (!updatedRecord[0])
                return res.status(409).send('Unable to find record to update');
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },
    async resetPasswordRequest(req, res) {
        try {
            const db = req.app.get('db');
            const { email } = req.body;
            let user = await db.auth_get_user_by_email(email);
            if (!user[0])
                return res.status(409).send('No matching email address found.')
            if (!user[0].verified)
                return res.status(409).send('The email address associated with this account was never verified, and cannot be used for recovery. Please contact support for additional assistance.')
            const recoveryCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            let recoveryRecord = await db.auth_create_recovery_code(user[0].user_id, recoveryCode);

            const message = {
                from: 'play.t.online@gmail.com',
                to: email,
                subject: 'T Online Password Reset',
                html: `<h2 style="font-size: 24px; color: darkblue">T Online Password Reset</h2>
                    <p>A request was made to reset the password associated with your email address. If you did not submit this request, please disregard this email.</p>
                    <p>To change your password, click the link below.</p><br />
                    <a style="background-color: darkblue; color: white; text-decoration: none; font-size: 16px; padding: 15px 15px; border-radius: 3px" href="${process.env.ACTIVE_PATH}#/recover?rc=${recoveryCode}">Click Here To Change Your Password</a>
                    <br /><br />
                    <p>Thanks!</p>
                    <p>The T Online Team</p>`
            }
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.error(err);
                }
            });
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },
    async recoverAccount(req, res) {
        try {
            const db = req.app.get('db');
            const { newPassword, recoveryCode } = req.body;
            const recoveryRecord = await db.auth_get_id_by_recovery_code(recoveryCode);
            if (!recoveryRecord[0])
                return res.status(409).send('Invalid recovery code.');
            const pw_hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
            let updatedRecord = await db.auth_update_password([pw_hash, recoveryRecord[0].user_id]);
            if (!updatedRecord[0])
                return res.status(409).send('Unable to find record to update');
            await db.auth_delete_recovery_record(recoveryCode);
            res.sendStatus(200);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }
}