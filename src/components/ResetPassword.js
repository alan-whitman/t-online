import React, { Component } from 'react';
import axios from 'axios';

class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            msg: '',
            submitted: false
        }
        this.resetPassword = this.resetPassword.bind(this);
    }
    updateField(e) {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }
    resetPassword() {
        const { email } = this.state;
        axios.post('/auth/reset_password_request', {email}).then(res => {
            this.setState({submitted: true});
        }).catch(err => this.setState({msg: err.response.data}));
    }
    render() {
        return (
            <div className="ResetPassword">
                <h2>Reset Password</h2>
                <hr />
                {!this.state.submitted ?
                    <div>
                        <p>Enter your email address below and click the submit button.</p>
                        <input name="email" value={this.state.email} onChange={e => this.updateField(e)} style={{marginBottom: 20}} />
                        <div style={{marginBottom: 20}}>
                            <button className="ui-button" onClick={this.resetPassword}>Submit</button>
                        </div>
                        <p>{this.state.msg}</p>
                    </div>
                :
                    <div>
                        <p>Your request has been submitted. Check your email for additional instructions.</p>
                    </div>
                }
            </div>
        )
    }
}

export default ResetPassword;