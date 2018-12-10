UPDATE t_user_settings
SET blockscale = $1
WHERE user_id = $2;