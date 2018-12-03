import React, { Component } from 'react';
import './Settings.css';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controls: {
                left: this.props.settings.left,
                right: this.props.settings.right,
                down: this.props.settings.down,
                rotateClockwise: this.props.settings.rotateClockwise,
                rotateCounterClockwise: this.props.settings.rotateCounterClockwise,
                hardDrop: this.props.settings.hardDrop,
                holdPiece: this.props.settings.holdPiece,
                pause: this.props.settings.pause
            },
            message: ''
        }
        this.defaultControls = this.defaultControls.bind(this);
        this.updateSettingsCheck = this.updateSettingsCheck.bind(this);
    }
    updateInput(e) {
        const { name } = e.target;
        const { key } = e;
        e.preventDefault();
        if (e.key === ' ')
            this.setState({controls: {...this.state.controls, [name]: 'Space'}});
        else
            this.setState({controls: {...this.state.controls, [name]: key}});
    }
    defaultControls() {
        this.setState({
            controls: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                down: 'ArrowDown',
                rotateClockwise: 'x',
                rotateCounterClockwise: 'z',
                hardDrop: 'ArrowUp',
                holdPiece: 'c',
                pause: 'Space'
            }
        });
    }
    updateSettingsCheck() {
        let settingCheck = true;
        for (let setting in this.state.controls) {
            for (let otherSetting in this.state.controls) {
                if (this.state.controls[setting] === this.state.controls[otherSetting])
                    if (setting !== otherSetting)
                        settingCheck = false;
                    
            }
        }
        if (!settingCheck)
            this.setState({message: 'Each control input must be unique.'})
        else {
            this.props.updateSettings(this.state.controls);
            this.setState({message: 'Settings Updated'});
        }
    }
    render() {
        return (
            <div className="Settings">
                <h2>User Settings</h2>
                <hr />
                {!this.props.isLoggedIn ?
                    <p>Note: user settings will be lost if you leave this site or close your browser. In order to save user settings, please log in.</p>
                : null}
                <h3>Controls</h3>
                <div className="user-settings">
                    <div>Move piece left:</div>
                    <div><input name="left" value={this.state.controls.left} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Move piece right:</div>
                    <div><input name="right" value={this.state.controls.right} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Move piece down:</div>
                    <div><input name="down" value={this.state.controls.down} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Rotate piece clockwise:</div>
                    <div><input name="rotateClockwise" value={this.state.controls.rotateClockwise} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Rotate piece counterclockwise:</div>
                    <div><input name="rotateCounterClockwise" value={this.state.controls.rotateCounterClockwise} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Hard drop:</div>
                    <div><input name="hardDrop" value={this.state.controls.hardDrop} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Hold current piece:</div>
                    <div><input name="holdPiece" value={this.state.controls.holdPiece} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>Pause (singleplayer only):</div>
                    <div><input name="pause" value={this.state.controls.pause} onKeyDown={e => this.updateInput(e)} /></div>
                    <div>
                        <button className="ui-button" onClick={this.updateSettingsCheck}>Save</button> <button className="ui-button" onClick={this.defaultControls}>Default Controls</button><br /><br />
                        <p>{this.state.message ? this.state.message : <br />}</p>
                    </div>
                    <div></div>
                </div>
                <hr />
                <h3>Delete Account</h3>
                <p>WARNING: This action is irreversible. Your game history and rank will be permanently deleted.</p>
            </div>
        )
    }
}

export default Settings;