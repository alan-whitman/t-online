import React, { Component } from 'react';
import './Board.css';
import { convertNumToClass } from '../controllers/shape_styles';
const BLOCK_SIZE = 30;

class Board extends Component {
    constructor() {
        super();
        let board = [];
        for (let column = 0; column < 12; column++) {
            board[column] = [];
            for (let row = 0; row < 21; row++) {
                if (row === 0 || column === 0 || column === 11)
                    board[column][row] = -1;
                else 
                    board[column][row] = 0;
            }
        }
        console.log(board);
        this.state = {
            board,
            anchorX: 5,
            anchorY: 20,
            interval: -1
        }
        this.renderPiece = this.renderPiece.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.tick = this.tick.bind(this);
        this.boardRef = React.createRef();
    }
    componentDidMount() {
        // let interval = setInterval(this.tick, 200);
        // this.setState({interval});
        this.boardRef.current.focus();
    }
    canMove({direction, shape, orientation}) {

    }
    newPiece() {
        this.setState({anchorX: 4, anchorY: 0});
    }
    checkForClears() {
        let { board } = this.state;
        let clearLines = [];
        for (let row = 19; row >= 0; row--) {
            let clears = true;
            for (let column = 0; column < 10; column++) {
                if (board[row][column] === 0)
                    clears = false;
            }
            if (clears)
                clearLines.push(row);
        }
        while (clearLines[0]) {
            let line = clearLines.pop();
            for (let n = line; n > 0; n--) {
                board[n] = board[n - 1];

            }
            board[0] = [0,0,0,0,0,0,0,0,0,0];
        }
        this.setState({board})
    }
    tick() {
        const { anchorX, anchorY } = this.state;
        let { board } = this.state;
        if (board[anchorY + 2][anchorX] !== 0 || board[anchorY + 2][anchorX + 1] !== 0) {
            board[anchorY][anchorX] = 1;
            board[anchorY + 1][anchorX] = 1;
            board[anchorY][anchorX + 1] = 1;
            board[anchorY + 1][anchorX + 1] = 1;
            this.setState({board});
            this.checkForClears();
            this.newPiece();
            return;
        }
        else
            this.setState({anchorY: this.state.anchorY + 1});
    }
    handleInput(key) {
        switch (key) {
            case 'ArrowLeft':
                if (this.state.anchorX > 0)
                    this.setState({anchorX: this.state.anchorX - 1});
                break;
            case 'ArrowRight':
                if (this.state.anchorX < 8)
                    this.setState({anchorX: this.state.anchorX + 1});
                break;
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            default:
                return;
        }
    }
    renderPiece() {
        let piece = [];
        piece.push(<div key="0" className="red-block" style={{left: this.state.anchorX * BLOCK_SIZE, top: (20 - this.state.anchorY) * BLOCK_SIZE }} />)
        piece.push(<div key="1" className="red-block" style={{left: (this.state.anchorX + 1) * BLOCK_SIZE, top: (20 - this.state.anchorY) * BLOCK_SIZE }} />)
        piece.push(<div key="2" className="red-block" style={{left: this.state.anchorX * BLOCK_SIZE, top: (21 - this.state.anchorY) * BLOCK_SIZE }} />)
        piece.push(<div key="3" className="red-block" style={{left: (this.state.anchorX + 1) * BLOCK_SIZE, top: (21 - this.state.anchorY) * BLOCK_SIZE }} />)
        return piece;
    }
    renderBoard() {
        const { board } = this.state;
        let boardGrid = [];
        for (let column = 1; column < 11; column++) {
            boardGrid[column] = [];
            for (let row = 1; row < 21; row++) {
                let style = convertNumToClass(board[column][row]);
                boardGrid[column][row] = <div key={`row: ${row}, column: ${column}`} style={{top: (20 - row) * BLOCK_SIZE, left: (column - 1) * BLOCK_SIZE}} className={style} />;
            }
        }
        return boardGrid;
    }
    render() {
        return (
            <div className="Board">
                <div className="board" tabIndex="0" ref={this.boardRef} onKeyDown={e => this.handleInput(e.key)}>
                    {this.renderBoard()}
                    {this.renderPiece()}
                </div>
            </div>
        )
    }
}


export default Board;