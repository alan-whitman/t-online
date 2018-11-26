SELECT u.username, t.score
FROM t_sp_games t
INNER JOIN t_users u
ON u.user_id = t.user_id
ORDER BY t.score DESC
LIMIT 10;