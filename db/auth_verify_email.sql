UPDATE t_users 
SET verified = TRUE
WHERE verification_code = $1
RETURNING *;