import React, { Component } from 'react';

class Landing extends Component {
    render() {
        return (
            <div>
                <h1 style={{fontWeight: 900, marginBottom: 10, fontSize: '18px'}}>Welcome to T!</h1>
                <p style={{fontWeight: 900, marginBottom: 10}}>Default controls:</p>
                <p>Arrow keys: move piece<br />
                Arrow key up: hard drop current piece<br />
                z: rotate counterclockwise<br />
                x: rotate clockwise<br />
                c: hold current piece</p>
            </div>
        )
    }
}

export default Landing;