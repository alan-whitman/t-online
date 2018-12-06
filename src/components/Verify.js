import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

class Verify extends Component {
    constructor() {
        super();
        this.state = {
            verifying: true,
            errMsg: ''
        }
    }
    verify() {
        const queries = queryString.parse(this.props.location.search);
        if (!queries.vc)
            return this.setState({verifying: false, errMsg: 'You appear to have reached this page on accident, or are trying to do something weird, you weirdo.'});
        const verificationCode = queries.vc;
        axios.post('/auth/verify', {verificationCode}).then(res => {
            console.log(res.data);
            this.setState({verifying: false});
        }).catch(err => {this.setState({verifying: false, errMsg: err.response.data})});
    }
    componentDidMount() {
        this.verify();
    }
    render() {
        return (
            <div className="Verify">
                <h2>Email Verification</h2>
                <hr />
                {this.state.verifying ? 
                    <p>Verifying...</p>
                :
                    this.state.errMsg ? 
                        <p>{this.state.errMsg}</p>
                    :
                        <p>Email address verified! Thanks, bro.</p>
                    
                }
            </div>
        )
    }
}

export default Verify;