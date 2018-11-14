import { getPieceBlocks, getBoardCode } from "./tetrominos";

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
export const canMove = (board, potentialBlock) => {
    let ableToMove = true;
    potentialBlock.forEach((block) => {
        if (board[block.x][block.y] !== 0) {
            ableToMove = false;
        }
    });
    return ableToMove;
}

export const getPotentialBlock = (direction, piece) => {
    let potentialPiece = getPieceBlocks(piece);
    switch(direction) {
        case LEFT:
            for (let i = 0; i < potentialPiece.length; i++)
                potentialPiece[i].x -=  1;
            return potentialPiece;
        case RIGHT:
            for (let i = 0; i < potentialPiece.length; i++)
             potentialPiece[i].x += 1;
         return potentialPiece;
        case DOWN:
            for (let i = 0; i < potentialPiece.length; i++)
                potentialPiece[i].y -= 1;
            return potentialPiece;
        default:
            return;
    }
}

export const writeBoard = (board, newPiece, shape) => {
    let newBoard = board.slice();
    newPiece.forEach(block => {
        newBoard[block.x][block.y] = getBoardCode(shape);
    })
    return newBoard;
}