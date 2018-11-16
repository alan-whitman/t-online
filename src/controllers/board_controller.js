import { getPieceBlocks } from "./tetrominos";

// Sets the top line of the board to be clear after clearing one or more lines, as the top line will always be clear after any number of clears
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';

export const clearTopLine = (board) => {
    let newBoard = [...board];
    newBoard[1][20] = 'E';
    newBoard[2][20] = 'E';
    newBoard[3][20] = 'E';
    newBoard[4][20] = 'E';
    newBoard[5][20] = 'E';
    newBoard[6][20] = 'E';
    newBoard[7][20] = 'E';
    newBoard[8][20] = 'E';
    newBoard[9][20] = 'E';
    newBoard[10][20] = 'E';
    return newBoard;
}

// Checks collision after coordinates for a potential move have been calculated

export const canMove = (board, potentialBlock) => {
    for (let i = 0; i < potentialBlock.length; i++) {
        if (potentialBlock[i].x < 0)
            return false;
        if (board[potentialBlock[i].x][potentialBlock[i].y] !== 'E') {
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
    console.log(board);
    let newBoard = board.slice();
    console.log(newBoard);
    console.log(newBoard[newPiece[0].x][newPiece[0].y]);
    newBoard[newPiece[0].x][newPiece[0].y] = 'hi';
    console.log(newBoard[newPiece[0].x][newPiece[0].y]);
    // newboard[newPiece[1].x][newPiece[0].y] = 'hi';
    // newboard[newPiece[2].x][newPiece[0].y] = 'hi';
    // newboard[newPiece[3].x][newPiece[0].y] = 'hi';
    console.log(newBoard);
   
    // for (let i = 0; i < 4; i++) {
    //     console.log( newPiece[i].x, newPiece[i].y)
    //     newBoard[newPiece[i].x][newPiece[i].y] = 'im going insane';
    // }
    // console.log(newBoard);
    // return newBoard;
}

export const createBoard = () => {
    let board = []
    for (let x = 0; x < 12; x++) {
        board[x] = [];
        for (let y = 0; y < 23; y++) {
            if (y === 0 || x < 1 || x > 10)
                board[x][y] = 'B';
            else 
                board[x][y] = 'E';
        }
    }
    return board;
}