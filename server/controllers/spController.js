module.exports = {
    addScore(req, res) {
        const db = req.app.get('db');
        const { score } = req.body;
        const { user_id } = req.session.user;
        const date = new Date().toDateString();
        db.sp_add_score({user_id, score, date}).then(dbRes => {
            res.send('Score added successfully');
        });
    },
    getScores(req, res) {
        const db = req.app.get('db');
        let username;
        if (req.params.username)
            username = req.params.username;
        else if (req.session.user)
            username = req.session.user.username;
        else 
            return res.status(409).send('No valid username');
        db.sp_get_scores(username).then(dbRes => {
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