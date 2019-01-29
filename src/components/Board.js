import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import 'hacktimer';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Board.css';
import Message from './Message';
import { clearTopLine, getPotentialBlock, canMove, writeBoard, createBoard, addGarbage } from '../controllers/board_controller';
import { getPieceBlocks, shuffleShapes, convertBoardCodeToShape, getCenterOffset } from '../controllers/tetrominos';

let socket = {disconnect () {}};

const LEFT = 'LEFT';
const RIGHT = 'RIGHT';
const DOWN = 'DOWN';
const INITIAL_X = 5;
const INITIAL_Y = 21;

class Board extends Component {
    constructor(props) {
        super(props);
        let shapeOrder = shuffleShapes();
        const initialSpeed = this.props.mode === 'sp' ? 800 : 500;
        this.state = {
            board: createBoard(),
            opBoard: createBoard(),
            op: '',
            interval: -1,
            paused: false,
            lost: true,
            swapped: false,
            mpGameOver: false,
            countingDown: false,
            heldPiece: '',
            initialSpeed,
            currentSpeed: initialSpeed,
            shapeOrder,
            currentShape: 1,
            nextPiece: shapeOrder[1],
            score: 0,
            level: 1,
            lines: 0,
            chainCount: 0,
            messages: [],
            countDownTimers: [],
            b2btetris: false,
            garbagePile: 0,
            blockScale: this.props.settings.blockScale,
            piece: {
                x: INITIAL_X,
                y: INITIAL_Y,
                shape: shapeOrder[0],
                orientation: 0
            }
        }
        this.renderPieces = this.renderPieces.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.createMessage = this.createMessage.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.startGame = this.startGame.bind(this);
        this.startNewMpGame = this.startNewMpGame.bind(this);
        this.newGame = this.newGame.bind(this);
        this.winGame = this.winGame.bind(this);
        this.pause = this.pause.bind(this);
        this.tick = this.tick.bind(this);
        this.boardRef = React.createRef();
        this.messageRef = React.createRef();
    }
    componentDidMount() {
        // const socketPath = window.location.host.split(':')[0];
        if (this.props.mode === 'mp' && this.props.isLoggedIn) {
            socket = io();

            socket.on('relayBoard', opBoard => {
                this.setState({opBoard});
            });
            socket.on('roomNum', roomMsg => {
                this.createMessage(roomMsg);
            });
            socket.on('startGame', (userList) => {
                const op = userList[0] === this.props.user.username ? userList[1] : userList[0];
                this.createMessage('Player found! Playing against ' + op)
                this.setState({op});
                this.countDown();
            });
            socket.on('userDisconnected', () => {
                this.createMessage('The other player disconnected, so you win by default.');
                this.winGame();
            });
            socket.on('youWin', () => {
                this.createMessage('The other player lost! That means you won.');
                this.winGame();
            });

            socket.on('relayGarbage', (garbage) => {
                this.setState({garbagePile: this.state.garbagePile + garbage});
            });

            const username = this.props.isLoggedIn ? this.props.user.username : 'default username';
            socket.emit('playMp', username);
            this.createMessage('Waiting for another player...')
        }
        else if (this.props.mode === 'mp' && !this.props.isLoggedIn) {
            this.createMessage('you need to be logged in to play MP')
        }
        else if (this.props.mode === 'sp') {
            this.countDown();
        }
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
        this.state.countDownTimers.forEach(interval => clearInterval(interval));
        if (this.props.mode === 'mp')
            socket.disconnect();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.messageRef)
            console.log()
            this.messageRef.current.scrollTop = this.messageRef.current.scrollHeight;
        if (this.state.piece !== prevState.piece && this.props.mode === 'mp') {
            const currentBlocks = getPieceBlocks(this.state.piece);
            let board = this.state.board.map(column => {
                return column.slice();
            });
            board = writeBoard(board, currentBlocks, this.state.piece.shape);
            socket.emit('sendBoard', board);
        }
    }

    /*
        Backend communication
    */

    addToScores() {
        if (this.props.isLoggedIn && this.state.score > 0 && this.props.mode === 'sp') {
            const { score } = this.state;
            axios.post('/sp/add_score', {score}).then(res => {
                this.createMessage('Score recorded!');
            })
        } else if (!this.props.isLoggedIn)
            this.createMessage('Log in or create an account to record your score history');
    }

    /*
        Starting and stopping games
    */

    countDown() {
        this.createMessage('Get ready!');
        let countDownTimers = [];
        countDownTimers.push(setTimeout(() => this.createMessage('3'), 1000));
        countDownTimers.push(setTimeout(() => this.createMessage('2'), 2000));
        countDownTimers.push(setTimeout(() => this.createMessage('1'), 3000));
        countDownTimers.push(setTimeout(() => this.createMessage('GO!'), 4000));
        countDownTimers.push(setTimeout(this.startGame, 4000));
        this.setState({countDownTimers, countingDown: true});
    }
    startGame() {
        clearInterval(this.state.interval);
        let interval = setInterval(this.tick, this.state.initialSpeed);
        this.setState({interval, lost: false, countingDown: false, paused: false});
        if (this.boardRef.current)
            this.boardRef.current.focus();
    }
    winGame() {
        if (this.state.lost) {
            this.createMessage('Opponent disconnected before game began. Click "Play another game" to play again');
            this.state.countDownTimers.forEach(interval => clearTimeout(interval));
            return this.setState({mpGameOver: true, countDownTimers: []});
        }
        axios.post('/mp/update_ratings', {winner: this.props.user.username, loser: this.state.op}).then(res => {
            let newRating;
            res.data.forEach(user => {
                if (user.username === this.props.user.username)
                    newRating = user.rating;
            });
            this.createMessage('Your new rating is ' + newRating);
        }).catch(err => {this.createMessage('No rating change since you played yourself.'); console.error(err);});
        clearInterval(this.state.interval);
        this.setState({mpGameOver: true, op: '', lost: true});
    }

    newGame() {
        if (this.state.countingDown)
            return;
        clearInterval(this.state.interval);
        this.setState({currentSpeed: this.state.initialSpeed, lines: 0, level: 1, score: 0, board: createBoard(), shapeOrder: shuffleShapes(), currentShape: 0, heldPiece: '', paused: false}, this.newPiece);
        this.boardRef.current.focus();
        this.countDown();
    }
    startNewMpGame() {
        this.boardRef.current.focus();
        this.setState({currentSpeed: this.state.initialSpeed, score: 0, board: createBoard(), opBoard: createBoard(), shapeOrder: shuffleShapes(), currentShape: 0, heldPiece: '', mpGameOver: false, paused: false}, this.newPiece);
        const username = this.props.isLoggedIn ? this.props.user.username : 'default username';
        socket.emit('playMp', username);
        this.createMessage('Waiting for another player...')
        this.boardRef.current.focus();
    }

    /*
        Game logic
    */

    increaseSpeed(level) {
        let currentSpeed = Math.floor(((0.8 - ((level - 1) * 0.007)) ** (level - 1)) * 1000);
        clearInterval(this.state.interval);
        let interval = setInterval(this.tick, currentSpeed);
        this.setState({currentSpeed, interval});
    }
    checkForLoss() {
        const { board, piece } = this.state;
        const potentialBlock = getPieceBlocks(piece);
        if (!canMove(board, potentialBlock)) {
            let mpgo = false;
            if (this.props.mode === 'mp') {
                socket.emit('iLost');
                mpgo = true;
            }
            clearInterval(this.state.interval);
            this.setState({lost: true, paused: false, mpGameOver: mpgo});
            const lossMessage = this.props.mode === 'sp' ? 'Game over! CLick "New Game" to play again!' : 'You lost! Sad! Click "Play another game" to play again';
            this.createMessage(lossMessage);
            this.addToScores();
        }
    }
    newPiece(swapped = false) {
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
        this.setState({piece: {...this.state.piece, x: INITIAL_X, y: INITIAL_Y, orientation: 0, shape: nextShape}, currentShape, nextPiece, swapped}, this.checkForLoss);
    }
    getGarbage(lines) {
        let garbage = 0;
        switch (lines) {
            case 1:
                garbage = 0;
                break;
            case 2:
                garbage = 1;
                break;
            case 3:
                garbage = 2;
                break;
            case 4:
                garbage = this.state.b2btetris ? 5 : 4;
                break;
            default:
                garbage = 0;
                break;
        }
        return garbage;
    }
    getScore(lines) {
        //create garbage if in mp mode
        if (this.props.mode === 'mp') {
            let garbage = this.getGarbage(lines);
            if (garbage > 0)
                socket.emit('sendGarbage', garbage);
        }
        //update score
        const { level } = this.state;
        const scoreDict = {
            1: 100,
            2: 300,
            3: 500
        }
        if (this.state.b2btetris && lines === 4) {
            this.createMessage('Back to back TETRIS! ' + level * 1200 + ' points');
            return level * 1200;
        }
        if (lines === 4) {
            this.createMessage('TETRIS! ' + level * 800 + ' points');
            this.setState({b2btetris: true});
            return level * 800;
        }
        let message = `Cleared ${lines} line`;
        message += lines > 1 ? 's!' : '!';
        message += ' ' + level * scoreDict[lines] + ' points';
        this.createMessage(message);
        this.setState({b2btetris: false});
        return level * scoreDict[lines];
    }
    checkForClears() {
        let { board, score, lines } = this.state;
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
        lines += clearLines.length;
        if (clearLines.length > 0)
            score += this.getScore(clearLines.length)
        const level = Math.floor(lines / 10) + 1;
        if (level > this.state.level && this.props.mode === 'sp') {
            this.createMessage('Level up!')
            this.increaseSpeed(level);
        }
        while (clearLines[0]) {
            let line = clearLines.pop();
            for (let y = line; y < 20; y++) {
                for (let x = 1; x <= 10; x++)
                    board[x][y] = board[x][y + 1];
            }
            board = clearTopLine(board);
        }
        this.setState({board, score, lines, level});
        return clearLines.length;
    }
    landPiece() {
        let { board } = this.state;
        let currentBlocks = getPieceBlocks(this.state.piece);
        board = writeBoard([...board], currentBlocks, this.state.piece.shape);
        let linesCleared = this.checkForClears();
        if (this.props.mode === 'mp') {
            const { garbagePile } = this.state;
            const excessGarbage = garbagePile - this.getGarbage(linesCleared);
            if (excessGarbage > 0)
                board = addGarbage(excessGarbage, board);
            else if (excessGarbage < 0)
                socket.emit('sendGarbage', Math.abs(excessGarbage));
        }
        this.setState({board, garbagePile: 0});
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

    /*
        Movement and Controls
    */

    hardDrop() {
        const { board } = this.state;
        let droppingPiece = {...this.state.piece};
        while (true) {
            let potentialBlock = getPotentialBlock(DOWN, droppingPiece);
            if (!canMove(board, potentialBlock)) {
                this.setState({piece: {...this.state.piece, y: droppingPiece.y}}, this.landPiece);
                return;
            }
            droppingPiece.y -= 1
        }
    }
    pause() {
        if (this.state.lost)
            return;
        if (!this.state.paused && this.props.mode !== 'mp') {
            clearInterval(this.state.interval)
            this.setState({paused: true})
        }
        else if (this.props.mode !== 'mp') {
             this.tick();
            let interval = setInterval(this.tick, this.state.currentSpeed);
            this.setState({interval, paused: false})
            this.boardRef.current.focus();
        }
    }
   holdPiece() {
    if (!this.state.heldPiece)
        return this.setState({heldPiece: this.state.piece.shape, swapped: true}, () => this.newPiece(true));
    if (!this.state.swapped) {
        let heldPiece = this.state.piece.shape;
            return this.setState({piece: {...this.state.piece, shape: this.state.heldPiece, x: INITIAL_X, y: INITIAL_Y, orientation: 0}, heldPiece, swapped: true});
        }
    }

    // cry deeply
    handleInput(e) {
        if (this.state.lost || this.state.countingDown)
            return;
        e.preventDefault();
        const { key } = e;
        const { board } = this.state;
        const { x, y }  = this.state.piece;
        const { piece } = this.state;
        let keys = {...this.props.settings};
        for (let key in keys)
            if (keys[key] === 'Space')
                keys[key] = ' ';
        let potentialBlock;
        let potentialPiece;
        if (this.state.paused) {
            if(key === keys.pause) {
                return this.pause();
            }
            else {
                return;
            }
        }
        switch (key) {
            case keys.left:
                potentialBlock = getPotentialBlock(LEFT, piece);
                if (canMove(board, potentialBlock))
                    this.setState({piece: {...this.state.piece, x: x - 1}});
                break;
            case keys.right:
                potentialBlock = getPotentialBlock(RIGHT, piece);
                if (canMove(board, potentialBlock))
                    this.setState({piece: {...this.state.piece, x: x + 1}});
                break;
            case keys.hardDrop:
                this.hardDrop();
                break;
            case keys.down:
                potentialBlock = getPotentialBlock(DOWN, piece);
                if (canMove(board, potentialBlock)) {
                    clearInterval(this.state.interval);
                    const newInterval = setInterval(this.tick, this.state.currentSpeed);
                    this.setState({interval: newInterval, piece: {...this.state.piece, y: y - 1}});
                }
                else
                    this.landPiece();
                break;
            case keys.holdPiece:
                this.holdPiece();
                break;
            case keys.rotateClockwise:
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
            case keys.rotateCounterClockwise:
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
            case keys.pause:
                this.pause();
                break;
            default:
                return;
        }
    }

    /*
        Message handling
    */

    createMessage(message) {
        let { messages } = this.state;
        messages.push(message);
        this.setState({messages});
    }
    renderMessages() {
        if (this.state.messages[0]) {
            const messages = this.state.messages.map((message, i) => {
                return <Message key={i} message={message} />
            });
            return messages;
        }
    }

    /*
        Rendering 
    */

    // Rewrite as functional
    getShadow() {
        const { board } = this.state;
        let droppingPiece = {...this.state.piece};
        while (true) {
            let potentialBlock = getPotentialBlock(DOWN, droppingPiece);
            if (!canMove(board, potentialBlock))
                return droppingPiece;
            droppingPiece.y -= 1
        }
    }

    changeBlockScale(increaseOrDecrease) {
        const newBlockScale = increaseOrDecrease === 'increase' ? this.state.blockScale + 1 : this.state.blockScale - 1;
        if (newBlockScale < 11 || newBlockScale > 100)
            return;
        this.props.updateBlockScale(newBlockScale);
        this.setState({blockScale: newBlockScale});
        this.boardRef.current.focus();
        
    }
    renderPieces() {
        let renderCoords = getPieceBlocks(this.state.piece);
        let pieceRender = [];
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={'piece ' + i} className={'block ' + this.state.piece.shape} style={{left: renderCoords[i].x * this.state.blockScale, bottom:  (renderCoords[i].y) * this.state.blockScale + 3, width: this.state.blockScale - 1 , height: this.state.blockScale - 1}} />)
        }
        let shadowPiece = this.getShadow();
        renderCoords = getPieceBlocks(shadowPiece);
        for (let i = 0; i < renderCoords.length; i++) {
            pieceRender.push(<div key={'shadow ' + i} className="block shadow" style={{left: renderCoords[i].x * this.state.blockScale, bottom:  (renderCoords[i].y) * this.state.blockScale + 3, width: this.state.blockScale - 1 , height: this.state.blockScale - 1}} />)
        }
        const nextPiece = {
            orientation: 0,
            x: 0,
            y: 0,
            shape: this.state.nextPiece
        }
        renderCoords = getPieceBlocks(nextPiece);
        for (let i = 0; i < renderCoords.length; i++) {
            const offset = getCenterOffset(nextPiece.shape, this.state.blockScale);
            pieceRender.push(<div key={'next ' + i} className={'block ' + nextPiece.shape} style={{
                left: renderCoords[i].x * this.state.blockScale + this.state.blockScale * 12 + Math.floor(this.state.blockScale / 2) + Math.floor(this.state.blockScale * 2.25) + offset.x,
                bottom: renderCoords[i].y * this.state.blockScale + Math.floor(this.state.blockScale * 20) - offset.y, 
                width: this.state.blockScale - 1, 
                height: this.state.blockScale - 1
            }}/>)
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
                const offset = getCenterOffset(heldPiece.shape, this.state.blockScale);
                pieceRender.push(<div key={'held ' + i} className={'block ' + heldPiece.shape} style={{
                    left: renderCoords[i].x * this.state.blockScale + this.state.blockScale * 12 + Math.floor(this.state.blockScale / 2) + Math.floor(this.state.blockScale * 2.25) + offset.x, 
                    bottom: renderCoords[i].y * this.state.blockScale + Math.floor(this.state.blockScale * 13.5) - offset.y, 
                    width: this.state.blockScale - 1, 
                    height: this.state.blockScale - 1
                }}/>)
            }
        }
        return pieceRender;
    }
    renderBoard() {
        const { board } = this.state;
        let boardGrid = [];
        for (let x = 0; x < 12; x++) {
            boardGrid[x] = [];
            for (let y = 0; y < 23; y++) {
                let additionalClass = '';
                if (y === 21 && x >= 1 && x <= 10)
                    additionalClass = 'top-border-fix';
                if (y > 21)
                    if (x !== 0 && x !== 11)
                        break;
                const shape = convertBoardCodeToShape(board[x][y])
                const blockWidth = this.state.blockScale;
                const pieceClass = 'landed block ' + shape + ' ' + additionalClass;
                if (x === 0) {
                    if (y > 0)
                        boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (22 - y) * this.state.blockScale - 1, left: (x) * this.state.blockScale - 1, width: blockWidth + 1, height: blockWidth, borderRight: '1px solid lightgrey'}} className={pieceClass} />;
                    else
                        boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (22 - y) * this.state.blockScale - 1, left: (x) * this.state.blockScale - 1, width: blockWidth + 1, height: blockWidth}} className={pieceClass} />;    
                } else {
                    boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (22 - y) * this.state.blockScale - 1, left: (x) * this.state.blockScale, width: blockWidth , height: blockWidth}} className={pieceClass} />;
                }                
            }
        }
        return boardGrid;
    }
    renderOpBoard() {
        const { opBoard: board } = this.state;
        let boardGrid = [];
        for (let x = 0; x < 12; x++) {
            boardGrid[x] = [];
            for (let y = 0; y < 23; y++) {
                const shape = convertBoardCodeToShape(board[x][y])
                const blockWidth = this.state.blockScale;
                const pieceClass = 'landed block ' + shape;
                if (shape === 'E' && y > 21)
                    break;
                let br;
                if (y === 21 && x > 0 && x < 11)
                    br = 'none';
                if (x === 0) {
                    if (y > 0)
                        boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (22 - y) * this.state.blockScale - 1, left: ((x) * this.state.blockScale - 1) + Math.floor(this.state.blockScale * 17.5), width: blockWidth + 1, height: blockWidth, borderRight: '1px solid lightgrey'}} className={pieceClass} />;
                    else
                        boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (22 - y) * this.state.blockScale - 1, left: ((x) * this.state.blockScale - 1) + Math.floor(this.state.blockScale * 17.5), width: blockWidth + 1, height: blockWidth}} className={pieceClass} />;    
                } else {
                    boardGrid[x][y] = <div key={`x: ${x}, y: ${y}`} style={{top: (22 - y) * this.state.blockScale - 1, left: ((x) * this.state.blockScale) + Math.floor(this.state.blockScale * 17.5), width: blockWidth, height: blockWidth, borderRight: br}} className={pieceClass} />;
                }                
            }
        }
        return boardGrid;
    }

    render() {
        const messageOffset = this.props.mode === 'sp' ? this.state.blockScale * 15 + Math.floor(this.state.blockScale * 2.5) - 1 : this.state.blockScale * 28 + + Math.floor(this.state.blockScale * 2) - 1;
        return (
            <div className="Board">
                {this.props.mode === 'sp' ?
                    <div>
                        <button onClick={this.pause} className="ui-button">Pause</button>
                        <button onClick={this.newGame} className="ui-button">New Game</button><br /><br />
                    </div>
                : null}
                <div className="scoreboard-holder">
                    <span className="scoreboard">Score: {this.state.score}</span>
                    <span className="scoreboard">Lines: {this.state.lines}</span> 
                    {this.props.mode === 'sp' ? 
                        <span className="scoreboard">Level: {this.state.level}</span>
                    : null}
                    {this.state.mpGameOver ?
                        <button onClick={this.startNewMpGame} className="ui-button">Play another game</button>
                    : null}
                    <button onClick={e => this.changeBlockScale('decrease')} className="ui-button">-</button>
                    <button onClick={e => this.changeBlockScale('increase')} className="ui-button">+</button>
                </div>
                
                <div className="board" tabIndex="0" style={{width: this.state.blockScale * 12, height: this.state.blockScale * 23 + 1}} ref={this.boardRef} onKeyDown={e => this.handleInput(e)}>
                    <div className="holder" style={{width: Math.floor(this.state.blockScale * 4.5), height: this.state.blockScale * 6, left: this.state.blockScale * 12 + Math.floor(this.state.blockScale / 2), top: this.state.blockScale * 2 - 1, fontSize: Math.floor(this.state.blockScale * .75)}}>
                        Next
                    </div>
                    <div className="holder" style={{width: Math.floor(this.state.blockScale * 4.5), height: this.state.blockScale * 6, left: this.state.blockScale * 12 + Math.floor(this.state.blockScale / 2), top: this.state.blockScale * 8 + Math.floor(this.state.blockScale / 2) - 1, fontSize: Math.floor(this.state.blockScale * .75)}}>
                        Hold
                    </div>
                    <div className="message-holder" ref={this.messageRef} style={{left: messageOffset, top: this.state.blockScale * 2 - 1, width: this.state.blockScale * 12, height: this.state.blockScale * 12 + Math.floor(this.state.blockScale / 2), fontSize: Math.floor(this.state.blockScale * .75)}}>
                        <ReactCSSTransitionGroup
                            transitionName="message"
                            transitionEnterTimeout={200}
                            transitionLeaveTimeout={0}>
                            {this.renderMessages()}
                        </ReactCSSTransitionGroup>
                    </div>
                    {this.renderBoard()}
                    {this.props.mode === 'mp' ? this.renderOpBoard() : null}
                    {this.props.mode === 'mp' ? 
                        <div className="opponent-label" style={{
                            left: 0, 
                            bottom: -this.state.blockScale,
                            width: this.state.blockScale * 12,
                            fontSize: this.state.blockScale + 3
                        }}>{this.props.user.username}</div>    
                    
                    : null}
                    {this.state.op ?
                        <div className="opponent-label" style={{
                            left: Math.floor(this.state.blockScale * 17.5), 
                            bottom: -this.state.blockScale,
                            width: this.state.blockScale * 12,
                            fontSize: this.state.blockScale + 3 
                        }}>{this.state.op}</div>    
                    : null}
                    {this.state.paused ?
                        <div className="paused" style={{
                            left: Math.floor(this.state.blockScale * 17.5), 
                            bottom: this.state.blockScale * 8,
                            width: this.state.blockScale * 12,
                            fontSize: this.state.blockScale + 3,
                            textAlign: 'center'
                        }}>Paused</div>
                    : null}
                    {this.props.isLoggedIn || this.props.mode === 'sp' ? this.renderPieces() : null}
                </div>
            </div>
        )
    }
}

export default Board;