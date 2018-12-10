import React, { Component } from 'react';
import './Landing.css';
import 'hacktimer';
import { convertBoardCodeToShape } from '../controllers/tetrominos';

class Landing extends Component {
    constructor() {
        super();
        this.state = {
            interval: -1,
            pieces: [],
            keyCount: 0,
            t: []
        }
        this.landingRef = React.createRef();
        this.makeItRain = this.makeItRain.bind(this);
    }
    componentDidMount() {
        this.buildT();
        const interval = setInterval(this.makeItRain, 250);
        this.setState({interval});
        this.makeItRain();
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }
    buildT() {
        let t = [];
        let blockStyle;
        for (let y = 0; y < 31; y++) {
            t[y] = [];
            for (let x = 0; x < 32; x++) {
                if (y < 9 && y > 3 && x > 1 && x < 30)
                    blockStyle = 'vis';
                else if (x > 12 && x < 19 && y > 3 && y < 27)
                    blockStyle = 'vis';
                else
                    blockStyle = 'invis';
                t[y][x] = <div key={'x: ' + x + ', y: ' + y} className={blockStyle} style={{left: 20 * x, top: 20 * y}}></div> 

            }
        }
        this.setState({t});
    }
    makeItRain() {
        let { pieces } = this.state;
        const left = Math.floor(Math.random() * 540) + 60;
        const rotationDirection = Math.floor(Math.random() * 2) === 0 ? 'left' : 'right';
        const blockType = convertBoardCodeToShape(Math.floor(Math.random() * 7) + 1).toLowerCase();
        pieces.push(            
            <div key={this.state.keyCount} className={blockType + ' splash-block'} style={{left, animation: 'piece-spin-' + rotationDirection + ' infinite 5s linear, piece-drop 1 5s linear forwards'}}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
        if (pieces.length > 20)
            pieces.shift();
        this.setState({pieces, keyCount: this.state.keyCount + 1});
    }
    render() {
        const docWidth = document.documentElement.clientWidth;
        return (
            <div className="Landing" ref={this.landingRef} style={{position: 'relative', left: Math.floor(docWidth / 2) - 350}}>
                <div>
                    {this.state.pieces}
                </div>
                <div>
                    {this.state.t}
                </div>
            </div>
        )
    }
}

export default Landing;