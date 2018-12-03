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
);
CREATE TABLE t_user_settings (
    settings_id                 SERIAL PRIMARY KEY,
    user_id                     INTEGER REFERENCES t_users(user_id),
    moveleft                    VARCHAR(50),
    moveright                   VARCHAR(50),
    movedown                    VARCHAR(50),
    rotateclockwise             VARCHAR(50),
    rotatecounterclockwise      VARCHAR(50),
    harddrop                    VARCHAR(50),
    holdpiece                   VARCHAR(50),
    pause                       VARCHAR(50)
);