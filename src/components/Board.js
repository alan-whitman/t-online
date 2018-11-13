import React, { Component } from 'react';
import './Board.css';

class Board extends Component {
    constructor() {
        super();
        let board = [];
        for (let row = 0; row < 24; row++) {
            board[row] = [];
            for (let column = 0; column < 10; column++) {
                if (row > 19)
                    board[row][column] = -1;
                else 
                    board[row][column] = 0;
            }
        }
        this.state = {
            board,
            anchorX: 4,
            anchorY: 0,
            interval: -1
        }
        console.log(this.state.board)
        this.renderPiece = this.renderPiece.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.tick = this.tick.bind(this);
    }
    componentDidMount() {
        let interval = setInterval(this.tick, 100);
        this.setState({interval});
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
        console.log(clearLines);
        while (clearLines[0]) {
            let line = clearLines.pop();
            for (let n = line; n > 0; n--) {
                board[n] = board[n - 1];
                console.log(board[n]);
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
        piece.push(<div key="0" className="block" style={{left: this.state.anchorX * 30, top: this.state.anchorY * 30 }} />)
        piece.push(<div key="1" className="block" style={{left: (this.state.anchorX + 1) * 30, top: this.state.anchorY * 30 }} />)
        piece.push(<div key="2" className="block" style={{left: this.state.anchorX * 30, top: (this.state.anchorY + 1) * 30 }} />)
        piece.push(<div key="3" className="block" style={{left: (this.state.anchorX + 1) * 30, top: (this.state.anchorY + 1) * 30 }} />)
        return piece;
    }
    renderBoard() {
        const { board } = this.state;
        let boardGrid = [];
        for (let row = 0; row < 20; row++) {
            boardGrid[row] = [];
            for (let column = 0; column < 10; column++) {
                if (board[row][column] === 0)
                    boardGrid[row][column] = <div key={'' + row + column} style={{left: column * 30, top: row * 30}} className="empty" />;
                else
                    boardGrid[row][column] = <div key={'' + row + column} style={{left: column * 30, top: row * 30}} className="block" />;
            }
        }
        return boardGrid;
    }
    render() {
        return (
            <div className="Board">
                <div className="board" tabIndex="0" onKeyDown={e => this.handleInput(e.key)}>
                    {this.renderBoard()}
                    {this.renderPiece()}
                </div>
            </div>
        )
    }
}


export default Board;