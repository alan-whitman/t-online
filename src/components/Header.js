import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        }
    }
    handleInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }
    render() {
        return (
            <div className="Header">
                <div className="title">T</div>
                {this.props.isLoggedIn ? 
                    <div>{this.props.user.username}</div>
                :
                    <div>
                        <input name="username" placeholder="Username" value={this.state.username} onChange={e => this.handleInput(e)} /> 
                        <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={e => this.handleInput(e)} />
                        <button className="login-button" onClick={e => this.props.login(this.state.username, this.state.password)}>Login</button>
                    </div>
                }
            </div>
        )
    }
}

export default Header;