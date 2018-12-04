const bcrypt = require('bcryptjs');

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
            const user = await db.auth_register({username, email, pw_hash});
            delete user[0].pw_hash;
            req.session.user = user[0];
            res.status(200).send(req.session.user);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error: ' + err)
        }
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
            req.session.user = user[0];
            let reply = {};
            reply.user = req.session.user;
            const settings = await db.settings_get_user_settings(req.session.user.user_id);
            if (settings[0])
                reply.settings = settings[0];
            res.send(reply);
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error: ' + err)
        }
    },
    logout(req, res) {
        try {
            if (req.session.user) {
                req.session.destroy();
                res.send('Successfully logged out.');
            } else {
                res.status(409).send('No user currently logged in')
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
            res.send(reply);
        } catch(err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
}