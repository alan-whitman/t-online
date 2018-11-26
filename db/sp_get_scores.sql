SELECT *
FROM t_sp_games
WHERE user_id = $1
ORDER BY score DESC;