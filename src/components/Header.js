import React, { Component } from 'react';
import './Header.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import DashboardNav from './DashboardNav';
import { Link } from 'react-router-dom';

class Header extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            email: '',
            registering: false
        }
    }
    login() {
        this.props.login(this.state.username, this.state.password);
        this.setState({username: '', password: ''});
    }
    register() {
        this.props.register(this.state.username, this.state.email, this.state.password);
        this.setState({registering: false, username: '', password: '', email: ''});
    }
    handleInput(e) {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }
    render() {
        return (
            <div className="Header">
                <div className="header-top">
                    <div className="menu-toggle" onClick={this.props.toggleMenu}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="title"><Link to="/">T</Link></div>
                    <div className="authError">{this.props.authError}</div>
                    {this.props.isLoggedIn ? 
                        <div>
                            <span>{this.props.user.username}</span>
                            <button className="login-button" onClick={this.props.logout}>Logout</button>
                        </div>
                    :
                        this.state.registering ?
                            <div>
                                <input name="username" placeholder="Username" value={this.state.username} onChange={e => this.handleInput(e)} /> 
                                <input name="email" placeholder="Email" value={this.state.email} onChange={e => this.handleInput(e)} />
                                <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={e => this.handleInput(e)} />
                                <button className="login-button" onClick={e => this.register()}>Register</button>
                                <button className="login-button" onClick={e => this.setState({registering: false})}>Cancel</button>
                                
                            </div>
                        :
                            <div>
                                <input name="username" placeholder="Username" value={this.state.username} onKeyPress={e => {if (e.key === "Enter") this.login()}} onChange={e => this.handleInput(e)} /> 
                                <input name="password" type="password" placeholder="Password" value={this.state.password} onKeyPress={e => {if (e.key === "Enter") this.login()}} onChange={e => this.handleInput(e)} />
                                <button className="login-button" onClick={e => this.login()}>Login</button>
                                <button className="login-button" onClick={e => this.setState({registering: true})}>Register</button>
                            </div>
                    }
                </div>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="menu"
                    transitionEnter={true}
                    transitionEnterTimeout={200}
                    transitionLeave={true}
                    transitionLeaveTimeout={200}>
                    {this.props.showMenu ?
                        <DashboardNav />
                    : null}
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default Header;