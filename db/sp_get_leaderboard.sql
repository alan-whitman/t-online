SELECT u.username, t.score, t.date, u.user_id
FROM t_sp_games t
INNER JOIN t_users u
ON u.user_id = t.user_id
ORDER BY t.score DESC
LIMIT 10;