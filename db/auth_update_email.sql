UPDATE t_users
SET email = $1, verified = FALSE, verification_code = $3
WHERE user_id = $2
RETURNING *;