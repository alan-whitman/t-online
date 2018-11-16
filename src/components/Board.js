import React, { Component } from 'react';
import './Board.css';
import { clearTopLine, getPotentialBlock, canMove, writeBoard, createBoard } from '../controllers/board_controller';
import { getPieceBlocks, getBoardCode, shuffleShapes, convertBoardCodeToShape } from '../controllers/tetrominos';
const BLOCK_SIZE = 30;
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
            speed: 1000,
            shapeOrder,
            currentShape: 1,
            piece: {
                x: 5,
                y: 20,
                shape: shapeOrder[0],
                orientation: 0
            }
        }
        this.renderPiece = this.renderPiece.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.pause = this.pause.bind(this);
        this.tick = this.tick.bind(this);
        this.boardRef = React.createRef();
    }
    componentDidMount() {
        let interval = setInterval(this.tick, this.state.speed);
        this.setState({interval});
        this.boardRef.current.focus();
    }
    newPiece() {
        let { currentShape } = this.state;
        let nextShape;
        if (currentShape === 6) {
            currentShape = 0;
            nextShape = this.state.shapeOrder[6]
            this.setState({shapeOrder: shuffleShapes()});
        }  else {
            nextShape = this.state.shapeOrder[currentShape];
            currentShape++
        }
        this.setState({piece: {...this.state.piece, x: 5, y: 20, orientation: 0, shape: nextShape}, currentShape});
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
        if (!this.state.paused) {
            clearInterval(this.state.interval)
            this.setState({paused: true})
        }
        else {
            this.tick();
            let interval = setInterval(this.tick, this.state.speed);
            this.setState({interval, paused: false})
            this.boardRef.current.focus();
        }
     
    }
    checkForClears() {
        let { board } = this.state;
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
        while (clearLines[0]) {
            let line = clearLines.pop();
            for (let y = line; y < 20; y++) {
                for (let x = 1; x <= 10; x++)
                    board[x][y] = board[x][y + 1];

            }
            board = clearTopLine(board);
        }
        this.setState({board})
    }
    landPiece() {
        let { board } = this.state;
        let currentBlocks = getPieceBlocks(this.state.piece);
        let boardCopy = board.slice();
        board = writeBoard(boardCopy, currentBlocks, this.state.piece.shape);
        console.log(board);
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
    handleInput(key) {
        const { board } = this.state;
        const { x, y }  = this.state.piece;
        const { piece } = this.state;
        let potentialBlock;
        let potentialPiece;
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
    renderPiece() {
        let renderCoords = getPieceBlocks(this.state.piece);
        let pieceRender = [];
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={i} className={'block ' + this.state.piece.shape} style={{left: renderCoords[i].x * BLOCK_SIZE, bottom:  (renderCoords[i].y - 1) * BLOCK_SIZE}} />)
        }
        let shadowPiece = this.getShadow();
        renderCoords = getPieceBlocks(shadowPiece);
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={'shadow ' + i} className="block shadow" style={{left: renderCoords[i].x * BLOCK_SIZE, bottom:  (renderCoords[i].y - 1) * BLOCK_SIZE}} />)
        }

        return pieceRender;
    }
    renderBoard() {
        const { board } = this.state;
        let boardGrid = [];
        for (let x = 0; x < 12; x++) {
            boardGrid[x] = [];
            for (let y = 0; y < 21; y++) {
                let pieceClass = 'block ' + convertBoardCodeToShape(board[x][y]);
                boardGrid[x][y] = <div key={`y: ${y}, x: ${x}`} style={{top: (20 - y) * BLOCK_SIZE + 1, left: (x) * BLOCK_SIZE}} className={pieceClass} />;
            }
        }
        return boardGrid;
    }
    render() {
        return (
            <div className="Board">
                <button onClick={this.pause}>Pause</button><br /><br />
                <div className="board" tabIndex="0" ref={this.boardRef} onKeyDown={e => this.handleInput(e.key)}>
                    {this.renderBoard()}
                    {this.renderPiece()}
                </div>
            </div>
        )
    }
}

export default Board;