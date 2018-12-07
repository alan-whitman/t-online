SELECT user_id
FROM t_recovery_codes
WHERE recovery_code = $1;