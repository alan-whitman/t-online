UPDATE t_users
SET pw_hash = $1
WHERE user_id = $2
RETURNING *;