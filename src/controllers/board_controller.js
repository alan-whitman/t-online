import { getPieceBlocks, getBoardCode } from "./tetrominos";

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';

// Set the top line of the board to be clear after clearing one or more lines, since it will always be clear after any number of clears
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

// Check collision after coordinates for a potential move have been calculated
export const canMove = (board, potentialBlock) => {
    for (let i = 0; i < potentialBlock.length; i++) {
        if (potentialBlock[i].x < 0)
            return false;
        if (board[potentialBlock[i].x][potentialBlock[i].y] !== 0) {
            return false;
        }
    }
    return true;
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

export const createBoard = () => {
    let board = []
    for (let x = 0; x < 12; x++) {
        board[x] = [];
        for (let y = 0; y < 24; y++) {
            if (y === 0 || x < 1 || x > 10)
                board[x][y] = 9;
            else 
                board[x][y] = 0;
        }
    }
    return board;
}