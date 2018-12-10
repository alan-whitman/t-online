DELETE FROM t_sp_games
WHERE user_id = $1;
DELETE FROM t_user_settings
WHERE user_id = $1;
DELETE FROM t_recovery_codes
WHERE user_id = $1;
DELETE FROM t_users
WHERE user_id = $1;