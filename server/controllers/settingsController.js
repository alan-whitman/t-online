module.exports = {
    async updateSettings(req, res) {
        const db = req.app.get('db');
        let newSettings = req.body;
        const existingSettings = await db.settings_get_user_settings(req.session.user.user_id);
        if (!existingSettings[0]) {
            newSettings.user_id = req.session.user.user_id;
            await db.settings_create_user_settings(newSettings);
            return res.sendStatus(200);
        } else {
            newSettings.user_id = req.session.user.user_id;
            await db.settings_update_user_settings(newSettings);
            return res.sendStatus(200);
        }
    }
}
