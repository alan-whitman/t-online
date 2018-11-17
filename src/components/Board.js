import React, { Component } from 'react';
import './Board.css';
import { clearTopLine, getPotentialBlock, canMove, writeBoard, createBoard } from '../controllers/board_controller';
import { getPieceBlocks, shuffleShapes, convertBoardCodeToShape } from '../controllers/tetrominos';
const BLOCK_SCALE = 25;
const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';


class Board extends Component {
    constructor() {
        super();
        let shapeOrder = shuffleShapes();
        this.state = {
            board: createBoard(),
            interval: -1,
            paused: false,
            lost: false,
            swapped: false,
            heldPiece: '',
            speed: 1000,
            shapeOrder,
            currentShape: 1,
            nextPiece: shapeOrder[1],
            score: 0,
            piece: {
                x: 5,
                y: 20,
                shape: shapeOrder[0],
                orientation: 0
            }
        }
        this.renderPieces = this.renderPieces.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.newGame = this.newGame.bind(this);
        this.pause = this.pause.bind(this);
        this.tick = this.tick.bind(this);
        this.boardRef = React.createRef();
    }
    componentDidMount() {
        let interval = setInterval(this.tick, this.state.speed);
        this.setState({interval});
        this.boardRef.current.focus();
    }
    checkForLoss() {
        const { board, piece } = this.state;
        const potentialBlock = getPieceBlocks(piece);
        if (!canMove(board, potentialBlock)) {
            clearInterval(this.state.interval);
            this.setState({lost: true, paused: false});
        }
    }
    newPiece() {
        let { currentShape } = this.state;
        let nextShape, nextPiece;
        if (currentShape === 6) {
            currentShape = 0;
            nextShape = this.state.shapeOrder[6]
            let newShapes = shuffleShapes();
            this.setState({shapeOrder: newShapes});
            nextPiece = newShapes[0];
        } else {
            nextShape = this.state.shapeOrder[currentShape];
            currentShape++;
            nextPiece = this.state.shapeOrder[currentShape];
        }
        this.setState({piece: {...this.state.piece, x: 5, y: 20, orientation: 0, shape: nextShape}, currentShape, nextPiece, swapped: false}, this.checkForLoss);
    }
    hardDrop() {
        const { board } = this.state;
        let droppingPiece = {...this.state.piece};
        while (true) {
            let potentialBlock = getPotentialBlock(DOWN, droppingPiece);
            if (!canMove(board, potentialBlock)) {
                this.setState({piece: {...this.state.piece, y: droppingPiece.y}}, () => this.landPiece());
                return;
            }
            droppingPiece.y -= 1
        }
    }
    getShadow() {
        const { board } = this.state;
        let droppingPiece = {...this.state.piece};
        while (true) {
            let potentialBlock = getPotentialBlock(DOWN, droppingPiece);
            if (!canMove(board, potentialBlock)) {
                return droppingPiece
            }
            droppingPiece.y -= 1
        }
    }
    pause() {
        if (this.state.lost)
            return;
        if (!this.state.paused) {
            clearInterval(this.state.interval)
            this.setState({paused: true})
        }
        else {
            if (this.state.lost)
                return;
            this.tick();
            let interval = setInterval(this.tick, this.state.speed);
            this.setState({interval, paused: false})
            this.boardRef.current.focus();
        }
    }
    newGame() {
        clearInterval(this.state.interval);
        let interval = setInterval(this.tick, this.state.speed);
        this.boardRef.current.focus();
        this.setState({interval, board: createBoard(), shapeOrder: shuffleShapes(), currentShape: 0, heldPiece: '', lost: false, paused: false}, () => this.newPiece());
        this.boardRef.current.focus();
    }
    checkForClears() {
        let { board, score } = this.state;
        let clearLines = [];
        for (let y = 1; y <= 20; y++) {
            let clears = true;
            for (let x = 1; x <= 10; x++) {
                if (board[x][y] === 0)
                    clears = false;
            }
            if (clears)
                clearLines.push(y);
        }
        score += (clearLines.length ** 2) * 1000;
        while (clearLines[0]) {
            let line = clearLines.pop();
            for (let y = line; y < 20; y++) {
                for (let x = 1; x <= 10; x++)
                    board[x][y] = board[x][y + 1];

            }
            board = clearTopLine(board);
        }
        this.setState({board, score})
    }
    landPiece() {
        let { board } = this.state;
        let currentBlocks = getPieceBlocks(this.state.piece);
        let boardCopy = board.slice();
        board = writeBoard(boardCopy, currentBlocks, this.state.piece.shape);
        this.setState({board});
        this.checkForClears();
        this.newPiece();
    }
    tick() {
        const { y } = this.state.piece;
        let { board } = this.state;
        let potentialBlock = getPotentialBlock(DOWN, this.state.piece);
        if (!canMove(board, potentialBlock)) {
            this.landPiece();
        } else {
            this.setState({piece: {...this.state.piece, y: y - 1}});
        }
    }
    holdPiece() {
        if (!this.state.heldPiece)
            return this.setState({heldPiece: this.state.piece.shape}, this.newPiece);
        if (!this.state.swapped) {
            let heldPiece = this.state.piece.shape;
            return this.setState({piece: {...this.state.piece, shape: this.state.heldPiece}, heldPiece, swapped: true});
        }
    }
    handleInput(key) {
        const { board } = this.state;
        const { x, y }  = this.state.piece;
        const { piece } = this.state;
        let potentialBlock;
        let potentialPiece;
        if (this.state.lost)
            return;
        // if (this.state.paused) {
        //     if(key === ' ') {
        //         return this.pause();
        //     }
        //     else {
        //         return;
        //     }
        // }
        switch (key) {
            case 'ArrowLeft':
                potentialBlock = getPotentialBlock(LEFT, piece);
                if (canMove(board, potentialBlock))
                    this.setState({piece: {...this.state.piece, x: x - 1}});
                break;
            case 'ArrowRight':
                potentialBlock = getPotentialBlock(RIGHT, piece);
                if (canMove(board, potentialBlock))
                    this.setState({piece: {...this.state.piece, x: x + 1}});
                break;
            case 'ArrowUp':
                this.hardDrop();
                break;
            case 'ArrowDown':
                potentialBlock = getPotentialBlock(DOWN, piece);
                if (canMove(board, potentialBlock))
                    this.setState({piece: {...this.state.piece, y: y - 1}});
                else
                    this.landPiece();
                break;
            case 'c':
                this.holdPiece();
                break;
            case 'x':
                potentialPiece = {...piece};
                potentialPiece.orientation = piece.orientation === 3 ? 0 : piece.orientation + 1;
                potentialBlock = getPieceBlocks(potentialPiece);
                if (canMove(board, potentialBlock)) {
                    this.setState({piece: {...this.state.piece, orientation: potentialPiece.orientation}});
                    break;
                }
                potentialPiece.x -= 1;
                potentialBlock = getPieceBlocks(potentialPiece);
                if (canMove(board, potentialBlock)) {
                    this.setState({piece: {...this.state.piece, orientation: potentialPiece.orientation, x: x - 1}});
                    break;
                }                
                potentialPiece.x += 2;
                potentialBlock = getPieceBlocks(potentialPiece);
                if (canMove(board, potentialBlock)) {
                    this.setState({piece: {...this.state.piece, orientation: potentialPiece.orientation, x: x + 1}});
                    break;
                }                
                break;
            case 'z':
                potentialPiece = {...piece};
                potentialPiece.orientation = piece.orientation === 0 ? 3 : piece.orientation - 1;
                potentialBlock = getPieceBlocks(potentialPiece);
                if (canMove(board, potentialBlock)) {
                    this.setState({piece: {...this.state.piece, orientation: potentialPiece.orientation}});
                    break
                }
                potentialPiece.x += 1;
                potentialBlock = getPieceBlocks(potentialPiece);
                if (canMove(board, potentialBlock)) {
                    this.setState({piece: {...this.state.piece, orientation: potentialPiece.orientation, x: x + 1}});
                    break;
                }                
                potentialPiece.x -= 2;
                potentialBlock = getPieceBlocks(potentialPiece);
                if (canMove(board, potentialBlock)) {
                    this.setState({piece: {...this.state.piece, orientation: potentialPiece.orientation, x: x - 1}});
                    break;
                }                
                break;
            case ' ':
                this.pause();
                break;
            default:
                return;
        }
    }
    renderPieces() {
        let renderCoords = getPieceBlocks(this.state.piece);
        let pieceRender = [];
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={'piece ' + i} className={'block ' + this.state.piece.shape} style={{left: renderCoords[i].x * BLOCK_SCALE, bottom:  (renderCoords[i].y - 1) * BLOCK_SCALE + 2, width: BLOCK_SCALE - 1 , height: BLOCK_SCALE - 1}} />)
        }
        let shadowPiece = this.getShadow();
        renderCoords = getPieceBlocks(shadowPiece);
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={'shadow ' + i} className="block shadow" style={{left: renderCoords[i].x * BLOCK_SCALE, bottom:  (renderCoords[i].y - 1) * BLOCK_SCALE + 2, width: BLOCK_SCALE - 1 , height: BLOCK_SCALE - 1}} />)
        }
        const nextPiece = {
            orientation: 0,
            x: 0,
            y: 0,
            shape: this.state.nextPiece
        }
        renderCoords = getPieceBlocks(nextPiece);
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={'next ' + i} className={'block ' + nextPiece.shape} style={{left: renderCoords[i].x * BLOCK_SCALE + BLOCK_SCALE * 14, bottom:renderCoords[i].y * BLOCK_SCALE + Math.floor(BLOCK_SCALE * 16.5), width: BLOCK_SCALE - 1, height: BLOCK_SCALE - 1}} />)
        }
        if (this.state.heldPiece) {
            const heldPiece = {
                x: 0,
                y: 0,
                orientation: 0,
                shape: this.state.heldPiece
            }
            renderCoords = getPieceBlocks(heldPiece);
            for (let i = 0; i < renderCoords.length; i++) {
                pieceRender.push(<div key={'held ' + i} className={'block ' + heldPiece.shape} style={{left: renderCoords[i].x * BLOCK_SCALE + BLOCK_SCALE * 14, bottom:renderCoords[i].y * BLOCK_SCALE + Math.floor(BLOCK_SCALE * 10), width: BLOCK_SCALE - 1, height: BLOCK_SCALE - 1}} />)
            }
        }
        return pieceRender;
    }
    renderBoard() {
        const { board } = this.state;
        let boardGrid = [];
        for (let x = 0; x < 12; x++) {
            boardGrid[x] = [];
            for (let y = 0; y < 21; y++) {
                const shape = convertBoardCodeToShape(board[x][y])
                const blockWidth = shape === 'E' || shape === 'B' ? BLOCK_SCALE : BLOCK_SCALE - 1
                const pieceClass = 'block ' + shape;
                if (x === 0) {
                    if (y > 0)
                        boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (20 - y) * BLOCK_SCALE - 1, left: (x) * BLOCK_SCALE - 1, width: blockWidth + 1, height: blockWidth, borderRight: '1px solid lightgrey'}} className={pieceClass} />;
                    else
                        boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (20 - y) * BLOCK_SCALE - 1, left: (x) * BLOCK_SCALE - 1, width: blockWidth + 1, height: blockWidth}} className={pieceClass} />;    
                } else {
                    boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (20 - y) * BLOCK_SCALE - 1, left: (x) * BLOCK_SCALE, width: blockWidth, height: blockWidth}} className={pieceClass} />;
                }

                // boardGrid.push(<div key={`x: ${x}, y: ${y}`} style={{top: (20 - y) * BLOCK_SCALE + 1, left: (x) * BLOCK_SCALE, width: blockWidth, height: blockWidth}} className={'block E'}  />);
                
            }
        }
        return boardGrid;
    }
    render() {
        return (
            <div className="Board">
                <button onClick={this.pause}>Pause</button>&nbsp;&nbsp;&nbsp;<button onClick={this.newGame}>New Game</button>&nbsp;&nbsp;&nbsp;{this.state.lost ? <span style={{fontWeight: 900}}>You Lost! Click "New Game" to play again.</span> : null}<br /><br /><span>Move with arrow keys. Z rotates left, X rotates right, and C holds the current piece</span><br /><br /><span>Score: {this.state.score}</span><br /><br />
                <div className="board" tabIndex="0" style={{width: BLOCK_SCALE * 12, height: BLOCK_SCALE * 20 + 1}} ref={this.boardRef} onKeyDown={e => this.handleInput(e.key)}>
                    <div className="holder" style={{width: BLOCK_SCALE * 4 + 10, height: BLOCK_SCALE * 6, left: BLOCK_SCALE * 12 + 10, top: -1}}>
                    Next
                    </div>
                    <div className="holder" style={{width: BLOCK_SCALE * 4 + 10, height: BLOCK_SCALE * 6, left: BLOCK_SCALE * 12 + 10, top: BLOCK_SCALE * 6 + 9}}>
                    Hold
                    </div>
                    {this.renderBoard()}
                    {this.renderPieces()}
                    
                </div>
            </div>
        )
    }
}

export default Board;