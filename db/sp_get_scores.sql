SELECT u.username, g.score, g.date
FROM t_sp_games g
INNER JOIN t_users u
ON g.user_id = u.user_id
WHERE u.username = $1
ORDER BY score DESC;