CREATE TABLE t_users (
    user_id         SERIAL PRIMARY KEY,
    username        TEXT,
    pw_hash         TEXT,
    email           TEXT,
    rating          INTEGER
);
CREATE TABLE t_sp_games (
    sp_game_id      SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES t_users(user_id),
    score           INTEGER,
    date            TEXT
)