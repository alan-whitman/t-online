// Sets the top line of the board to be clear after clearing one or more lines, as the top line will always be clear after any number of clears
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
export const checkCollision = (board, potentialBlocks) => {
    let ableToMove = false;
    if (board[potentialBlocks[0].x][potentialBlocks[0].y] === 0)
        if (board[potentialBlocks[1].x][potentialBlocks[1].y] === 0)
            if (board[potentialBlocks[2].x][potentialBlocks[2].y] === 0)
                if (board[potentialBlocks[3].x][potentialBlocks[3].y] === 0)
                    ableToMove = true;                    
    return ableToMove;
}

export const calculatePotentialCoords = ({ anchorX, anchorY, shape, orientation}) => {

}