UPDATE t_user_settings
SET moveleft = ${left}, moveright = ${right}, movedown = ${down}, rotateclockwise = ${rotateClockwise}, rotatecounterclockwise = ${rotateCounterClockwise}, harddrop = ${hardDrop}, holdpiece = ${holdPiece}, pause = ${pause}
WHERE user_id = ${user_id};