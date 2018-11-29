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
        // this should actually calculate rating
        winnerRating++;
        loserRating--;
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