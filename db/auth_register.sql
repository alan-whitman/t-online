INSERT INTO t_users
    (username, email, pw_hash)
VALUES
    (${username}, ${email}, ${pw_hash})
RETURNING *;