import React, { Component } from 'react';
import './Board.css';
import { convertNumToClass } from '../controllers/shape_styles';
import { clearTopLine, calculatePotentialBlock, checkCollision } from '../controllers/board_controller';
import { getPieceBlocks } from '../controllers/tetrominos';
const BLOCK_SIZE = 30;

class Board extends Component {
    constructor() {
        super();
        let board = [];
        for (let x = 0; x < 12; x++) {
            board[x] = [];
            for (let y = 0; y < 21; y++) {
                if (y === 0 || x === 0 || x === 11)
                    board[x][y] = -1;
                else 
                    board[x][y] = 0;
            }
        }
        this.state = {
            board,
            anchorX: 5,
            anchorY: 22,
            interval: -1,
            paused: false,
            speed: 200
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
    canMove({direction, shape, orientation}) {

    }
    newPiece() {
        this.setState({anchorX: 5, anchorY: 22});
    }
    hardDrop() {
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
    tick() {
        const { anchorX, anchorY } = this.state;
        let { board } = this.state;
        if (board[anchorX][anchorY - 2] !== 0 || board[anchorX + 1][anchorY - 2] !== 0) {
            board[anchorX][anchorY] = 1;
            board[anchorX][anchorY - 1] = 1;
            board[anchorX + 1][anchorY] = 1;
            board[anchorX + 1][anchorY - 1] = 1;
            this.setState({board});
            this.checkForClears();
            this.newPiece();
            return;
        }
        else
            this.setState({anchorY: this.state.anchorY - 1});
    }
    handleInput(key) {
        const { board, anchorX, anchorY } = this.state;
        let potentialBlock;
        if (this.state.paused) {
            if(key === ' ') {
                return this.pause();
            }
            else {
                return;
            
            }
        }
        switch (key) {
            case 'ArrowLeft':
                potentialBlock = calculatePotentialBlock('LEFT', anchorX, anchorY);
                if (checkCollision(board, potentialBlock))
                    this.setState({anchorX: anchorX - 1});
                break;
            case 'ArrowRight':
                potentialBlock = calculatePotentialBlock('RIGHT', anchorX, anchorY);
                if (checkCollision(board, potentialBlock))
                    this.setState({anchorX: anchorX + 1});
                break;
            case 'ArrowUp':
                this.hardDrop();
                break;
            case 'ArrowDown':
                potentialBlock = calculatePotentialBlock('DOWN', anchorX, anchorY);
                if (checkCollision(board, potentialBlock))
                    this.setState({anchorY: anchorY - 1});
                break;
            case ' ':
                this.pause();
                break;
            default:
                return;
        }
    }
    renderPiece() {
        // const { piece } = this.state;
        const piece = {shape: 'T', orientation: 0, x: 5, y: 22}
        let renderCoords = getPieceBlocks(piece);
        let pieceRender = [];
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key="0" className={convertNumToClass(1)} style={{left: renderCoords[i].x * BLOCK_SIZE, top: renderCoords[i].y * BLOCK_SIZE}} />)
        }
        

        // piece.push(<div key="0" className="red-block" style={{left: (this.state.anchorX) * BLOCK_SIZE, top: (20 - this.state.anchorY) * BLOCK_SIZE }} />)
        // piece.push(<div key="1" className="red-block" style={{left: (this.state.anchorX + 1) * BLOCK_SIZE, top: (20 - this.state.anchorY) * BLOCK_SIZE }} />)
        // piece.push(<div key="2" className="red-block" style={{left: (this.state.anchorX) * BLOCK_SIZE, top: (21 - this.state.anchorY) * BLOCK_SIZE }} />)
        // piece.push(<div key="3" className="red-block" style={{left: (this.state.anchorX + 1) * BLOCK_SIZE, top: (21 - this.state.anchorY) * BLOCK_SIZE }} />)
        return pieceRender;
    }
    renderBoard() {
        const { board } = this.state;
        let boardGrid = [];
        for (let x = 0; x < 12; x++) {
            boardGrid[x] = [];
            for (let y = 0; y < 22; y++) {
                let style = convertNumToClass(board[x][y]);
                boardGrid[x][y] = <div key={`y: ${y}, x: ${x}`} style={{top: (20 - y) * BLOCK_SIZE, left: (x) * BLOCK_SIZE}} className={style} />;
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