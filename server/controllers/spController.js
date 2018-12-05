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
    async getScores(req, res) {
        try {
            const db = req.app.get('db');
            let username;
            if (req.params.username)
                username = req.params.username;
            else if (req.session.user)
                username = req.session.user.username;
            else 
                return res.send([]);
            const scores = await db.sp_get_scores(username);
            const rating = await db.mp_get_rating_by_username([username, '']);
            let reply = {};
            reply.scores = scores;
            reply.rating = rating[0];
            res.send(reply);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    },
    getLeaderboard(req, res) {
        const db = req.app.get('db');
        db.sp_get_leaderboard().then(dbRes => {
            res.send(dbRes);
        }).catch(err => res.status(500).send(err));
    }
}