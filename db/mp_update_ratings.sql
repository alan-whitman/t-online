UPDATE t_users
SET rating = ${winnerRating}
WHERE username = ${winner};
UPDATE t_users
SET rating = ${loserRating}
WHERE username = ${loser};
SELECT username, rating
FROM t_users
WHERE username = ${winner} OR username = ${loser};