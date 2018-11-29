SELECT username, rating
FROM t_users
WHERE username = $1 OR username = $2;