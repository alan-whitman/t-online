import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import './Recover.css';
import './Settings.css';

class Recover extends Component {
    constructor() {
        super();
        this.state = {
            recoveryCode: '',
            msg: '',
            newPassword: '',
            newPasswordConfirm: ''
        }
        this.recoverAccount = this.recoverAccount.bind(this);
    }
    componentDidMount() {
        const queries = queryString.parse(this.props.location.search);
        if (queries.rc)
            this.setState({recoveryCode: queries.rc});
        else
            this.setState({msg: 'You appear to have reached this page on accident, or are trying to do something weird, you weirdo.'})
    }
    updateFields(e) {
        const { name, value } = e.target;
        this.setState({[name]: value});
    }
    recoverAccount() {
        this.setState({msg: ''});
        if (this.state.newPassword.trim() === '')
            return this.setState({msg: 'Your new password cannot be a zero length string.'})
        if (this.state.newPassword !== this.state.newPasswordConfirm)
            return this.setState({msg: 'Your new password must be the same in both fields.'});
        const { newPassword, recoveryCode } = this.state;
        axios.post('/auth/recover_account', {newPassword, recoveryCode}).then(res => {
            this.props.logout();
            this.props.history.push('/passwordchange');
        }).catch(err => this.setState({msg: err.response.data}));
    }
    render() {
        return (
            <div className="Recover">
                <h2>Reset Password</h2>
                <hr />
                <div>
                    <p>Please enter a new password below.</p>
                    <div className="user-settings">
                        <div>New Password</div>
                        <div><input type="password" name="newPassword" value={this.state.newPassword} onChange={e => this.updateFields(e)} className="field" /></div>
                        <div>Confirm New Password</div>
                        <div><input type="password" name="newPasswordConfirm" value={this.state.newPasswordConfirm} onChange={e => this.updateFields(e)} className="field" /></div>
                    </div>
                    <button className="ui-button" onClick={this.recoverAccount}>Submit</button>
                </div>
                {this.state.msg ? <p><br />{this.state.msg}</p> : null}
            </div>
        )
    }
}

export default Recover;