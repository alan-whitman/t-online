// Sets the top line of the board to be clear after clearing one or more lines, as the top line will always be clear after any number of clears
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';

export const clearTopLine = (board) => {
    let newBoard = [...board];
    newBoard[1][20] = 0;
    newBoard[2][20] = 0;
    newBoard[3][20] = 0;
    newBoard[4][20] = 0;
    newBoard[5][20] = 0;
    newBoard[6][20] = 0;
    newBoard[7][20] = 0;
    newBoard[8][20] = 0;
    newBoard[9][20] = 0;
    newBoard[10][20] = 0;
    return newBoard;
}

// Checks collision after coordinates for a potential move have been calculated
export const checkCollision = (board, potentialBlock) => {
    let ableToMove = false;
    if (board[potentialBlock[0].x][potentialBlock[0].y] === 0)
        if (board[potentialBlock[1].x][potentialBlock[1].y] === 0)
            if (board[potentialBlock[2].x][potentialBlock[2].y] === 0)
                if (board[potentialBlock[3].x][potentialBlock[3].y] === 0)
                    ableToMove = true;                    
    return ableToMove;
}

export const calculatePotentialBlock = (direction, x, y) => {
    switch(direction) {
        case LEFT:
            return [{x: x - 1, y}, {x: x - 1, y: y - 1}, {x, y}, {x, y: y -1}]
        case RIGHT:
            return [{x: x + 1, y}, {x: x + 1, y: y - 1}, {x: x + 2, y}, {x: x + 2, y: y - 1}]
        case DOWN:
            return [{x, y: y - 1}, {x, y: y - 2}, {x: x + 1, y: y - 1}, {x: x + 1, y: y - 2}]
        default:
            return;
    }
}