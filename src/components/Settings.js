import React, { Component } from 'react';
import './Settings.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
    
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
            controlMsg: '',
            detailsMsg: '',
            passwordMsg: '',
            newPassword: '',
            newPasswordConfirm: '',
            email: this.props.user.email
        }
        this.defaultControls = this.defaultControls.bind(this);
        this.updateSettingsCheck = this.updateSettingsCheck.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.updateDetailsCheck = this.updateDetailsCheck.bind(this);
        this.resendVerification = this.resendVerification.bind(this);
        this.updatePasswordCheck = this.updatePasswordCheck.bind(this);
    }
    deleteAccount() {
        const response = prompt('THIS ACTION CANNOT BE REVERSED! ENTER \'DELETE\' (CASE SENSITIVE) TO CONTINUE.');
        if (response === 'DELETE')
            this.props.deleteAccount();
    }
    updateControls(e) {
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
        }, () => this.props.updateSettings(this.state.controls));
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
            this.setState({controlMsg: 'Each control input must be unique.'})
        else {
            this.props.updateSettings(this.state.controls);
            this.setState({controlMsg: 'Settings Updated'});
        }
    }
    updateDetailsCheck() {
        if (!this.state.email.trim())
            return this.setState({detailsMsg: 'Zero length strings aren\'t email addresses.'});
        else if (this.props.user.email === this.state.email) {
            return this.setState({detailsMsg: 'That\'s not a new email address.'});
        }
        else {
            this.props.updateEmail(this.state.email);
        }
    }
    resendVerification() {
        this.props.resendVerification();
        this.setState({detailsMsg: 'Another verification email has been sent.'})
    }
    updateFields(e) {
        const { name, value } = e.target;
        this.setState({[name]: value});
    }
    updatePasswordCheck() {
        if (this.state.newPassword.trim() === '')
            return this.setState({passwordMsg: 'Your new password cannot be a zero length string.'})
        if (this.state.newPassword !== this.state.newPasswordConfirm)
            return this.setState({passwordMsg: 'Your new password must be the same in both fields.'});
        const { newPassword } = this.state;
        axios.put('/auth/update_password', {newPassword}).then(res => {
            this.props.logout();
            this.props.history.push('/passwordchange');
        }).catch(err => this.setState({passwordMsg: err.response.data}));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.settingsMsg !== this.props.settingsMsg)
            this.setState({detailsMsg: this.props.settingsMsg});
        if (prevProps.settings !== this.props.settings)
            this.setState({settings: this.props.settings});
    }
    render() {
        return (
            <div className="Settings">
                <h2>User Settings</h2>
                <hr />
                {!this.props.isLoggedIn ?
                    <div className="not-logged-in">
                        <p>Note: user settings will be lost if you leave this site or close your browser. In order to save user settings, please log in.</p>
                        <p>If you need to reset your password, click <Link to="/resetpassword">here</Link>.</p>
                        <hr />
                    </div>
                : null}
                <h3>Controls</h3>
                <div className="user-settings control-fields">
                    <div>Move piece left:</div>
                    <div><input name="left" value={this.state.controls.left} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Move piece right:</div>
                    <div><input name="right" value={this.state.controls.right} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Move piece down:</div>
                    <div><input name="down" value={this.state.controls.down} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Rotate piece clockwise:</div>
                    <div><input name="rotateClockwise" value={this.state.controls.rotateClockwise} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Rotate piece counterclockwise:</div>
                    <div><input name="rotateCounterClockwise" value={this.state.controls.rotateCounterClockwise} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Hard drop:</div>
                    <div><input name="hardDrop" value={this.state.controls.hardDrop} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Hold current piece:</div>
                    <div><input name="holdPiece" value={this.state.controls.holdPiece} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                    <div>Pause (singleplayer only):</div>
                    <div><input name="pause" value={this.state.controls.pause} onKeyDown={e => this.updateControls(e)} readOnly /></div>
                </div>
                <div>
                    <button className="ui-button" onClick={this.updateSettingsCheck}>Save Controls</button> <button className="ui-button" onClick={this.defaultControls}>Restore Defaults</button><br /><br />
                    {this.state.controlMsg ? 
                        <p>{this.state.controlMsg}</p>
                    :
                        <p><br /></p>
                    }
                </div>
                {this.props.isLoggedIn ? 
                    <div>
                        <hr />
                        <h3>Account Details</h3> 
                        <div className="user-settings">
                            <div>Username</div>
                            <div>{this.props.user.username}</div>
                            <div>Email Address ({this.props.user.verified ? 'Verified' : 'Unverified'})</div>
                            <div><input name="email" value={this.state.email} onChange={e => this.updateFields(e)} className="field" /></div>
                        </div>
                        <div>
                            <button className="ui-button" onClick={this.updateDetailsCheck}>Update Email Address</button> {!this.props.user.verified ? <button className="ui-button" onClick={this.resendVerification}>Resend Verification Email</button> : null}<br /><br />
                            {this.state.detailsMsg ? 
                                <p>{this.state.detailsMsg}</p>
                            :
                                <p><br /></p>
                            }
                            <p><br />Note: Emails are sent from play.t.online@gmail.com. If you are having trouble receiving emails, please whitelist that address.</p>
                        </div>
                        <hr />
                        <h3>Change Password</h3>
                        <div className="user-settings">
                            <div>New Password</div>
                            <div><input type="password" name="newPassword" value={this.state.newPassword} onChange={e => this.updateFields(e)} className="field" /></div>
                            <div>Confirm New Password</div>
                            <div><input type="password" name="newPasswordConfirm" value={this.state.newPasswordConfirm} onChange={e => this.updateFields(e)} className="field" /></div>
                        </div>
                        <div>
                            <button className="ui-button" onClick={this.updatePasswordCheck}>Change Password</button><br /><br />
                            {this.state.passwordMsg ? 
                                <p>{this.state.passwordMsg}</p>
                            :
                                <p><br /></p>
                            }
                            <p><br />Note: Changing your password will force a logout.</p>
                        </div>
                        <div>
                            <hr />
                            <h3>Delete Account</h3>
                            <p style={{marginBottom: 20}}>WARNING: This action is irreversible. Your game history and rank will be permanently deleted.</p>
                            <button className="ui-button" onClick={this.deleteAccount}>Delete Account</button>
                        </div>
                    </div>
                : null}
            </div>
        )
    }
}

export default Settings;