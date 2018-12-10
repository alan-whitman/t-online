module.exports = {
    async updateSettings(req, res) {
        const db = req.app.get('db');
        let newSettings = req.body;
        const existingSettings = await db.settings_get_user_settings(req.session.user.user_id);
        if (!existingSettings[0]) {
            newSettings.user_id = req.session.user.user_id;
            newSettings.blockScale = 21;
            await db.settings_create_user_settings(newSettings);
            return res.sendStatus(200);
        } else {
            newSettings.user_id = req.session.user.user_id;
            await db.settings_update_user_settings(newSettings);
            return res.sendStatus(200);
        }
    },
    async updateBlockScale(req ,res) {
        const db = req.app.get('db');
        const { newBlockScale } = req.body;
        const existingSettings = await db.settings_get_user_settings(req.session.user.user_id);
        if (!existingSettings[0]) {
            let newSettings = {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                down: 'ArrowDown',
                rotateClockwise: 'x',
                rotateCounterClockwise: 'z',
                hardDrop: 'ArrowUp',
                holdPiece: 'c',
                pause: 'Space',
                blockScale: newBlockScale,
                user_id: req.session.user.user_id
            }
            await db.settings_create_user_settings(newSettings);
            return res.sendStatus(200);
        } else {
            await db.settings_update_blockscale([newBlockScale, req.session.user.user_id]);
            return res.sendStatus(200);
        }
    }
}
