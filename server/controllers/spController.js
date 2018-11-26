module.exports = {
    addScore(req, res) {
        const db = req.app.get('db');
        const { score } = req.body;
        const { user_id } = req.session.user;
        db.sp_add_score({user_id, score}).then(dbRes => {
            res.send('Score added successfully');
        });
    },
    getScores(req, res) {
        const db = req.app.get('db');
        let user_id;
        if (req.params.id)
            user_id = req.params.id;
        else if (req.session.user)
            user_id = req.session.user.user_id;
        else 
            return res.status(409).send('No valid user ID');
        db.sp_get_scores(user_id).then(dbRes => {
            res.send(dbRes);
        });
    },
    getLeaderboard(req, res) {
        const db = req.app.get('db');
        db.sp_get_leaderboard().then(dbRes => {
            res.send(dbRes);
        })
    }
}