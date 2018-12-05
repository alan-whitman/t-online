INSERT INTO t_users
    (username, email, pw_hash, verification_code)
VALUES
    (${username}, ${email}, ${pw_hash}, ${verificationString})
RETURNING *;