module.exports = {
    async updateRatings(req, res) {
        const db = req.app.get('db');
        const { winner, loser } = req.body;
        if (winner === loser)
            return res.send('No rating change since you played yourself.');
        const ratings = await db.mp_get_rating_by_username([winner, loser]);
        let winnerRating, loserRating;
        ratings.forEach(user => {
            if (user.username === winner)
                winnerRating = user.rating;
            else
                loserRating = user.rating;
        });
        let wtr = 10 ** (winnerRating / 400);
        let ltr = 10 ** (loserRating / 400);
        let wer = wtr / (wtr + ltr);
        let ler = ltr / (wtr + ltr);
        winnerRating = Math.round(winnerRating + (32 * (1 - wer)));
        loserRating = Math.round(loserRating + (32 * (0 - ler)));
        const updatedRatings = await db.mp_update_ratings({winner, winnerRating, loser, loserRating})
        res.send(updatedRatings);
    },
    getRankings(req, res) {
        const db = req.app.get('db');
        db.mp_get_rankings().then(dbRes => {
            res.send(dbRes);
        });
    }
}